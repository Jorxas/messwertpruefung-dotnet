# Messwerte mit C# prüfen

Stand: 1. November 2026 — **P05-T01 abgeschlossen; Fachfunktionen noch umzusetzen**. Geplanter Abschluss der Basis: 2026-11-05, spätestens 8. November 2026. Geschätzter Basisaufwand: 4 Stunden ohne Einrichtung und Erweiterungen.

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

Dies ist eine studentische Übung. C#-Toleranzbibliothek, WPF und Lastenheft-Abnahme bleiben offen; die Grenzfallergebnisse sind bislang Sollwerte. Abschluss der Phase und spätere Veröffentlichung durch den Steuerdienst werden getrennt dokumentiert.
