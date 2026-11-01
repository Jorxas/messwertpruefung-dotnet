"""Kleiner Dateicheck für die synthetische Eingabe; keine Toleranzprüfung."""

import csv
import hashlib
import io
import json
from pathlib import Path
import platform
import re
import sys


def pruefen():
    projektordner = Path(__file__).resolve().parents[1]
    konfiguration = json.loads(
        (projektordner / "projekt.json").read_text(encoding="utf-8")
    )
    messdatei = projektordner / konfiguration["fixture"]
    dateiinhalt = messdatei.read_bytes()
    zeilen = list(csv.reader(io.StringIO(dateiinhalt.decode("utf-8")), strict=True))
    if not zeilen or zeilen[0] != ["messung_id", "wert", "einheit"]:
        raise ValueError("Die CSV-Kopfzeile stimmt nicht mit dem Messformat überein.")
    datensaetze = zeilen[1:]
    if len(datensaetze) != konfiguration["expectedRecords"]:
        raise ValueError("Die erwartete Anzahl der Beispieldatensätze stimmt nicht.")

    kennungen = set()
    zahlenanzahl = 0
    eingabefehler = []
    for zeilennummer, datensatz in enumerate(datensaetze, start=2):
        if len(datensatz) != 3:
            raise ValueError(f"Zeile {zeilennummer}: genau drei CSV-Felder erwartet.")
        kennung, wert, einheit = datensatz
        if not kennung or kennung in kennungen:
            raise ValueError(f"Zeile {zeilennummer}: leere oder doppelte Messungskennung.")
        kennungen.add(kennung)
        if einheit != konfiguration["toleranzregel"]["einheit"]:
            raise ValueError(f"Zeile {zeilennummer}: Einheit mm erwartet.")
        if re.fullmatch(r"-?[0-9]+(?:\.[0-9]+)?", wert):
            zahlenanzahl += 1
        else:
            eingabefehler.append((zeilennummer, kennung, wert))

    # M05 ist ein beabsichtigter Fehlerfall und darf nicht stillschweigend entfallen.
    if zahlenanzahl != 4 or eingabefehler != [(6, "M05", "ungueltig")]:
        raise ValueError("Vier Zahlen und der bekannte Eingabefehler M05 erwartet.")
    print(f"Python {platform.python_version()}")
    print(f"Datei: {konfiguration['fixture']}")
    print(f"SHA256: {hashlib.sha256(dateiinhalt).hexdigest()}")
    print("Format: UTF-8, Komma als Feldtrenner, Dezimalpunkt, drei Spalten.")
    print(f"Datensätze: {len(datensaetze)}; eindeutige Kennungen: {len(kennungen)}; Einheit: mm.")
    print(f"Numerische Werte im vereinbarten Format: {zahlenanzahl}.")
    print("Erwarteter Eingabefehler: Zeile 6, M05, wert='ungueltig'.")
    print("BESTANDEN: Dateicheck; der absichtliche Eingabefehler ist erhalten.")
    print("Keine C#-Toleranzprüfung und keine WPF-Ausführung in P05-T01.")


if __name__ == "__main__":
    try:
        pruefen()
    except (OSError, UnicodeError, ValueError, csv.Error) as fehler:
        print(f"FEHLGESCHLAGEN: {fehler}", file=sys.stderr)
        sys.exit(1)
