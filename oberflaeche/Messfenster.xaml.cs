using System.Globalization;
using System.IO;
using System.Text.Json;
using System.Windows;
using Microsoft.Win32;

namespace Messansicht;

public sealed record Ergebniszeile(int Zeile, string Kennung, string Wert, string Einheit, string Ergebnis);

public partial class Messfenster : Window
{
    public Messfenster() => InitializeComponent();

    private void DateiAuswaehlen(object sender, RoutedEventArgs ereignis)
    {
        var auswahl = new OpenFileDialog
        {
            Title = "Messdatei auswählen",
            Filter = "CSV-Dateien (*.csv)|*.csv",
            InitialDirectory = Path.Combine(AppContext.BaseDirectory, "beispieldaten"),
            Multiselect = false,
            CheckFileExists = true
        };
        if (auswahl.ShowDialog(this) == true)
            DateiLaden(auswahl.FileName);
    }

    public void DateiLaden(string dateipfad)
    {
        // Vor jedem Versuch alte Ergebnisse entfernen, damit sie nicht zur neuen Datei erscheinen.
        Ergebnistabelle.ItemsSource = null;
        Dateianzeige.Text = dateipfad;
        Regelanzeige.Text = "Toleranzregel wird aus projekt.json gelesen.";
        try
        {
            using var konfiguration = JsonDocument.Parse(
                File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "projekt.json")));
            var regel = konfiguration.RootElement.GetProperty("toleranzregel");
            var untergrenze = decimal.Parse(regel.GetProperty("untergrenze").GetString()!, CultureInfo.InvariantCulture);
            var obergrenze = decimal.Parse(regel.GetProperty("obergrenze").GetString()!, CultureInfo.InvariantCulture);
            if (regel.GetProperty("einheit").GetString() != "mm" ||
                !regel.GetProperty("grenzenEingeschlossen").GetBoolean() || untergrenze > obergrenze)
                throw new ArgumentException("Die Toleranzregel muss inklusive Grenzen in mm festlegen.");

            Regelanzeige.Text = $"Toleranz: {untergrenze.ToString(CultureInfo.GetCultureInfo("de-DE"))} bis " +
                $"{obergrenze.ToString(CultureInfo.GetCultureInfo("de-DE"))} mm · beide Grenzen eingeschlossen";
            var ergebnisse = new List<Ergebniszeile>();
            var fehlerzahl = 0;
            foreach (var zeile in CsvLeser.Lesen(dateipfad))
            {
                if (zeile.Messwert is not { } messwert)
                {
                    fehlerzahl++;
                    ergebnisse.Add(new(zeile.Zeilennummer, "—", "—", "—",
                        $"Eingabefehler in Zeile {zeile.Zeilennummer}: {zeile.Fehler}"));
                    continue;
                }
                ergebnisse.Add(new(zeile.Zeilennummer, messwert.Kennung,
                    messwert.Wert.ToString(CultureInfo.GetCultureInfo("de-DE")), messwert.Einheit,
                    Toleranz.IstGueltig(messwert, untergrenze, obergrenze)
                        ? "Innerhalb der Toleranz" : "Außerhalb der Toleranz"));
            }
            Ergebnistabelle.ItemsSource = ergebnisse;
            Meldungsanzeige.Text = fehlerzahl == 0
                ? $"{ergebnisse.Count} Messwerte geprüft."
                : $"{ergebnisse.Count - fehlerzahl} Messwerte geprüft; {fehlerzahl} Eingabefehler. " +
                  "Betroffene Zeilen in der CSV-Datei korrigieren und die Datei erneut auswählen. Erwartet: Dezimalzahl mit Punkt, Einheit mm.";
        }
        catch (Exception ausnahme) when (ausnahme is IOException or UnauthorizedAccessException
            or JsonException or KeyNotFoundException or FormatException or OverflowException
            or ArgumentException or InvalidOperationException)
        {
            Meldungsanzeige.Text = ausnahme is FileNotFoundException or DirectoryNotFoundException
                ? "Messdatei oder projekt.json nicht gefunden. Dateipfad prüfen und die CSV-Datei erneut auswählen."
                : "Datei kann nicht verarbeitet werden. Leserechte, UTF-8, CSV-Format und Toleranzregel in projekt.json prüfen.";
        }
    }
}
