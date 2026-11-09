using System.Globalization;
using System.Security.Cryptography;
using System.Text;

var pruefzahl = 0;
void Pruefen(bool bedingung, string beschreibung)
{
    if (!bedingung) throw new Exception($"FEHLGESCHLAGEN: {beschreibung}");
    pruefzahl++;
    Console.WriteLine($"BESTANDEN: {beschreibung}");
}

var dateipfad = "beispieldaten/messwerte.csv";
var vorher = Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(dateipfad)));
foreach (var kultur in new[] { "de-DE", "en-US" })
{
    CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo(kultur);
    var zeilen = CsvLeser.Lesen(dateipfad);
    Pruefen(zeilen.Count == 5 && zeilen.Count(zeile => zeile.Messwert != null) == 4,
        $"{kultur}: fünf Originaldatensätze, vier Zahlen");
    Pruefen(zeilen[4].Zeilennummer == 6 && zeilen[4].Messwert == null &&
        zeilen[4].Fehler!.Contains("M05") && zeilen[4].Fehler!.Contains("ungueltig"),
        $"{kultur}: M05 bleibt Eingabefehler in Zeile 6 ohne Toleranzergebnis");
    Pruefen(zeilen.Take(4).Select(zeile => Toleranz.IstGueltig(zeile.Messwert!, 9.5m, 10.5m))
        .SequenceEqual(new[] { true, true, true, false }), $"{kultur}: Ergebnisse M01–M04");
}
foreach (var (wert, erwartet) in new[] { (9.4m, false), (9.5m, true), (10m, true), (10.5m, true), (10.6m, false) })
    Pruefen(Toleranz.IstGueltig(new Messwert("Grenzfall", wert, "mm"), 9.5m, 10.5m) == erwartet,
        $"Unabhängige Fachregel: {wert.ToString(CultureInfo.InvariantCulture)} mm => {(erwartet ? "innerhalb" : "außerhalb")}");

// Zusätzliche synthetische Fälle liegen nur unter ausgabe/, die Originaldatei bleibt unverändert.
Directory.CreateDirectory("ausgabe/abnahme");
var fehlerdatei = "ausgabe/abnahme/eingaben.csv";
var eingaben = new[]
{
    "", "F01,10,cm", "F02,10", "M01,10,mm", ",10,mm", "F03,1e1,mm",
    "F04, 10,mm", "F05,999999999999999999999999999999,mm", "F06,\"10,0\",mm",
    "F07,\"10,mm", "F08,10.50000000000000000000000000001,mm"
};
File.WriteAllLines(fehlerdatei, new[] { "messung_id,wert,einheit", "M01,10,mm" }
    .Concat(eingaben).Append("F09,9.5,mm"), new UTF8Encoding(false));
var fehlerzeilen = CsvLeser.Lesen(fehlerdatei);
for (var nummer = 0; nummer < eingaben.Length; nummer++)
    Pruefen(fehlerzeilen[nummer + 1].Messwert == null && fehlerzeilen[nummer + 1].Fehler != null &&
        fehlerzeilen[nummer + 1].Zeilennummer == nummer + 3, $"Fehlereingabe in physischer Zeile {nummer + 3} erkannt");
Pruefen(fehlerzeilen[^1].Messwert?.Wert == 9.5m, "Nach fehlerhaften Zeilen wird weitergelesen");
File.WriteAllText(fehlerdatei, "falsche,kopf,zeile\nF01,10,mm\n");
Pruefen(CsvLeser.Lesen(fehlerdatei) is [{ Zeilennummer: 1, Messwert: null }], "Falsche Kopfzeile erkannt");
File.WriteAllText(fehlerdatei, "messung_id,wert,einheit\n");
Pruefen(CsvLeser.Lesen(fehlerdatei) is [{ Zeilennummer: 2, Messwert: null }], "Datei ohne Messdatensätze abgewiesen");
Pruefen(vorher == Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(dateipfad))), "Originaldatei unverändert");
Console.WriteLine($"BESTANDEN: {pruefzahl} Prüfungen; SHA256 {vorher}");
