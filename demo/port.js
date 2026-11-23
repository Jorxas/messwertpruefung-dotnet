// Port der Feldprüfung aus src/CsvLeser.cs und src/Toleranz.cs nach JavaScript.
// Er wird nur für die Eingabe eines einzelnen Werts verwendet. Die Treue zum
// C#-Original wird in demo/erzeugen.cjs gegen einen echten Lauf geprüft.
(function (wurzel, fabrik) {
  if (typeof module === "object" && module.exports) module.exports = fabrik();
  else wurzel.Messport = fabrik();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  // System.Decimal: 96-Bit-Koeffizient, höchstens 28 Nachkommastellen.
  var MAX_KOEFFIZIENT = 79228162514264337593543950335n;
  var MASSSTAB = 10n ** 28n;

  function zerlegen(text) {
    var negativ = text.charAt(0) === "-";
    var teile = text.replace(/^-/, "").split(".");
    var ganz = teile[0].replace(/^0+/, "") || "0";
    var nach = teile.length === 2 ? teile[1] : "";
    return { negativ: negativ, ganz: ganz, nach: nach };
  }

  // Entspricht CsvLeser.Zahltext: Vergleichstext ohne führende und nachgestellte Nullen.
  function zahltext(text) {
    var z = zerlegen(text);
    var nach = z.nach.replace(/0+$/, "");
    var vorzeichen = z.negativ && (z.ganz !== "0" || nach.length > 0) ? "-" : "";
    return vorzeichen + z.ganz + (nach.length > 0 ? "." + nach : "");
  }

  // decimal.TryParse rundet zu genaue Eingaben. Sie sind genau dann unverändert
  // darstellbar, wenn Koeffizient und Nachkommastellen in System.Decimal passen.
  function exaktDarstellbar(text) {
    var z = zerlegen(text);
    var nach = z.nach.replace(/0+$/, "");
    if (nach.length > 28) return false;
    var koeff = BigInt((z.ganz + nach).replace(/^0+/, "") || "0");
    return koeff <= MAX_KOEFFIZIENT;
  }

  // Anzeige wie Decimal.ToString(InvariantCulture): führende Nullen weg,
  // Nachkommastellen (auch Nullen) bleiben, höchstens 28.
  function anzeige(text) {
    var z = zerlegen(text);
    var nach = z.nach.length > 28 ? z.nach.slice(0, 28) : z.nach;
    var nullwert = /^0*$/.test(z.ganz + nach);
    return (z.negativ && !nullwert ? "-" : "") + z.ganz + (nach.length > 0 ? "." + nach : "");
  }

  function alsSkaliert(text) {
    var z = zerlegen(text);
    var nach = (z.nach + "0".repeat(28)).slice(0, 28);
    var wert = BigInt(z.ganz) * MASSSTAB + BigInt(nach || "0");
    return z.negativ ? -wert : wert;
  }

  // Prüft ein CSV-Feldpaar (wert, einheit) wie CsvLeser.LesenZeile und Toleranz.IstGueltig.
  // Rückgabe: { art: "innerhalb" | "ausserhalb" | "fehler", schluessel, wert, einheit }
  function pruefen(wertText, einheit, untergrenze, obergrenze) {
    untergrenze = untergrenze || "9.5";
    obergrenze = obergrenze || "10.5";
    if (einheit !== "mm") return { art: "fehler", schluessel: "einheit" };
    if (!/^-?[0-9]+(?:\.[0-9]+)?$/.test(wertText) || !exaktDarstellbar(wertText)) {
      return { art: "fehler", schluessel: "format", wertText: wertText };
    }
    var wert = alsSkaliert(wertText);
    var innerhalb = wert >= alsSkaliert(untergrenze) && wert <= alsSkaliert(obergrenze);
    return { art: innerhalb ? "innerhalb" : "ausserhalb", wert: anzeige(wertText), einheit: einheit };
  }

  return { pruefen: pruefen, zahltext: zahltext, anzeige: anzeige };
});
