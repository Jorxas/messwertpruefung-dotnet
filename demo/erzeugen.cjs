// Erzeugt demo/daten.js und die Bilder der Demo aus echten Läufen des Projekts.
// Aufruf im Projektordner:  node demo/erzeugen.cjs
// Voraussetzung: .NET SDK 10 unter Windows (WPF für die Fensterbilder).
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const Messport = require("./port.js");

const wurzel = path.resolve(__dirname, "..");
const umgebung = Object.assign({}, process.env, {
  DOTNET_CLI_HOME: path.join(wurzel, "ausgabe", "dotnet-benutzer"),
  NUGET_PACKAGES: path.join(wurzel, "ausgabe", "nuget-pakete"),
  DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1",
  DOTNET_CLI_TELEMETRY_OPTOUT: "1",
  DOTNET_NOLOGO: "1",
});

// Die Konsole schreibt in der OEM-Codepage (850/437). Nur die benötigten Zeichen umsetzen.
const OEM = { 0x81: "ü", 0x84: "ä", 0x94: "ö", 0x8e: "Ä", 0x99: "Ö", 0x9a: "Ü", 0xe1: "ß", 0xf8: "°" };
function dekodieren(puffer) {
  let text = "";
  for (const b of puffer) text += b < 0x80 ? String.fromCharCode(b) : OEM[b] || "?";
  return text.replace(/\r\n/g, "\n");
}

function ausfuehren(befehl, argumente, optionen) {
  const r = spawnSync(befehl, argumente, Object.assign({ cwd: wurzel, env: umgebung, encoding: null }, optionen));
  if (r.error) throw r.error;
  return { code: r.status, aus: dekodieren(r.stdout), fehler: dekodieren(r.stderr) };
}

// 1. Bauen
let r = ausfuehren("dotnet", ["build", "src/Messungen.csproj", "-c", "Debug", "--nologo", "-v", "q"]);
if (r.code !== 0) throw new Error("Bau fehlgeschlagen:\n" + r.aus + r.fehler);
const dll = path.join(wurzel, "ausgabe", "bin", "Messungen", "Debug", "net10.0", "Messungen.dll");
const version = ausfuehren("dotnet", ["--version"]).aus.trim();

