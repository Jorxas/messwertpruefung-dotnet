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

WPF wird in dieser Phase weder erstellt noch als praktisch geprüft behauptet. P05-T03 und die spätere Gesamtabnahme bleiben offen.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [WPF mit .NET](https://learn.microsoft.com/de-de/dotnet/desktop/wpf/get-started/create-app-visual-studio)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.
