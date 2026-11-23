// Browserprüfung der Demo. Die Seite wird wie auf GitHub Pages unter /messwertpruefung-dotnet/ ausgeliefert.
// Aufruf: node tools/browser-pruefen.cjs [--ordner=<Ordner>] [--bild=<Präfix>]
// Ohne --ordner wird demo/ geprüft, mit --ordner z. B. ein Klon des Zweigs gh-pages.
// Braucht puppeteer-core (NODE_PATH) und einen installierten Chrome oder Edge (BROWSER_PFAD).
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer-core");

const argument = (name) => process.argv.find((a) => a.startsWith("--" + name + "="))?.slice(name.length + 3);
const ordner = path.resolve(argument("ordner") || path.join(__dirname, "..", "demo"));
const bild = argument("bild");
const REPO = "messwertpruefung-dotnet";
const typen = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".csv": "text/csv" };

const server = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, "http://x").pathname);
  if (!p.startsWith("/" + REPO + "/")) { r.statusCode = 404; return r.end("nicht gefunden"); }
  p = p.slice(REPO.length + 1);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(ordner, p);
  if (!f.startsWith(ordner) || !fs.existsSync(f)) { r.statusCode = 404; return r.end("nicht gefunden"); }
  r.setHeader("Content-Type", typen[path.extname(f)] || "application/octet-stream");
  r.end(fs.readFileSync(f));
});
const browserPfad = process.env.BROWSER_PFAD || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((f) => fs.existsSync(f));
if (!browserPfad) throw new Error("BROWSER_PFAD auf einen installierten Chrome oder Edge setzen.");
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const basis = `http://127.0.0.1:${server.address().port}/${REPO}/`;
  const browser = await puppeteer.launch({ executablePath: browserPfad, headless: true });
  const fehler = [], extern = [];
  try {
    const s = await browser.newPage();
    s.on("pageerror", (e) => fehler.push("Seitenfehler: " + e.message));
    s.on("console", (m) => { if (m.type() === "error") fehler.push("Konsole: " + m.text()); });
    s.on("requestfailed", (r) => fehler.push("Anfrage fehlgeschlagen: " + r.url()));
    s.on("response", (r) => { if (r.status() >= 400) fehler.push("HTTP " + r.status() + ": " + r.url()); });
    s.on("request", (r) => { if (!r.url().startsWith("data:") && new URL(r.url()).hostname !== "127.0.0.1") extern.push(r.url()); });
    const text = () => s.$eval("body", (e) => e.innerText);
    const ueberlauf = () => s.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth);
    const zeilen = () => s.$$eval("#ergebnis tbody tr", (z) => z.length);

    // Deutsch ist die Standardsprache
    await s.setViewport({ width: 1280, height: 900 });
    await s.goto(basis, { waitUntil: "networkidle0" });
    assert.equal(await s.evaluate(() => document.documentElement.lang), "de", "Standardsprache de");
    assert.equal(await s.$eval("h1", (e) => e.textContent), "Messwerte prüfen");
    assert.equal(await s.$$eval("[role=tab]", (t) => t.length), 5, "fünf Szenarien");
    assert.equal(await zeilen(), 5, "Beispieldatei: fünf Zeilen");
    assert((await s.$eval("#stderr", (e) => e.textContent)).includes("Zeile 6: Eingabefehler: M05"), "echte Fehlerausgabe sichtbar");
    assert((await text()).includes("Ausgabe eines echten Laufs des Projekts"), "Kennzeichnung echter Läufe");
    assert((await s.$$eval(".sprache button", (b) => b.map((x) => x.getAttribute("aria-pressed")))).join() === "true,false");
    const bilderGeladen = await s.$$eval(".bilder img", (i) => i.every((x) => x.complete && x.naturalWidth > 0));
    assert(bilderGeladen, "WPF-Bilder geladen");
    if (bild) await s.screenshot({ path: path.resolve(bild + "-desktop.png"), fullPage: true });

    // Szenarien und Tastaturbedienung
    await s.click("#tab-formatfehler");
    assert.equal(await zeilen(), 9, "Formatfehler: neun Ergebniszeilen");
    await s.focus("#tab-formatfehler");
    await s.keyboard.press("ArrowRight");
    assert.equal(await s.$eval("[role=tab][aria-selected=true]", (e) => e.id), "tab-kopfzeile", "Pfeiltaste wechselt das Szenario");
    assert.equal(await zeilen(), 1, "Kopfzeile: eine Fehlerzeile");
    await s.click("#tab-grenzen");
    assert.equal(await s.$$eval("#ergebnis .badge.innerhalb", (b) => b.length), 4, "Grenzwerte: vier innerhalb");

    // Einzelwert (Port), das Ergebnis ist mit dem echten Lauf verglichen
    for (const [eingabe, art] of [["10.6", "ausserhalb"], ["10.5", "innerhalb"], ["9.4999", "ausserhalb"], ["1e1", "fehler"], ["10,0", "fehler"]]) {
      await s.$eval("#wert", (e) => { e.value = ""; });
      await s.type("#wert", eingabe);
      assert((await s.$eval("#urteil", (e) => e.className)).includes(art), `Einzelwert ${eingabe} -> ${art}`);
    }
    await s.select("#einheit", "cm");
    assert((await s.$eval("#urteil", (e) => e.className)).includes("fehler"), "Einheit cm ist ein Fehler");
    await s.select("#einheit", "mm");
    const treue = await s.evaluate(() => {
      const abw = [];
      for (const p of window.DEMO_DATEN.treuepaare) {
        const r = window.Messport.pruefen(p.wert, p.einheit);
        const ok = r.art === p.art && (p.art === "fehler" ? r.schluessel === p.schluessel : r.wert === p.anzeige);
        if (!ok) abw.push(p.wert);
      }
      return { n: window.DEMO_DATEN.treuepaare.length, abw };
    });
    assert.equal(treue.n, 200);
    assert.deepEqual(treue.abw, [], "Port stimmt mit dem echten C#-Lauf überein");

    // Französisch und zurück
    await s.click("#tab-beispiel");
    await s.click('.sprache button[data-lang="fr"]');
    assert.equal(await s.evaluate(() => document.documentElement.lang), "fr", "Umschalten auf fr");
    assert.equal(await s.$eval("h1", (e) => e.textContent), "Vérifier des mesures");
    assert((await text()).includes("Sortie d'une vraie exécution du projet"), "französische Kennzeichnung");
    assert((await s.$eval("#tab-grenzen", (e) => e.textContent)) === "Valeurs limites");
    assert((await s.evaluate(() => location.search)).includes("lang=fr"), "?lang=fr in der Adresse");
    assert.equal(await zeilen(), 5);
    assert((await s.$eval("#ergebnis", (e) => e.innerText)).includes("Erreur de saisie"), "Fehlerzeile französisch");
    if (bild) await s.screenshot({ path: path.resolve(bild + "-desktop-fr.png"), fullPage: true });
    await s.click('.sprache button[data-lang="de"]');
    assert.equal(await s.evaluate(() => document.documentElement.lang), "de", "zurück auf de");
    assert.equal(await s.$eval("h1", (e) => e.textContent), "Messwerte prüfen");
    assert(!(await s.evaluate(() => location.search)).includes("lang"), "lang aus der Adresse entfernt");

    // Direktaufruf mit ?lang=fr
    await s.goto(basis + "?lang=fr", { waitUntil: "networkidle0" });
    assert.equal(await s.evaluate(() => document.documentElement.lang), "fr", "?lang=fr direkt");

    // Typografie: keine Gedankenstriche als Satzverbinder
    for (const sprache of ["de", "fr"]) {
      await s.goto(basis + (sprache === "fr" ? "?lang=fr" : ""), { waitUntil: "networkidle0" });
      assert(!/[–—]/.test(await text()), "keine Gedankenstriche im Text (" + sprache + ")");
    }

    // Handy: kein horizontaler Überlauf, in beiden Sprachen und allen Szenarien
    await s.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    for (const sprache of ["de", "fr"]) {
      await s.goto(basis + (sprache === "fr" ? "?lang=fr" : ""), { waitUntil: "networkidle0" });
      for (const id of ["beispiel", "grenzen", "formatfehler", "kopfzeile", "leer"]) {
        await s.click("#tab-" + id);
        await warte(50);
        assert(!(await ueberlauf()), `kein horizontaler Überlauf bei 390 px (${sprache}, ${id})`);
      }
      await s.click("#tab-formatfehler");
      await s.evaluate(() => { document.querySelector(".konsole").open = true; });
      assert(!(await ueberlauf()), `kein Überlauf mit offener Konsole (${sprache})`);
      if (bild) await s.screenshot({ path: path.resolve(bild + "-handy-" + sprache + ".png"), fullPage: true });
    }
  } finally {
    await browser.close();
    server.close();
  }
  assert.deepEqual(fehler, [], "keine Laufzeitfehler");
  assert.deepEqual(extern, [], "keine externen Anfragen");
  console.log("Browserprüfung bestanden: DE Standard, Wechsel auf FR und zurück, ?lang=fr, Szenarien, Tastatur, Einzelwert, Portvergleich, 390 px ohne Überlauf; keine Fehler, keine externen Anfragen.");
})().catch((e) => { console.error(e); process.exitCode = 1; server.close(); });
