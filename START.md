# Technischer Einstieg — P05

## P05-T01 lokal prüfen

Im Projektordner ausführen:

~~~powershell
uv run --offline --python 3.12 python -X utf8 nachweise/P05-T01_formatcheck.py
~~~

Verwendet die vorhandene Python-Laufzeit und nur die Standardbibliothek; tatsächlich ausgeführt mit Python 3.12.14 und uv 0.12.13. Der UV-Cache liegt laut vorhandener Umgebung unter `ausgabe/uv-zwischenspeicher`. Keine Installation oder Netzverbindung erforderlich.

Erwartete Ausgabe: fünf Datensätze und eindeutige Kennungen, Einheit mm, vier numerische Werte, erwarteter Eingabefehler M05 in Zeile 6, abschließend `BESTANDEN`. Unerwartete Befunde führen zu Exitcode 1. Der erfolgreiche Exitcode 0 bestätigt den Dateicheck einschließlich des bekannten Fehlers; er erklärt M05 nicht zu einem gültigen Messwert. [Festgelegtes Format und Sollfälle](tickets/P05-T01.md), [Nachweis](nachweise/P05-T01_pruefprotokoll.md).

## C#-Prüfung P05-T02 ausführen

Voraussetzung: vorhandenes .NET SDK 10.0.102 für Windows, Ziel `net10.0`; tatsächlich auf Microsoft.NETCore.App 10.0.10 ausgeführt. Keine externen NuGet-Pakete. Alle folgenden Befehle aus diesem Projektordner ausführen, damit `projekt.json` gefunden wird.

~~~powershell
$env:DOTNET_CLI_HOME = Join-Path $PWD 'ausgabe/dotnet-benutzer'
$env:NUGET_PACKAGES = Join-Path $PWD 'ausgabe/nuget-pakete'
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = '1'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_CLI_UI_LANGUAGE = 'de'
$env:DOTNET_NOLOGO = '1'
$env:DOTNET_ADD_GLOBAL_TOOLS_TO_PATH = '0'
dotnet run --project nachweise/P05-T02_abnahme.csproj
dotnet run --no-restore --project src/Messungen.csproj
~~~

Erster Befehl: 26 Prüfungen, Exitcode 0. Zweiter Befehl: M01–M03 innerhalb, M04 außerhalb, M05 als Eingabefehler in Zeile 6; **Exitcode 1 ist hier erwartet**. Die Konsole gibt gültige Messungen auf Standardausgabe und Eingabefehler auf Standardfehler aus. Eine Toleranzabweichung allein führt nicht zu einem Fehlercode.

Optionale andere Datei: `dotnet run --no-restore --project src/Messungen.csproj -- pfad/zur/datei.csv`. Exitcodes: 0 = ohne Eingabefehler, 1 = CSV-/Zeilenfehler, 2 = Datei-, Konfigurations- oder Aufruffehler. Ohne vorherigen Abnahmelauf beim ersten Start `--no-restore` weglassen.

`NuGet.Config` enthält keine Paketquellen. `Directory.Build.props` legt Bauausgaben unter `ausgabe/` ab; die Umgebungsvariablen begrenzen benutzerspezifische .NET-/NuGet-Ausgaben auf diesen Projektordner. Der Prüflauf erzeugt zusätzliche synthetische Dateien ausschließlich unter `ausgabe/abnahme/`.

Grenzen: vereinbartes dreispaltiges CSV mit einer physischen Zeile je Datensatz, Dezimalpunkt und Einheit mm; keine Umrechnung oder Rundung. CSV-Anführungszeichen werden unterstützt, Zeilenumbrüche in Feldern abgewiesen. Die Datei wird vollständig in den Speicher gelesen; keine Auslegung für große Messreihen. [Abnahme und Nachweise](nachweise/P05-T02_pruefprotokoll.md).

