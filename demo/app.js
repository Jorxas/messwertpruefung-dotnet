(function () {
  "use strict";
  var D = window.DEMO_DATEN;
  var T = window.I18N;
  var lang = "de";
  var szenarioId = D.szenarien[0].id;
  var SKALA_MIN = 9, SKALA_MAX = 11;

  function t(schluessel, werte) {
    var text = (T[lang] && T[lang][schluessel]) || T.de[schluessel] || schluessel;
    if (werte) text = text.replace(/\{(\w+)\}/g, function (m, k) { return werte[k] !== undefined ? werte[k] : m; });
    return text;
  }
  function el(name, klasse, text) {
    var e = document.createElement(name);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function zahl(n) { return String(n).replace(".", lang === "fr" ? "," : ","); }

  // Meldungen des Programms. Deutsch: Originaltext der Ausgabe. Französisch: Übersetzung nach Schlüssel.
  function meldungstext(z) {
    if (lang === "de") return z.meldung;
    var m;
    switch (z.schluessel) {
      case "einheit":
        m = /^(.+?): Einheit/.exec(z.meldung);
        return t("m_einheit_id", { id: m ? m[1] : "" });
      case "format":
        m = /^(.+?): Wert '(.*)' ist keine/.exec(z.meldung);
        return t("m_format_id", { id: m ? m[1] : "", w: m ? m[2] : "" });
      case "doppelt":
        m = /Messungskennung (.+) ist doppelt/.exec(z.meldung);
        return t("m_doppelt", { id: m ? m[1] : "" });
      default:
        return t("m_" + z.schluessel);
    }
  }

  function textefuellen() {
    document.documentElement.lang = lang;
    document.title = t("titel") + " · Demo";
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (e) {
      e.textContent = t(e.getAttribute("data-i18n"));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (e) {
      e.setAttribute("aria-label", t(e.getAttribute("data-i18n-aria")));
    });
    Array.prototype.forEach.call(document.querySelectorAll(".sprache button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    $("img1").alt = t("wpf_alt1");
    $("img2").alt = t("wpf_alt2");
    $("skala").setAttribute("aria-label", t("skala_aria"));
    $("wpf-meta").textContent = t("wpf_meta", { n: D.wpf.pruefungen });
    $("ergebnis-zahlen").textContent = t("ergebnis_zahlen", { a: D.fachpruefung.anzahl, b: D.wpf.pruefungen });
    $("treue").textContent = t("treue", { n: D.treue.werte, a: D.treue.arten.innerhalb, b: D.treue.arten.ausserhalb, c: D.treue.arten.fehler });
  }

  // ---- Szenarien ----
  function reiterAufbauen() {
    var box = $("reiter");
    box.textContent = "";
    D.szenarien.forEach(function (s) {
      var b = el("button", "", t("s_" + s.id));
      b.type = "button";
      b.setAttribute("role", "tab");
      b.id = "tab-" + s.id;
      b.setAttribute("aria-selected", String(s.id === szenarioId));
      b.setAttribute("aria-controls", "szenario");
      b.tabIndex = s.id === szenarioId ? 0 : -1;
      b.addEventListener("click", function () { waehlen(s.id, false); });
      b.addEventListener("keydown", function (ev) {
        var i = D.szenarien.findIndex(function (x) { return x.id === s.id; });
        var n = null;
        if (ev.key === "ArrowRight") n = (i + 1) % D.szenarien.length;
        else if (ev.key === "ArrowLeft") n = (i + D.szenarien.length - 1) % D.szenarien.length;
        else if (ev.key === "Home") n = 0;
        else if (ev.key === "End") n = D.szenarien.length - 1;
        if (n !== null) { ev.preventDefault(); waehlen(D.szenarien[n].id, true); }
      });
      box.appendChild(b);
    });
    $("szenario").setAttribute("aria-labelledby", "tab-" + szenarioId);
  }

  function waehlen(id, fokus) {
    szenarioId = id;
    reiterAufbauen();
    szenarioZeigen();
    if (fokus) $("tab-" + id).focus();
  }

  function szenarioZeigen() {
    var s = D.szenarien.filter(function (x) { return x.id === szenarioId; })[0];
    $("szenario-text").textContent = t("t_" + s.id);
    $("eingabe-datei").textContent = t("eingabe_datei", { datei: s.datei });
    $("lauf-meta").textContent = t("lauf_meta", { datei: s.datei, version: D.werkzeug.dotnet, code: s.exitcode });

    var nachZeile = {};
    s.zeilen.forEach(function (z) { nachZeile[z.zeile] = z; });
    var csv = $("csv");
    csv.textContent = "";
    s.eingabe.forEach(function (zeile, i) {
      var nr = i + 1, z = nachZeile[nr];
      var li = el("li", z ? z.art : "");
      li.appendChild(el("span", "nr", String(nr)));
      li.appendChild(zeile === "" ? el("span", "inh leer", "(leer)") : el("span", "inh", zeile));
      if (z) li.appendChild(el("span", "tag", t("art_" + z.art)));
      csv.appendChild(li);
    });

    var tb = $("ergebnis").tBodies[0];
    tb.textContent = "";
    s.zeilen.forEach(function (z) {
      var tr = document.createElement("tr");
      var tz = el("td", "num zeilennr", String(z.zeile));
      tz.setAttribute("data-l", t("th_zeile"));
      tr.appendChild(tz);
      tr.appendChild(el("td", "", z.kennung || "·"));
      tr.appendChild(el("td", "num", z.art === "fehler" ? "·" : zahl2(z.wert) + " " + z.einheit));
      var td = document.createElement("td");
      td.appendChild(el("span", "badge " + z.art, t("art_" + z.art)));
      if (z.art === "fehler") td.appendChild(el("span", "meldung", meldungstext(z)));
      tr.appendChild(td);
      tb.appendChild(tr);
    });

    $("stdout").textContent = s.stdout.trim() === "" ? t("leer_aus") : s.stdout.replace(/\n$/, "");
    $("stderr").textContent = s.stderr.trim() === "" ? t("leer_aus") : s.stderr.replace(/\n$/, "");
    $("exitcode").textContent = t("exitcode", { code: s.exitcode });
  }

  // Zahlen mit Dezimalkomma in der Anzeige, die Rohausgabe behält den Punkt.
  function zahl2(w) { return w.replace(".", ","); }

  // ---- Einzelwert ----
  var BEISPIELE = ["9.5", "10.0", "10.5", "10.6", "9.49", "10,0", "1e1", "ungueltig"];
  function beispieleAufbauen() {
    var box = $("beispiele");
    box.textContent = "";
    BEISPIELE.forEach(function (w) {
      var b = el("button", "", w);
      b.type = "button";
      b.addEventListener("click", function () {
        $("wert").value = w;
        $("einheit").value = "mm";
        einzelwert();
      });
      box.appendChild(b);
    });
  }

  function einzelwert() {
    var wert = $("wert").value;
    var einheit = $("einheit").value;
    var p = window.Messport.pruefen(wert, einheit);
    var u = $("urteil"), marker = $("marker");
    u.className = "urteil " + p.art;
    if (p.art === "fehler") {
      u.textContent = t("urteil_fehler", { m: t(p.schluessel === "einheit" ? "m_einheit" : "m_format", { w: wert }) });
      marker.hidden = true;
      return;
    }
    u.textContent = t(p.art === "innerhalb" ? "urteil_innerhalb" : "urteil_ausserhalb", { w: zahl2(p.wert), e: p.einheit });
    var n = Number(p.wert);
    var anteil = (Math.min(Math.max(n, SKALA_MIN), SKALA_MAX) - SKALA_MIN) / (SKALA_MAX - SKALA_MIN);
    marker.style.left = (anteil * 100) + "%";
    marker.className = "marker" + (p.art === "innerhalb" ? "" : " aus");
    marker.hidden = false;
  }

  function sprache(neu) {
    lang = neu === "fr" ? "fr" : "de";
    try {
      var u = new URL(window.location.href);
      if (lang === "fr") u.searchParams.set("lang", "fr"); else u.searchParams.delete("lang");
      window.history.replaceState(null, "", u.toString());
    } catch (e) { /* ohne Adressleiste egal */ }
    textefuellen();
    reiterAufbauen();
    szenarioZeigen();
    einzelwert();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".sprache button"), function (b) {
    b.addEventListener("click", function () { sprache(b.getAttribute("data-lang")); });
  });
  $("pruefform").addEventListener("submit", function (ev) { ev.preventDefault(); });
  $("wert").addEventListener("input", einzelwert);
  $("einheit").addEventListener("change", einzelwert);

  beispieleAufbauen();
  var start = "de";
  try { start = new URLSearchParams(window.location.search).get("lang") === "fr" ? "fr" : "de"; } catch (e) { /* de */ }
  sprache(start);
})();
