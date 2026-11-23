// Erzeugt von demo/erzeugen.cjs aus echten Läufen. Nicht von Hand ändern.
window.DEMO_DATEN = {
 "werkzeug": {
  "dotnet": "10.0.102"
 },
 "szenarien": [
  {
   "id": "beispiel",
   "datei": "eingaben/beispiel.csv",
   "eingabe": [
    "messung_id,wert,einheit",
    "M01,9.5,mm",
    "M02,10.0,mm",
    "M03,10.5,mm",
    "M04,10.6,mm",
    "M05,ungueltig,mm"
   ],
   "exitcode": 1,
   "stdout": "Zeile 2: M01, 9.5 mm: innerhalb der Toleranz\nZeile 3: M02, 10.0 mm: innerhalb der Toleranz\nZeile 4: M03, 10.5 mm: innerhalb der Toleranz\nZeile 5: M04, 10.6 mm: außerhalb der Toleranz\n",
   "stderr": "Zeile 6: Eingabefehler: M05: Wert 'ungueltig' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.\n",
   "zeilen": [
    {
     "zeile": 2,
     "kennung": "M01",
     "wert": "9.5",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 3,
     "kennung": "M02",
     "wert": "10.0",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 4,
     "kennung": "M03",
     "wert": "10.5",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 5,
     "kennung": "M04",
     "wert": "10.6",
     "einheit": "mm",
     "art": "ausserhalb"
    },
    {
     "zeile": 6,
     "art": "fehler",
     "meldung": "M05: Wert 'ungueltig' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.",
     "schluessel": "format"
    }
   ]
  },
  {
   "id": "grenzen",
   "datei": "eingaben/grenzen.csv",
   "eingabe": [
    "messung_id,wert,einheit",
    "G1,9.4,mm",
    "G2,9.5,mm",
    "G3,10,mm",
    "G4,10.50,mm",
    "G5,10.5,mm",
    "G6,10.51,mm"
   ],
   "exitcode": 0,
   "stdout": "Zeile 2: G1, 9.4 mm: außerhalb der Toleranz\nZeile 3: G2, 9.5 mm: innerhalb der Toleranz\nZeile 4: G3, 10 mm: innerhalb der Toleranz\nZeile 5: G4, 10.50 mm: innerhalb der Toleranz\nZeile 6: G5, 10.5 mm: innerhalb der Toleranz\nZeile 7: G6, 10.51 mm: außerhalb der Toleranz\n",
   "stderr": "",
   "zeilen": [
    {
     "zeile": 2,
     "kennung": "G1",
     "wert": "9.4",
     "einheit": "mm",
     "art": "ausserhalb"
    },
    {
     "zeile": 3,
     "kennung": "G2",
     "wert": "9.5",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 4,
     "kennung": "G3",
     "wert": "10",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 5,
     "kennung": "G4",
     "wert": "10.50",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 6,
     "kennung": "G5",
     "wert": "10.5",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 7,
     "kennung": "G6",
     "wert": "10.51",
     "einheit": "mm",
     "art": "ausserhalb"
    }
   ]
  },
  {
   "id": "formatfehler",
   "datei": "eingaben/formatfehler.csv",
   "eingabe": [
    "messung_id,wert,einheit",
    "F01,10.2,mm",
    "F02,10.2,cm",
    "F03,10.2",
    "F01,10.0,mm",
    ",10.0,mm",
    "F04,1e1,mm",
    "F05,\"10,0\",mm",
    "",
    "F06,10.3,mm"
   ],
   "exitcode": 1,
   "stdout": "Zeile 2: F01, 10.2 mm: innerhalb der Toleranz\nZeile 10: F06, 10.3 mm: innerhalb der Toleranz\n",
   "stderr": "Zeile 3: Eingabefehler: F02: Einheit muss exakt mm sein.\nZeile 4: Eingabefehler: Genau drei CSV-Felder werden erwartet.\nZeile 5: Eingabefehler: Messungskennung F01 ist doppelt vorhanden.\nZeile 6: Eingabefehler: Messungskennung fehlt.\nZeile 7: Eingabefehler: F04: Wert '1e1' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.\nZeile 8: Eingabefehler: F05: Wert '10,0' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.\nZeile 9: Eingabefehler: Leerzeilen sind nicht zulässig.\n",
   "zeilen": [
    {
     "zeile": 2,
     "kennung": "F01",
     "wert": "10.2",
     "einheit": "mm",
     "art": "innerhalb"
    },
    {
     "zeile": 3,
     "art": "fehler",
     "meldung": "F02: Einheit muss exakt mm sein.",
     "schluessel": "einheit"
    },
    {
     "zeile": 4,
     "art": "fehler",
     "meldung": "Genau drei CSV-Felder werden erwartet.",
     "schluessel": "felderzahl"
    },
    {
     "zeile": 5,
     "art": "fehler",
     "meldung": "Messungskennung F01 ist doppelt vorhanden.",
     "schluessel": "doppelt"
    },
    {
     "zeile": 6,
     "art": "fehler",
     "meldung": "Messungskennung fehlt.",
     "schluessel": "kennung"
    },
    {
     "zeile": 7,
     "art": "fehler",
     "meldung": "F04: Wert '1e1' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.",
     "schluessel": "format"
    },
    {
     "zeile": 8,
     "art": "fehler",
     "meldung": "F05: Wert '10,0' ist keine exakt darstellbare Dezimalzahl im vereinbarten Format.",
     "schluessel": "format"
    },
    {
     "zeile": 9,
     "art": "fehler",
     "meldung": "Leerzeilen sind nicht zulässig.",
     "schluessel": "leerzeile"
    },
    {
     "zeile": 10,
     "kennung": "F06",
     "wert": "10.3",
     "einheit": "mm",
     "art": "innerhalb"
    }
   ]
  },
  {
   "id": "kopfzeile",
   "datei": "eingaben/kopfzeile.csv",
   "eingabe": [
    "id,wert,einheit",
    "A1,10.0,mm"
   ],
   "exitcode": 1,
   "stdout": "",
   "stderr": "Zeile 1: Eingabefehler: Kopfzeile muss messung_id,wert,einheit lauten.\n",
   "zeilen": [
    {
     "zeile": 1,
     "art": "fehler",
     "meldung": "Kopfzeile muss messung_id,wert,einheit lauten.",
     "schluessel": "kopfzeile"
    }
   ]
  },
  {
   "id": "leer",
   "datei": "eingaben/leer.csv",
   "eingabe": [
    "messung_id,wert,einheit"
   ],
   "exitcode": 1,
   "stdout": "",
   "stderr": "Zeile 2: Eingabefehler: Mindestens ein Messdatensatz fehlt.\n",
   "zeilen": [
    {
     "zeile": 2,
     "art": "fehler",
     "meldung": "Mindestens ein Messdatensatz fehlt.",
     "schluessel": "leer"
    }
   ]
  }
 ],
 "treue": {
  "werte": 200,
  "abweichungen": 0,
  "arten": {
   "innerhalb": 113,
   "ausserhalb": 36,
   "fehler": 51
  }
 },
 "treuepaare": [
  {
   "wert": "9.00",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.00"
  },
  {
   "wert": "9.05",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.10",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.15",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.20",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.20"
  },
  {
   "wert": "9.25",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.30",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.35",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.40",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.40"
  },
  {
   "wert": "9.45",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.50",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.55",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.60",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.60"
  },
  {
   "wert": "9.65",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.70",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.75",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.80",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.80"
  },
  {
   "wert": "9.85",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.90",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "9.95",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.00",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.00"
  },
  {
   "wert": "10.05",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.10",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.15",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.20",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.20"
  },
  {
   "wert": "10.25",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.30",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.35",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.40",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.40"
  },
  {
   "wert": "10.45",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.50",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.55",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.60",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.60"
  },
  {
   "wert": "10.65",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.70",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.75",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.80",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.80"
  },
  {
   "wert": "10.85",
   "einheit": "cm",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.90",
   "einheit": "MM",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "10.95",
   "einheit": "mm ",
   "art": "fehler",
   "schluessel": "einheit",
   "anzeige": null
  },
  {
   "wert": "11.00",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "11.00"
  },
  {
   "wert": "9.4",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.4"
  },
  {
   "wert": "9.41",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.41"
  },
  {
   "wert": "9.42",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.42"
  },
  {
   "wert": "9.43",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.43"
  },
  {
   "wert": "9.44",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.44"
  },
  {
   "wert": "9.45",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.45"
  },
  {
   "wert": "9.46",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.46"
  },
  {
   "wert": "9.47",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.47"
  },
  {
   "wert": "9.48",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.48"
  },
  {
   "wert": "9.49",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "9.49"
  },
  {
   "wert": "9.5",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.5"
  },
  {
   "wert": "9.51",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.51"
  },
  {
   "wert": "9.52",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.52"
  },
  {
   "wert": "9.53",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.53"
  },
  {
   "wert": "9.54",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.54"
  },
  {
   "wert": "9.55",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.55"
  },
  {
   "wert": "9.56",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.56"
  },
  {
   "wert": "9.57",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.57"
  },
  {
   "wert": "9.58",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.58"
  },
  {
   "wert": "9.59",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.59"
  },
  {
   "wert": "9.6",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.6"
  },
  {
   "wert": "9.61",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.61"
  },
  {
   "wert": "9.62",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.62"
  },
  {
   "wert": "9.63",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.63"
  },
  {
   "wert": "9.64",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.64"
  },
  {
   "wert": "9.65",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.65"
  },
  {
   "wert": "9.66",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.66"
  },
  {
   "wert": "9.67",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.67"
  },
  {
   "wert": "9.68",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.68"
  },
  {
   "wert": "9.69",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.69"
  },
  {
   "wert": "9.7",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.7"
  },
  {
   "wert": "9.71",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.71"
  },
  {
   "wert": "9.72",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.72"
  },
  {
   "wert": "9.73",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.73"
  },
  {
   "wert": "9.74",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.74"
  },
  {
   "wert": "9.75",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.75"
  },
  {
   "wert": "9.76",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.76"
  },
  {
   "wert": "9.77",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.77"
  },
  {
   "wert": "9.78",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.78"
  },
  {
   "wert": "9.79",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.79"
  },
  {
   "wert": "9.8",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.8"
  },
  {
   "wert": "9.81",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.81"
  },
  {
   "wert": "9.82",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.82"
  },
  {
   "wert": "9.83",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.83"
  },
  {
   "wert": "9.84",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.84"
  },
  {
   "wert": "9.85",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.85"
  },
  {
   "wert": "9.86",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.86"
  },
  {
   "wert": "9.87",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.87"
  },
  {
   "wert": "9.88",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.88"
  },
  {
   "wert": "9.89",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.89"
  },
  {
   "wert": "9.9",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.9"
  },
  {
   "wert": "9.91",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.91"
  },
  {
   "wert": "9.92",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.92"
  },
  {
   "wert": "9.93",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.93"
  },
  {
   "wert": "9.94",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.94"
  },
  {
   "wert": "9.95",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.95"
  },
  {
   "wert": "9.96",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.96"
  },
  {
   "wert": "9.97",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.97"
  },
  {
   "wert": "9.98",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.98"
  },
  {
   "wert": "9.99",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.99"
  },
  {
   "wert": "10.0",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.0"
  },
  {
   "wert": "10.01",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.01"
  },
  {
   "wert": "10.02",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.02"
  },
  {
   "wert": "10.03",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.03"
  },
  {
   "wert": "10.04",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.04"
  },
  {
   "wert": "10.05",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.05"
  },
  {
   "wert": "10.06",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.06"
  },
  {
   "wert": "10.07",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.07"
  },
  {
   "wert": "10.08",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.08"
  },
  {
   "wert": "10.09",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.09"
  },
  {
   "wert": "10.1",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.1"
  },
  {
   "wert": "10.11",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.11"
  },
  {
   "wert": "10.12",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.12"
  },
  {
   "wert": "10.13",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.13"
  },
  {
   "wert": "10.14",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.14"
  },
  {
   "wert": "10.15",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.15"
  },
  {
   "wert": "10.16",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.16"
  },
  {
   "wert": "10.17",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.17"
  },
  {
   "wert": "10.18",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.18"
  },
  {
   "wert": "10.19",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.19"
  },
  {
   "wert": "10.2",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.2"
  },
  {
   "wert": "10.21",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.21"
  },
  {
   "wert": "10.22",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.22"
  },
  {
   "wert": "10.23",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.23"
  },
  {
   "wert": "10.24",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.24"
  },
  {
   "wert": "10.25",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.25"
  },
  {
   "wert": "10.26",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.26"
  },
  {
   "wert": "10.27",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.27"
  },
  {
   "wert": "10.28",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.28"
  },
  {
   "wert": "10.29",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.29"
  },
  {
   "wert": "10.3",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.3"
  },
  {
   "wert": "10.31",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.31"
  },
  {
   "wert": "10.32",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.32"
  },
  {
   "wert": "10.33",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.33"
  },
  {
   "wert": "10.34",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.34"
  },
  {
   "wert": "10.35",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.35"
  },
  {
   "wert": "10.36",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.36"
  },
  {
   "wert": "10.37",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.37"
  },
  {
   "wert": "10.38",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.38"
  },
  {
   "wert": "10.39",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.39"
  },
  {
   "wert": "10.4",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.4"
  },
  {
   "wert": "10.41",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.41"
  },
  {
   "wert": "10.42",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.42"
  },
  {
   "wert": "10.43",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.43"
  },
  {
   "wert": "10.44",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.44"
  },
  {
   "wert": "10.45",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.45"
  },
  {
   "wert": "10.46",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.46"
  },
  {
   "wert": "10.47",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.47"
  },
  {
   "wert": "10.48",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.48"
  },
  {
   "wert": "10.49",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.49"
  },
  {
   "wert": "10.5",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.5"
  },
  {
   "wert": "10.51",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.51"
  },
  {
   "wert": "10.52",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.52"
  },
  {
   "wert": "10.53",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.53"
  },
  {
   "wert": "10.54",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.54"
  },
  {
   "wert": "10.55",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.55"
  },
  {
   "wert": "10.56",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.56"
  },
  {
   "wert": "10.57",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.57"
  },
  {
   "wert": "10.58",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.58"
  },
  {
   "wert": "10.59",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.59"
  },
  {
   "wert": "10.6",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "10.6"
  },
  {
   "wert": "9.5",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.5"
  },
  {
   "wert": "9.50",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "9.50"
  },
  {
   "wert": "10",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10"
  },
  {
   "wert": "10.0",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.0"
  },
  {
   "wert": "10.5",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.5"
  },
  {
   "wert": "10.50",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.50"
  },
  {
   "wert": "10.500000000000000000000000000",
   "einheit": "mm",
   "art": "innerhalb",
   "schluessel": null,
   "anzeige": "10.500000000000000000000000000"
  },
  {
   "wert": "10.50000000000000000000000000001",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "10.5000000000000000000000000001",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "0",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "0"
  },
  {
   "wert": "-0",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "0"
  },
  {
   "wert": "-0.0",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "0.0"
  },
  {
   "wert": "0.0",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "0.0"
  },
  {
   "wert": "007.5",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "7.5"
  },
  {
   "wert": "-10",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "-10"
  },
  {
   "wert": "-9.5",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "-9.5"
  },
  {
   "wert": "+10",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "10.",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": ".5",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "1e1",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "1E1",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "10,0",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": " 10",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "10 ",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "ungueltig",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "NaN",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "Infinity",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "0x10",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "10.5.1",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "--1",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "1_0",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "79228162514264337593543950335",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "79228162514264337593543950335"
  },
  {
   "wert": "79228162514264337593543950336",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "7922816251426433759354395033.5",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "7922816251426433759354395033.5"
  },
  {
   "wert": "0.0000000000000000000000000001",
   "einheit": "mm",
   "art": "ausserhalb",
   "schluessel": null,
   "anzeige": "0.0000000000000000000000000001"
  },
  {
   "wert": "0.00000000000000000000000000001",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  },
  {
   "wert": "99999999999999999999999999999999",
   "einheit": "mm",
   "art": "fehler",
   "schluessel": "format",
   "anzeige": null
  }
 ],
 "fachpruefung": {
  "anzahl": 26,
  "exitcode": 0
 },
 "wpf": {
  "pruefungen": 14,
  "exitcode": 0
 }
};