Die gesamte kleine Abnahme einschließlich drei Konsolenfällen und `git diff --check -- .` lässt sich in der vorhandenen Windows PowerShell mit `& ./nachweise/P05-T02_pruefen.ps1` wiederholen. PowerShell 7 (`pwsh`) ist nicht installiert und wird nicht benötigt. Das Skript und das Abnahmeprojekt müssen zusammen mit den Quelldateien im gesicherten Stand enthalten sein; `nachweise/` ist standardmäßig von Git ausgeschlossen.

Für P05-T02 wurde WPF weder erstellt noch geprüft. Der spätere Stand P05-T03 steht im folgenden Abschnitt; die Gesamtabnahme bleibt offen.

## WPF-Ansicht P05-T03

Voraussetzungen: Windows, vorhandenes .NET SDK 10.0.102 und Microsoft.WindowsDesktop.App 10.0.10. Keine zusätzlichen Pakete oder Downloads. Aus dem Projektordner mit den oben genannten .NET-Umgebungsvariablen starten:

~~~powershell
dotnet run --project oberflaeche/Messansicht.csproj
~~~

„CSV-Datei auswählen …“ öffnet den nativen Dateidialog. `beispieldaten/messwerte.csv` auswählen. Erwartet: Dateipfad, fünf Tabellenzeilen; M01 bis M03 innerhalb, M04 außerhalb, M05 als Eingabefehler in physischer Zeile 6 mit Korrekturhinweis. Zahlen werden mit deutschem Dezimalkomma angezeigt; die CSV erwartet weiterhin einen Dezimalpunkt. Fehlerhafte Zeilen erhalten „—“ in den nicht verfügbaren Messfeldern. Abbrechen soll den bisherigen Stand behalten.

Konfiguration und unveränderte Beispieldatei werden beim Bauen in den Ausgabeordner kopiert. Die Oberfläche liest `projekt.json` relativ zur ausführbaren Datei, unabhängig vom aktuellen Arbeitsverzeichnis. Toleranzregel im Projekt ändern und erneut bauen, um sie zu übernehmen.

Kleinste automatisierte Prüfung in der vorhandenen Windows PowerShell:

~~~powershell
& ./nachweise/P05-T03_pruefen.ps1
~~~

Das Skript führt `dotnet run --project nachweise/P05-T03_abnahme.csproj` und `git diff --check -- .` aus. Tatsächlich bestanden: 14 Prüfungen an einem echten angezeigten WPF-Fenster, Exitcode 0. Die Abnahme lädt die Datei über dieselbe Fenstermethode wie der Dateidialog und prüft auch eine fehlende Datei sowie erneutes Laden. Sie rendert zwei PNGs direkt aus WPF. Diese Prüfung bedient den nativen Dateidialog nicht.