function csvFeld(text) {
  return /[",]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

// 2. Szenarien. Die Eingabedateien stehen als Klartext in demo/eingaben/.
const szenarien = [
  { id: "beispiel", datei: "../beispieldaten/messwerte.csv" },
  {
    id: "grenzen",
    zeilen: ["messung_id,wert,einheit", "G1,9.4,mm", "G2,9.5,mm", "G3,10,mm", "G4,10.50,mm", "G5,10.5,mm", "G6,10.51,mm"],
  },
  {
    id: "formatfehler",
    zeilen: [
      "messung_id,wert,einheit", "F01,10.2,mm", "F02,10.2,cm", "F03,10.2", "F01,10.0,mm", ",10.0,mm",
      "F04,1e1,mm", 'F05,"10,0",mm', "", "F06,10.3,mm",
    ],
  },
  { id: "kopfzeile", zeilen: ["id,wert,einheit", "A1,10.0,mm"] },
  { id: "leer", zeilen: ["messung_id,wert,einheit"] },
];

const MELDUNGEN = [
  [/^Kopfzeile muss/, "kopfzeile"],
  [/^Mindestens ein Messdatensatz fehlt/, "leer"],
  [/^Leerzeilen sind nicht/, "leerzeile"],
  [/^CSV-Zeile ist fehlerhaft/, "csvfehler"],
  [/^Genau drei CSV-Felder/, "felderzahl"],
  [/^Messungskennung fehlt/, "kennung"],
  [/^.+ ist doppelt vorhanden/, "doppelt"],
  [/Einheit muss exakt mm sein/, "einheit"],
  [/keine exakt darstellbare Dezimalzahl/, "format"],
];
function meldungSchluessel(text) {
  for (const [muster, schluessel] of MELDUNGEN) if (muster.test(text)) return schluessel;
  throw new Error("Unbekannte Meldung: " + text);
}

// Zerlegt die echte Konsolenausgabe in Zeilen. Nichts wird berechnet, nur zerlegt.
function zerlegen(ausgabe, fehler) {
  const zeilen = [];
  for (const z of ausgabe.split("\n").filter(Boolean)) {
    const m = /^Zeile (\d+): (.+?), (.+?) (\S+): (innerhalb|außerhalb) der Toleranz$/.exec(z);
    if (!m) throw new Error("Unerwartete Ausgabezeile: " + z);
    zeilen.push({ zeile: +m[1], kennung: m[2], wert: m[3], einheit: m[4], art: m[5] === "innerhalb" ? "innerhalb" : "ausserhalb" });
  }
  for (const z of fehler.split("\n").filter(Boolean)) {
    const m = /^Zeile (\d+): Eingabefehler: (.+)$/.exec(z);
    if (!m) throw new Error("Unerwartete Fehlerzeile: " + z);
    zeilen.push({ zeile: +m[1], art: "fehler", meldung: m[2], schluessel: meldungSchluessel(m[2]) });
  }
  return zeilen.sort((a, b) => a.zeile - b.zeile);
}

const ergebnis = { werkzeug: { dotnet: version }, szenarien: [] };
for (const s of szenarien) {
  let inhalt;
  if (s.datei) inhalt = fs.readFileSync(path.join(__dirname, s.datei), "utf8").replace(/\r\n/g, "\n");
  else inhalt = s.zeilen.join("\n") + "\n";
  const ziel = path.join(__dirname, "eingaben", s.id + ".csv");
  fs.writeFileSync(ziel, inhalt, "utf8");
  const lauf = ausfuehren("dotnet", [dll, ziel]);
  if (lauf.code > 1) throw new Error("Unerwarteter Exitcode " + lauf.code + " bei " + s.id + "\n" + lauf.fehler);
  const zeilen = zerlegen(lauf.aus, lauf.fehler);
  // Der Kopfzeilenfehler wird bei Zeile 1 gemeldet, ein leere Datei bei Zeile 2: beides ohne Erfolgszeile.
  ergebnis.szenarien.push({
    id: s.id,
    datei: "eingaben/" + s.id + ".csv",
    eingabe: inhalt.replace(/\n$/, "").split("\n"),
    exitcode: lauf.code,
    stdout: lauf.aus,
    stderr: lauf.fehler,
    zeilen,
  });
  console.log(s.id, "Exitcode", lauf.code, "Zeilen", zeilen.length);
}

// 3. Treueprüfung des Ports: viele Werte durch den echten C#-Code, Zeile für Zeile verglichen.
const werte = [];
for (let h = 900; h <= 1100; h += 5) werte.push((h / 100).toFixed(2));
for (let h = 940; h <= 1060; h += 1) werte.push((h / 100).toFixed(2).replace(/0$/, ""));
werte.push(
  "9.5", "9.50", "10", "10.0", "10.5", "10.50", "10.500000000000000000000000000", "10.50000000000000000000000000001",
  "10.5000000000000000000000000001", "0", "-0", "-0.0", "0.0", "007.5", "-10", "-9.5", "+10", "10.", ".5", "1e1", "1E1",
  "10,0", " 10", "10 ", "ungueltig", "", "NaN", "Infinity", "0x10", "10.5.1", "--1", "1_0",
  "79228162514264337593543950335", "79228162514264337593543950336", "7922816251426433759354395033.5",
  "0.0000000000000000000000000001", "0.00000000000000000000000000001", "99999999999999999999999999999999",
);
const einheiten = ["mm", "cm", "MM", "mm "];
const dateiZeilen = ["messung_id,wert,einheit"];
const erwartet = [];
werte.forEach((w, i) => {
  const einheit = i < 40 ? einheiten[i % 4] : "mm";
  dateiZeilen.push(`T${i + 1},${csvFeld(w)},${einheit}`);
  erwartet.push({ wert: w, einheit });
});
const gitter = path.join(wurzel, "ausgabe", "gitter.csv");
fs.mkdirSync(path.dirname(gitter), { recursive: true });
fs.writeFileSync(gitter, dateiZeilen.join("\n") + "\n", "utf8");
const lauf = ausfuehren("dotnet", [dll, gitter]);
const echt = zerlegen(lauf.aus, lauf.fehler);
if (echt.length !== erwartet.length) throw new Error("Zeilenzahl weicht ab: " + echt.length + " statt " + erwartet.length);
let abweichungen = 0;
echt.forEach((z, i) => {
  const e = erwartet[i];
  const p = Messport.pruefen(e.wert, e.einheit);
  const gleich = z.art === p.art && (z.art === "fehler" ? z.schluessel === p.schluessel : z.wert === p.wert && z.einheit === p.einheit);
  if (!gleich) {
    abweichungen++;
    console.log("ABWEICHUNG", JSON.stringify(e), JSON.stringify(z), JSON.stringify(p));
  }
});
if (abweichungen) throw new Error(abweichungen + " Abweichungen zwischen Port und C#-Lauf");
const arten = { innerhalb: 0, ausserhalb: 0, fehler: 0 };
echt.forEach((z) => arten[z.art]++);
ergebnis.treue = { werte: erwartet.length, abweichungen: 0, arten };
console.log("Treueprüfung Port gegen C#:", erwartet.length, "Zeilen, 0 Abweichungen", JSON.stringify(arten));
// Die Paare bleiben für den Browsertest erhalten.
ergebnis.treuepaare = echt.map((z, i) => ({
  wert: erwartet[i].wert, einheit: erwartet[i].einheit, art: z.art, schluessel: z.schluessel || null, anzeige: z.wert || null,
}));

// 4. Fachprüfungen des Projekts selbst
r = ausfuehren("dotnet", ["run", "--project", "nachweise/P05-T02_abnahme.csproj"]);
if (r.code !== 0) throw new Error("Fachprüfung fehlgeschlagen:\n" + r.aus + r.fehler);
const mz = /BESTANDEN: (\d+) Pr/.exec(r.aus.trim().split("\n").at(-1));
ergebnis.fachpruefung = { anzahl: mz ? +mz[1] : null, exitcode: r.code };
console.log("Fachprüfung:", ergebnis.fachpruefung.anzahl, "Prüfungen");

// 5. WPF-Fenster: echte Fensterbilder aus der Abnahme des Projekts. Der Lauf findet in einem
//    neutralen Ordner statt, damit kein privater Pfad im Bild steht.
const neutral = process.env.DEMO_NEUTRAL || "C:\\Projekt\\messwertpruefung-dotnet";
fs.rmSync(neutral, { recursive: true, force: true });
fs.mkdirSync(neutral, { recursive: true });
for (const e of fs.readdirSync(wurzel)) {
  if (["ausgabe", ".git", "demo", "tools", "node_modules"].includes(e)) continue;
  fs.cpSync(path.join(wurzel, e), path.join(neutral, e), { recursive: true });
}
const umg2 = Object.assign({}, umgebung, {
  DOTNET_CLI_HOME: path.join(neutral, "ausgabe", "dotnet-benutzer"),
  NUGET_PACKAGES: path.join(neutral, "ausgabe", "nuget-pakete"),
});
r = ausfuehren("dotnet", ["run", "--project", "nachweise/P05-T03_abnahme.csproj"], { cwd: neutral, env: umg2 });
if (r.code !== 0) throw new Error("WPF-Abnahme fehlgeschlagen:\n" + r.aus + r.fehler);
const abschluss = r.aus.trim().split("\n").at(-1);
const mw = /(\d+) Pr/.exec(abschluss);
ergebnis.wpf = { pruefungen: mw ? +mw[1] : null, exitcode: r.code };
for (const n of ["beispieldaten", "dateifehler"]) {
  fs.copyFileSync(path.join(neutral, "nachweise", `P05-T03_wpf-${n}.png`), path.join(__dirname, "bilder", `wpf-${n}.png`));
}
fs.rmSync(neutral, { recursive: true, force: true });
console.log("WPF:", abschluss);

fs.writeFileSync(
  path.join(__dirname, "daten.js"),
  "// Erzeugt von demo/erzeugen.cjs aus echten Läufen. Nicht von Hand ändern.\nwindow.DEMO_DATEN = " + JSON.stringify(ergebnis, null, 1) + ";\n",
  "utf8",
);
console.log("demo/daten.js geschrieben");
