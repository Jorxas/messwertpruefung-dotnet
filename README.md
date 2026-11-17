# Messwerte mit C# prüfen

Stand: 10. November 2026 — **P05-T03 implementiert, vollständige Bedienabnahme blockiert**. 14 Prüfungen am echten WPF-Fenster bestanden; die interaktive Dateiauswahl ist wegen verweigerter Computer-Use-Freigabe ungeprüft. P05-T04 und Gesamtabnahme bleiben offen. Ursprünglicher Basiszieltermin: 2026-11-05, spätestens 8. November 2026; Fortsetzung gemäß übergeordnetem Plan vom 9. November. Geschätzter Basisaufwand: 4 Stunden ohne Einrichtung und Erweiterungen.

Ein Techniker möchte Messwerte importieren und Abweichungen von einer Toleranz erkennen.

Ergebnis: C#-Prüfbibliothek und eine WPF-Tabelle mit Messwerten und Prüfergebnis.

Vorgesehene Technologien: C#/.NET, WPF, Tests/QA, UX/UI. Eine Nennung ist kein Nachweis einer Umsetzung.

## Einstieg

1. [Lastenheft](LASTENHEFT.md) lesen.
2. [Erstes Ticket](tickets/P05-T01.md) öffnen.
3. [Technischen Einstieg](START.md) prüfen und ein Ticket nach dem anderen bearbeiten.
4. [Arbeitsjournal](ARBEITSJOURNAL.md) und echte Nachweise aktualisieren.

Abhängigkeiten: keine weiteren Projekte.

[Erweiterungen](VARIANTEN.md) haben einen eigenen Umsetzungsstand. [Private Unternehmenszuordnung](UNTERNEHMEN.lokal.md) bleibt außerhalb der Git-Verwaltung.

## Projektsprache

Dokumentation, selbst gewählte Bezeichner, Kommentare, Meldungen und Beispieldaten werden auf Deutsch geschrieben. Festgelegte API-Schlüssel, Sprachsyntax und Produktnamen bleiben unverändert.

## Geprüfter Stand P05-T01

Toleranzbereich 9,5 bis 10,5 mm einschließlich beider Grenzen, CSV-Format und fünf erwartete Grenzfälle sind im [Ticket](tickets/P05-T01.md) festgelegt. Der lokale Python-Dateicheck wurde mit Python 3.12.14 ausgeführt: fünf unveränderte synthetische Datensätze, vier numerische Werte und der erwartete Eingabefehler M05 in Zeile 6. [Prüfprotokoll](nachweise/P05-T01_pruefprotokoll.md).

## Geprüfter Stand P05-T02

`src/CsvLeser.cs` prüft das CSV-Format und liefert je physischer Zeile einen Messwert oder einen sichtbaren Eingabefehler. `src/Toleranz.cs` prüft unabhängig vom Dateilesen die inklusive Toleranz mit `decimal`; die Konsole verbindet beide Teile mit der Regel aus `projekt.json`.

Tatsächlich mit .NET SDK 10.0.102 unter Windows ausgeführt: 26 lokale Prüfungen bestanden. M01–M03 liegen innerhalb, M04 außerhalb der Toleranz; M05 bleibt Eingabefehler in Zeile 6. Die fünf ursprünglichen synthetischen Datensätze sind unverändert. Befehle und Exitcodes stehen in [START.md](START.md), Ergebnisse im [Prüfprotokoll](nachweise/P05-T02_pruefprotokoll.md).

Dies ist eine studentische Übung, keine industrielle oder medizinische Zertifizierung. Lastenheft A1–A4 bleiben für die übergreifende Abnahme offen. Abschluss der Phase und spätere Veröffentlichung durch den Steuerdienst werden getrennt dokumentiert.

## Stand P05-T03

`oberflaeche/Messansicht.csproj` enthält eine echte WPF-Anwendung mit nativem CSV-Dateidialog, Dateianzeige und schreibgeschützter Ergebnistabelle. Die vorhandenen C#-Bausteine liefern vier Messwerte und den Eingabefehler M05 mit Zeilennummer 6. Fehler erhalten kein Toleranzergebnis; nicht verfügbare Felder erscheinen als „—“. Deutsche Korrekturhinweise ergänzen die Ergebnisse. Ein Dateifehler entfernt alte Ergebnisse.

Die lokale WPF-Abnahme zeigt das echte Fenster und prüft seine Daten und Meldungen: 14 Prüfungen bestanden, einschließlich unveränderter Beispieldatei. Zwei aus WPF gerenderte Bilder wurden visuell kontrolliert. Am 17. November wurde zusätzlich der native Dateidialog tatsächlich bedient: Beispieldatei ausgewählt, fünf Ergebnisse geprüft, Dialog erneut geöffnet und abgebrochen. Datei und Ergebnisse blieben erhalten. Dieser T03-Endpunkt ist geprüft; P05-T04 und die Gesamtabnahme bleiben offen. [Bediennachweis](nachweise/P05-T03-bedienung-2026-11-17.json), [Prüfprotokoll und Wiederholung](nachweise/P05-T03_pruefprotokoll.md), [Startanleitung](START.md).