**Bediennachweis vom 17. November:** Nach ausdrücklicher Benutzerfreigabe wurden CSV-Auswahl und Abbrechen tatsächlich geprüft. Die gewählte Kopie der Beispieldatei im Bauausgabeordner ist bytegleich mit dem Original. Fünf Ergebnisse erschienen und blieben beim erneuten Öffnen und Abbrechen erhalten. [Beobachtung und Zeitpunkt](nachweise/P05-T03-bedienung-2026-11-17.json). Die früheren Werkzeugfehler bleiben als Verlauf unten dokumentiert. Keine Gesamtabnahme oder Folgephase hier erledigt. Vollständige Quellenliste zur Wiederholung: `nachweise/P05-T03_dateiliste.txt`; `nachweise/` muss trotz Git-Ausschluss vom Steuerdienst ausdrücklich gesichert werden.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [WPF mit .NET](https://learn.microsoft.com/de-de/dotnet/desktop/wpf/get-started/create-app-visual-studio)
- [Native WPF-Systemdialoge](https://learn.microsoft.com/de-de/dotnet/desktop/wpf/windows/how-to-open-common-system-dialog-box)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.

Die beiden WPF-Anleitungen wurden für P05-T03 am 10. November 2026 gelesen; verwendet werden `UseWPF`, XAML und `Microsoft.Win32.OpenFileDialog.ShowDialog`.

## 10. November: Bedienfreigabe erhalten, Werkzeugstart fehlgeschlagen

Der Benutzer hat das Öffnen, die lokale CSV-Auswahl und die Abbruchvalidierung in Messansicht ausdrücklich freigegeben. Diese Erlaubnis bleibt für dieselben Tests bestehen; nicht erneut erfragen. Der frühere Freigabefehler ist historisch. Beim jetzigen Versuch scheitern jedoch sowohl die reguläre Computer-Use-Initialisierung nach Kernelreset als auch die alternative verfügbare Oberfläche vor der Appbedienung: `failed to write kernel assets` / `os error 3` (Pfad nicht gefunden). Kein Dateidialog wurde bedient. Der Endpunkt bleibt blockiert, jetzt wegen der nicht startenden Werkzeuglaufzeit. Keine Freigabe umgangen, keine Ersatzautomation, keine behauptete Abnahme und keine Folgephase. [Tatsächlicher Versuch und bestehende Freigabe](nachweise/P05-T03-bedienfreigabe-2026-11-10.json).

## Gesamtabnahme vom 17. November 2026

Vier Basisphasen und Lastenheft lokal geprüft. `& ./nachweise/P05-T04_pruefen.ps1` besteht mit 26 tatsächlichen Fachprüfungen und 15 Prüfungen am echten angezeigten WPF-Fenster. Grenzen 9,5/10,5 mm inklusive, Überschreitungen, zwei Sprachkontexte, ungültige Zeilen/Dateien, fehlende Datei, verständliche Meldung und erneutes Laden geprüft. Originaldatei mit fünf Datensätzen und SHA256 unverändert. [Gesamtbericht](nachweise/P05-T04-gesamtpruefung.json).

Die T04-WPF-Prüfung wählt ausdrücklich den zweiten Bildschirm und bestätigt die Position vor dem Anzeigen. Kein Prüffenster auf dem Hauptbildschirm. Der zweite Bildschirm ist eine Voraussetzung dieses lokalen Bedienprüflaufs; ohne ihn endet die Prüfung verständlich vor dem Anzeigen. Der Fachtest benötigt ihn nicht. Der neue Prüfer verwendet die originale Fach-/WPF-Anwendung, kein Ersatzmodell. Native Dateiauswahl und Abbrechen wurden zuvor in T03 tatsächlich geprüft; deren Nachweise bleiben separat erhalten.

[Echte Desktopaufnahme](nachweise/P05-T04-desktop-2026-11-17.png) und [Beobachtung](nachweise/P05-T04-desktop-2026-11-17.json) bestätigen fünf Zeilen und die ausdrückliche Kennzeichnung als studentische Übung ohne industrielle/medizinische Zertifizierung. Die zusätzlich aus WPF gerenderten Bilder unter P05-T04 sind keine Desktopaufnahmen und werden getrennt benannt; beide Arten visuell kontrolliert. Fehlermeldung vollständig lesbar.

Wiederholung: Windows, vorhandenes .NET SDK/WPF, zwei angeschlossene Bildschirme; aus dem Projektordner `& ./nachweise/P05-T04_pruefen.ps1`. Das Skript enthält für Windows PowerShell 5 eine UTF-8-Signatur, damit deutsche Literale korrekt gelesen werden. Ein erster Skriptaufruf ohne diese Signatur zeigte falsch decodierte Umlaute in der Abschlussmeldung; korrigiert und Gesamtlauf tatsächlich wiederholt. Keine Anwendungslogikänderung erforderlich.

Grenzen: gesamte CSV im Speicher, vereinbartes Format und mm, keine Einheitenumrechnung, keine Zertifizierung. Studentische Schätzung T04: 45 Minuten; tatsächliche Prüflaufzeit steht im JSON, gesamte Assistentenzeit nicht separat gemessen. Dokumentiert 2026-11-17T22:37:58.291Z. Keine menschliche Eigenleistung behauptet; tatsächliche Veröffentlichung und Schlussprüfung folgen später.
