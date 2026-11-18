# Messwerte mit C# und WPF prüfen

Messwerte aus einer CSV-Datei sollen gegen einen Toleranzvertrag geprüft und mit verständlichen Fehlerhinweisen in einer Windows-Oberfläche angezeigt werden.

![Projektaufbau](dokumentation/ueberblick.svg)

**Veröffentlichungsstand: Phase 3/4.** Dieses eigenständige Repository übernimmt zunächst den bereits lokal committeten Stand. Weitere fachliche Phasen werden im Abstand von mindestens vier Stunden veröffentlicht. Die technische Entwicklung und die öffentliche Veröffentlichung haben unterschiedliche echte Zeitpunkte.

## Was hier zu sehen ist

| Schritt | Inhalt | Hier veröffentlicht |
|---|---|---|
| 1 | Messformat und Grenzfälle | Ja |
| 2 | C#-Prüfbibliothek | Ja |
| 3 | WPF-Tabelle und Dateiauswahl | Ja |
| 4 | Native Bedienung und abschließende Fehlerfälle | Folgt |

## Fachlicher Nutzen

Trennung von Fachlogik und Oberfläche, CSV-Validierung und native Windows-Bedienung.

## Lokal starten

Im geklonten Repository ausführen; die benötigte Laufzeit muss installiert sein. Python-Beispiele verwenden 3.12, Node-Beispiele 24 und C# die im Projekt angegebene .NET-Version. Befehle mit uv laden die dort genau bezeichneten Pakete bei Bedarf.

```powershell
powershell -NoProfile -File nachweise/P05-T03_pruefen.ps1
```

Ausführliche technische Befehle: [START.md](START.md). [Öffentlicher Prüfstand](ABNAHME.json) und [Quellphasen](VERLAUF.json) dokumentieren Herkunft und echte Ausführungsdaten. Eine neue Repositorykopie ist kein neuer nativer Desktoplauf.

## Ergebnis des lokal geprüften Schlussstands

26 Fachprüfungen und 15 WPF-Prüfungen; native Dateiauswahl und Abbrechen tatsächlich geprüft.

**Dieser Schlussstand ist lokal bereits geprüft, aber noch nicht vollständig in diesem Repository veröffentlicht.** Maßgeblich für den hier verfügbaren Code ist die Phasentabelle oben.

## Grenzen

Windows-Desktopprojekt; keine Web-, Mobil- oder ASP.NET-Anwendung.

Eigenes kleines Lernprojekt mit synthetischen Daten, mit KI-Unterstützung entwickelt und geprüft. Keine Aussage über Berufserfahrung, menschliche Arbeitsstunden oder praktische Verwendung weiterer nur geplanter Produkte.
