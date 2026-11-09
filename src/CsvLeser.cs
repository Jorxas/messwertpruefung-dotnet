using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.VisualBasic.FileIO;

public sealed record Messzeile(int Zeilennummer, Messwert? Messwert, string? Fehler);

public static class CsvLeser
{
    public static IReadOnlyList<Messzeile> Lesen(string dateipfad)
    {
        using var leser = new StreamReader(dateipfad, new UTF8Encoding(false, true));
        var ergebnisse = new List<Messzeile>();
        if (leser.ReadLine() != "messung_id,wert,einheit")
            return [new Messzeile(1, null, "Kopfzeile muss messung_id,wert,einheit lauten.")];

        var kennungen = new HashSet<string>(StringComparer.Ordinal);
        var zeilennummer = 1;
        while (leser.ReadLine() is { } zeile)
        {
            zeilennummer++;
            ergebnisse.Add(LesenZeile(zeile, zeilennummer, kennungen));
        }
        if (zeilennummer == 1)
            ergebnisse.Add(new Messzeile(2, null, "Mindestens ein Messdatensatz fehlt."));
        return ergebnisse;
    }

    private static Messzeile LesenZeile(string zeile, int zeilennummer, HashSet<string> kennungen)
    {
        Messzeile Fehler(string meldung) => new(zeilennummer, null, meldung);
        if (string.IsNullOrWhiteSpace(zeile))
            return Fehler("Leerzeilen sind nicht zulässig.");

        // Pro physischer Zeile parsen: Zeilenumbrüche in CSV-Feldern sind nicht zulässig.
        using var parser = new TextFieldParser(new StringReader(zeile));
        parser.SetDelimiters(",");
        parser.HasFieldsEnclosedInQuotes = true;
        parser.TrimWhiteSpace = false;
        string[]? felder;
        try
        {
            felder = parser.ReadFields();
        }
        catch (MalformedLineException)
        {
            return Fehler("CSV-Zeile ist fehlerhaft; Felder müssen in einer Zeile stehen.");
        }
        if (felder is null || felder.Length != 3)
            return Fehler("Genau drei CSV-Felder werden erwartet.");
        var kennung = felder[0];
        if (string.IsNullOrWhiteSpace(kennung))
            return Fehler("Messungskennung fehlt.");
        if (!kennungen.Add(kennung))
            return Fehler($"Messungskennung {kennung} ist doppelt vorhanden.");
        if (felder[2] != "mm")
            return Fehler($"{kennung}: Einheit muss exakt mm sein.");
        if (!Regex.IsMatch(felder[1], @"^-?[0-9]+(?:\.[0-9]+)?$", RegexOptions.CultureInvariant) ||
            !decimal.TryParse(felder[1], NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint,
                CultureInfo.InvariantCulture, out var wert) ||
            Zahltext(felder[1]) != Zahltext(wert.ToString(CultureInfo.InvariantCulture)))
            return Fehler($"{kennung}: Wert '{felder[1]}' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.");

        return new Messzeile(zeilennummer, new Messwert(kennung, wert, felder[2]), null);
    }

    // decimal.TryParse kann zu genaue Eingaben runden. Den exakten Zahltext vergleichen.
    private static string Zahltext(string text)
    {
        var negativ = text.StartsWith('-');
        var teile = text.TrimStart('-').Split('.');
        var ganzzahl = teile[0].TrimStart('0');
        if (ganzzahl.Length == 0) ganzzahl = "0";
        var nachkomma = teile.Length == 2 ? teile[1].TrimEnd('0') : "";
        var vorzeichen = negativ && (ganzzahl != "0" || nachkomma.Length > 0) ? "-" : "";
        return vorzeichen + ganzzahl + (nachkomma.Length > 0 ? "." + nachkomma : "");
    }
}
