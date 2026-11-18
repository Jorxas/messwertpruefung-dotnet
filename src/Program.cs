using System.Globalization;
using System.Text.Json;

if (args.Length > 1)
{
    Console.Error.WriteLine("Aufruf: dotnet run --project src/Messungen.csproj -- [CSV-Datei]");
    return 2;
}

try
{
    using var konfiguration = JsonDocument.Parse(File.ReadAllText("projekt.json"));
    var regel = konfiguration.RootElement.GetProperty("toleranzregel");
    var untergrenze = decimal.Parse(regel.GetProperty("untergrenze").GetString()!, CultureInfo.InvariantCulture);
    var obergrenze = decimal.Parse(regel.GetProperty("obergrenze").GetString()!, CultureInfo.InvariantCulture);
    if (regel.GetProperty("einheit").GetString() != "mm" ||
        !regel.GetProperty("grenzenEingeschlossen").GetBoolean() || untergrenze > obergrenze)
        throw new ArgumentException("Die Regel muss inklusive Grenzen in mm festlegen; Untergrenze höchstens Obergrenze.");

    var fehlerzahl = 0;
    var dateipfad = args.Length == 1 ? args[0] : "beispieldaten/messwerte.csv";
    foreach (var zeile in CsvLeser.Lesen(dateipfad))
    {
        if (zeile.Messwert is not { } messwert)
        {
            Console.Error.WriteLine($"Zeile {zeile.Zeilennummer}: Eingabefehler: {zeile.Fehler}");
            fehlerzahl++;
            continue;
        }

        var ergebnis = Toleranz.IstGueltig(messwert, untergrenze, obergrenze)
            ? "innerhalb der Toleranz" : "außerhalb der Toleranz";
        Console.WriteLine($"Zeile {zeile.Zeilennummer}: {messwert.Kennung}, {messwert.Wert.ToString(CultureInfo.InvariantCulture)} {messwert.Einheit}: {ergebnis}");
    }
    return fehlerzahl == 0 ? 0 : 1;
}
catch (Exception ausnahme) when (ausnahme is IOException or UnauthorizedAccessException
    or JsonException or KeyNotFoundException or FormatException or OverflowException
    or ArgumentException or InvalidOperationException)
{
    Console.Error.WriteLine(ausnahme is FileNotFoundException or DirectoryNotFoundException
        ? "Die Eingabe- oder Konfigurationsdatei fehlt. Dateipfad prüfen."
        : "Datei oder Konfiguration kann nicht verarbeitet werden. Leserechte, UTF-8 und Toleranzregel prüfen.");
    return 2;
}
