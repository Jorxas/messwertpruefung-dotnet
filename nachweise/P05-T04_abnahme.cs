using System;
using System.Linq;
using System.Windows.Interop;
using System.IO;
using System.Security.Cryptography;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using Messansicht;

internal static class Ansichtsabnahme
{
    private static int pruefzahl;

    [STAThread]
    private static int Main()
    {
        Messfenster? fenster = null;
        try
        {
            var bildschirm = System.Windows.Forms.Screen.AllScreens.FirstOrDefault(s => !s.Primary)
                ?? throw new InvalidOperationException("Zweiter Bildschirm für diese Bedienabnahme erforderlich.");
            fenster = new Messfenster { WindowStartupLocation = WindowStartupLocation.Manual };
            var griff = new WindowInteropHelper(fenster).EnsureHandle();
            var skalierung = VisualTreeHelper.GetDpi(fenster);
            fenster.Left = (bildschirm.WorkingArea.Left + 60) / skalierung.DpiScaleX;
            fenster.Top = (bildschirm.WorkingArea.Top + 60) / skalierung.DpiScaleY;
            Pruefen("Prüffenster vor dem Anzeigen auf zweitem Bildschirm", !System.Windows.Forms.Screen.FromHandle(griff).Primary);
            fenster.Show();
            var tabelle = (DataGrid)fenster.FindName("Ergebnistabelle");
            var meldung = (TextBlock)fenster.FindName("Meldungsanzeige");
            var datei = Path.GetFullPath("beispieldaten/messwerte.csv");
            Pruefen("Unveränderte fünf synthetische Datensätze", Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(datei))) ==
                "491DC3508750CFADF546DC427563D995420778B8CE1B72B9EE8316730B72E644");
            Pruefen("Leerer Startzustand", tabelle.Items.Count == 0 && meldung.Text.Contains("auswählen"));
            fenster.DateiLaden(datei);
            var zeilen = tabelle.Items.Cast<Ergebniszeile>().ToArray();
            Pruefen("Fünf Ergebniszeilen", zeilen.Length == 5);
            Pruefen("Ausgewählte Datei sichtbar", ((TextBlock)fenster.FindName("Dateianzeige")).Text == datei);
            Pruefen("Wert und Einheit sichtbar", zeilen[0].Wert == "9,5" && zeilen[0].Einheit == "mm");
            Pruefen("M01 bis M03 innerhalb einschließlich Grenzen", zeilen.Take(3).All(zeile => zeile.Ergebnis == "Innerhalb der Toleranz"));
            Pruefen("M04 außerhalb", zeilen[3].Kennung == "M04" && zeilen[3].Ergebnis == "Außerhalb der Toleranz");
            Pruefen("M05 als Fehler in physischer Zeile 6", zeilen[4].Zeile == 6 && zeilen[4].Ergebnis.Contains("M05") &&
                zeilen[4].Ergebnis.Contains("ungueltig") && zeilen[4].Ergebnis.Contains("Eingabefehler in Zeile 6"));
            Pruefen("Fehler erhält kein Toleranzergebnis", zeilen[4].Wert == "—" && !zeilen[4].Ergebnis.Contains("der Toleranz"));
            Pruefen("Korrekturhinweis und Anzahl sichtbar", meldung.Text.Contains("4 Messwerte geprüft; 1 Eingabefehler") && meldung.Text.Contains("korrigieren"));
            BildSichern(fenster, "nachweise/P05-T04_wpf-beispieldaten.png");

            var fehlend = Path.GetFullPath("ausgabe/P05-T04-nicht-vorhanden.csv");
            Pruefen("Fehlerdatei existiert tatsächlich nicht", !File.Exists(fehlend));
            fenster.DateiLaden(fehlend);
            Pruefen("Fehlende Datei verständlich gemeldet", meldung.Text.Contains("nicht gefunden") && meldung.Text.Contains("Dateipfad prüfen"));
            Pruefen("Keine alten Ergebnisse beim Dateifehler", tabelle.Items.Count == 0);
            BildSichern(fenster, "nachweise/P05-T04_wpf-dateifehler.png");
            fenster.DateiLaden(datei);
            Pruefen("Erneutes Laden nach Fehler möglich", tabelle.Items.Count == 5 && meldung.Text.Contains("1 Eingabefehler"));
            Console.WriteLine($"BESTANDEN: {pruefzahl} Prüfungen an echtem WPF-Fenster. Native Dateidialogprüfung vom 17. November liegt separat unter T03 vor.");
            return 0;
        }
        catch (Exception ausnahme)
        {
            Console.Error.WriteLine($"ABNAHME FEHLGESCHLAGEN: {ausnahme}");
            return 1;
        }
        finally { fenster?.Close(); }
    }

    private static void Pruefen(string beschreibung, bool erfuellt)
    {
        if (!erfuellt) throw new InvalidOperationException(beschreibung);
        pruefzahl++;
        Console.WriteLine($"BESTANDEN: {beschreibung}");
    }

    private static void BildSichern(Window fenster, string pfad)
    {
        fenster.Dispatcher.Invoke(() => { }, DispatcherPriority.ContextIdle);
        fenster.UpdateLayout();
        var bild = new RenderTargetBitmap((int)fenster.ActualWidth, (int)fenster.ActualHeight, 96, 96, PixelFormats.Pbgra32);
        var hintergrund = new DrawingVisual();
        using (var zeichnung = hintergrund.RenderOpen())
            zeichnung.DrawRectangle(fenster.Background, null, new Rect(0, 0, fenster.ActualWidth, fenster.ActualHeight));
        bild.Render(hintergrund);
        bild.Render(fenster);
        var kodierer = new PngBitmapEncoder();
        kodierer.Frames.Add(BitmapFrame.Create(bild));
        using var datei = File.Create(pfad);
        kodierer.Save(datei);
    }
}
