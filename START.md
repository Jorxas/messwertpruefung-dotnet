# Technischer Einstieg — P05

## P05-T01 lokal prüfen

Im Projektordner ausführen:

~~~powershell
uv run --offline --python 3.12 python -X utf8 nachweise/P05-T01_formatcheck.py
~~~

Verwendet die vorhandene Python-Laufzeit und nur die Standardbibliothek; tatsächlich ausgeführt mit Python 3.12.14 und uv 0.12.13. Der UV-Cache liegt laut vorhandener Umgebung unter `ausgabe/uv-zwischenspeicher`. Keine Installation oder Netzverbindung erforderlich.

Erwartete Ausgabe: fünf Datensätze und eindeutige Kennungen, Einheit mm, vier numerische Werte, erwarteter Eingabefehler M05 in Zeile 6, abschließend `BESTANDEN`. Unerwartete Befunde führen zu Exitcode 1. Der erfolgreiche Exitcode 0 bestätigt den Dateicheck einschließlich des bekannten Fehlers; er erklärt M05 nicht zu einem gültigen Messwert. [Festgelegtes Format und Sollfälle](tickets/P05-T01.md), [Nachweis](nachweise/P05-T01_pruefprotokoll.md).

## Einstiegspunkt ausführen

Voraussetzungen: .NET SDK für Windows; WPF unter Windows.

~~~powershell
dotnet run --project src/Messungen.csproj
~~~

Das Startprogramm meldet den Initialisierungsstand. Fachfunktionen sind bewusst noch nicht implementiert und melden dies bei einem Aufruf. Fehlende Bibliotheken und Frameworks erst im passenden Ticket mit ihrer tatsächlichen Version ergänzen.

## Spätere Aufgabe

P05-T02: CSV-Leser und C#-Prüfung entwickeln. In P05-T01 wurde das C#-Startprogramm nicht ausgeführt; es ist noch kein Nachweis für Fachlogik oder WPF.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [WPF mit .NET](https://learn.microsoft.com/de-de/dotnet/desktop/wpf/get-started/create-app-visual-studio)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.
