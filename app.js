/* Moteur du TP documentaire : navigation, exercices, correction, sauvegarde locale, bilan. */
(function () {
  "use strict";
  var D = window.TPDOC;
  var KEY = "tpdoc:" + D.id;
  var RESET_HASH = 1602609493; /* empreinte du code formateur (le code lui-même n'est pas écrit ici) */
  var app = document.getElementById("app");

  /* ---------- sauvegarde ---------- */
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) {}
    return { v: 1, name: "", start: null, seed: Math.floor(Math.random() * 1e9), ex: {}, gens: {} };
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------- outils ---------- */
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c == null) return; e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function rng(seed) { var a = seed >>> 0; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hash(str) { var x = 2166136261; for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function shuffle(arr, key) { var r = rng(S.seed ^ hash(key)), a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function fr(n) { return String(Math.round(n * 100) / 100).replace(".", ","); }
  function parseNum(s) { if (s == null) return NaN; s = String(s).trim().replace(/\s/g, "").replace(",", "."); return s === "" ? NaN : Number(s); }

  /* ---------- exercices générés ---------- */
  function genItems(m, i, ex) {
    var key = m.id + "-" + i;
    if (S.gens[key]) return S.gens[key];
    var r = rng(S.seed ^ hash(key)), out = [];
    for (var k = 0; k < ex.n; k++) {
      if (ex.gen === "scale") {
        var e = r() < 0.6 ? 50 : 100, cm = (4 + Math.floor(r() * 16)) / 2;
        out.push({ q: "Sur un plan au 1/" + e + ", un mur mesure " + fr(cm) + " cm. Longueur réelle en mètres ?", answer: cm * e / 100, tol: 0.011, unit: "m",
          explain: fr(cm) + " × " + e + " = " + fr(cm * e) + " cm = " + fr(cm * e / 100) + " m" });
      } else if (ex.gen === "socles") {
        var s = Math.round((12 + r() * 26) * 10) / 10, n = Math.max(5, Math.ceil(s / 4 - 1e-9));
        out.push({ q: "Séjour de " + fr(s) + " m² : combien de socles 16 A au minimum ?", answer: n, tol: 0, unit: "socles",
          explain: "1 socle par tranche de 4 m², minimum 5 : " + fr(s) + " / 4 = " + fr(s / 4) + " → " + n + " socles" });
      } else if (ex.gen === "vav") {
        var used = k ? out.map(function (o) { return o.st; }) : [], st;
        do { st = Math.floor(r() * 4); } while (used.indexOf(st) >= 0 && used.length < 4);
        var p1 = st >> 1 ? 2 : 1, p2 = st & 1 ? 2 : 1, on = p1 === p2;
        out.push({ qcm: true, st: st, q: "S1 est sur la navette " + p1 + ", S2 sur la navette " + p2 + ". La lampe est…", options: ["allumée", "éteinte"], answer: on ? 0 : 1,
          explain: on ? "Les deux inverseurs sont sur la même navette : le circuit est fermé." : "Les inverseurs ne sont pas sur la même navette : le circuit est ouvert." });
      } else if (ex.gen === "tl") {
        var init = r() < 0.5, nb = 1 + Math.floor(r() * 7), fin = nb % 2 ? !init : init;
        if (k > 0 && out[0].fin === fin) { nb++; fin = !fin; }
        out.push({ qcm: true, fin: fin, q: "La lampe est " + (init ? "allumée" : "éteinte") + ". On appuie " + nb + " fois de suite sur les BP (n'importe lesquels). La lampe est…", options: ["allumée", "éteinte"], answer: fin ? 0 : 1,
          explain: "Chaque impulsion change l'état : " + nb + " impulsion" + (nb > 1 ? "s" : "") + (nb % 2 ? " (nombre impair) → l'état change." : " (nombre pair) → retour à l'état de départ.") });
      } else if (ex.gen === "ib" || ex.gen === "dim") {
        var AP = [["Chauffe-eau", 2000], ["Chauffe-eau", 2400], ["Chauffe-eau", 3000], ["Circuit de radiateurs", 3000], ["Circuit de radiateurs", 3500],
          ["Circuit de radiateurs", 4000], ["Circuit de radiateurs", 4500], ["Plaque de cuisson", 6000], ["Plaque de cuisson", 7200]];
        var usedA = out.map(function (o) { return o.ai; }), ai;
        do { ai = Math.floor(r() * AP.length); } while (usedA.indexOf(ai) >= 0);
        var ap = AP[ai], ib = ap[1] / 230;
        if (ex.gen === "ib") {
          out.push({ ai: ai, q: ap[0] + " de " + ap[1].toLocaleString("fr-FR") + " W en 230 V (appareil résistif). Courant d'emploi Ib en ampères ?", answer: Math.round(ib * 10) / 10, tol: 0.15, unit: "A",
            explain: "Ib = P / U = " + ap[1] + " / 230 = " + fr(Math.round(ib * 10) / 10) + " A" });
        } else {
          var di = ap[0] === "Plaque de cuisson" ? 2 : ap[0] === "Chauffe-eau" ? 1 : ap[1] <= 3500 ? 0 : 1;
          out.push({ ai: ai, qcm: true, q: ap[0] + " de " + ap[1].toLocaleString("fr-FR") + " W. Disjoncteur et section ?", options: ["16 A – 1,5 mm²", "20 A – 2,5 mm²", "32 A – 6 mm²"], answer: di,
            explain: "Ib = " + fr(Math.round(ib * 10) / 10) + " A → " + ["16 A – 1,5 mm²", "20 A – 2,5 mm²", "32 A – 6 mm²"][di] + (ap[0] === "Chauffe-eau" ? " (chauffe-eau : circuit dédié 20 A, 2,5 mm²)" : ap[0] === "Circuit de radiateurs" ? " (chauffage : 3 500 W en 1,5 mm² / 16 A, 4 500 W en 2,5 mm² / 20 A)" : "") });
        }
      } else if (ex.gen === "du") {
        var kind = k % 2, L = 12 + Math.floor(r() * 27), S2, I2, lim, lab;
        if (kind === 0) { S2 = 2.5; I2 = 16; lim = 5; lab = "Circuit de prises 2,5 mm², Ib = 16 A"; }
        else { S2 = 1.5; I2 = [4, 5, 6][Math.floor(r() * 3)]; lim = 3; lab = "Circuit d'éclairage 1,5 mm², Ib = " + I2 + " A"; }
        var du = 2 * 0.0225 * L * I2 / S2, pc = Math.round(1000 * du / 230) / 10;
        out.push({ q: lab + ", longueur " + L + " m. Chute de tension ΔU en % ?", answer: pc, tol: 0.15, unit: "%",
          explain: "ΔU = 2 × 0,0225 × " + L + " × " + I2 + " / " + fr(S2) + " = " + fr(Math.round(du * 100) / 100) + " V → " + fr(pc) + " % " + (pc <= lim ? "≤ " : "> ") + lim + " % : " + (pc <= lim ? "conforme" : "non conforme") });
      } else if (ex.gen === "idnb") {
        var bk = (k + Math.floor(r() * 3)) % 3, surf = bk === 0 ? 24 + Math.floor(r() * 11) : bk === 1 ? 40 + Math.floor(r() * 55) : 105 + Math.floor(r() * 50), nb = bk + 2;
        out.push({ q: "Logement de " + surf + " m² : nombre minimal d'interrupteurs différentiels 30 mA ?", answer: nb, tol: 0, unit: "ID",
          explain: surf <= 35 ? "≤ 35 m² : 1 ID 25 A type AC + 1 ID 40 A type A = 2" : surf <= 100 ? "35 à 100 m² : 2 ID 40 A type AC + 1 ID 40 A type A = 3" : "> 100 m² : 3 ID 40 A type AC + 1 ID 40 A type A = 4" });
      } else if (ex.gen === "uc") {
        var SENS = [[0.5, "500 mA (AGCP)"], [0.3, "300 mA"], [0.03, "30 mA"]], sv = SENS[k % 3], Rt = [35, 60, 80, 120, 150, 180, 220, 300][Math.floor(r() * 8)];
        var Uc = Math.round(Rt * sv[0] * 10) / 10;
        out.push({ q: "Terre de " + Rt + " Ω, différentiel " + sv[1] + ". Tension de contact U = R × IΔn, en volts ?", answer: Uc, tol: 0.15, unit: "V",
          explain: Rt + " × " + fr(sv[0]) + " = " + fr(Uc) + " V " + (Uc <= 50 ? "≤ 50 V : protection assurée" : "> 50 V : protection insuffisante") });
      } else if (ex.gen === "terre") {
        var pool = [40, 65, 90, 100, 110, 140, 180, 250], usedT = out.map(function (o) { return o.R; }), Rr;
        do { Rr = pool[Math.floor(r() * pool.length)]; } while (usedT.indexOf(Rr) >= 0);
        if (k === 1 && (out[0].R <= 100) === (Rr <= 100)) Rr = out[0].R <= 100 ? 180 : 65;
        var okT = Rr * 0.5 <= 50;
        out.push({ qcm: true, R: Rr, q: "Terre mesurée à " + Rr + " Ω. L'AGCP 500 mA suffit-il à assurer la protection ?", options: ["Oui", "Non"], answer: okT ? 0 : 1,
          explain: Rr + " × 0,5 = " + fr(Rr * 0.5) + " V " + (okT ? "≤ 50 V : oui (le 30 mA reste exigé pour les personnes)." : "> 50 V : non → 30 mA sur tous les circuits et améliorer la terre.") });
      } else if (ex.gen === "idcal") {
        var C, CE, oth, I, tries = 0;
        do {
          C = r() < 0.5 ? 16 : 20; CE = r() < 0.5 ? 0 : 20;
          oth = []; var no = 2 + Math.floor(r() * 3); for (var j = 0; j < no; j++) oth.push([10, 16, 20][Math.floor(r() * 3)]);
          I = C + CE + 0.5 * oth.reduce(function (a, b) { return a + b; }, 0); tries++;
        } while ((I > 63 || (k > 0 && out[0].I <= 40 === I <= 40)) && tries < 50);
        var cal = I <= 25 ? 25 : I <= 40 ? 40 : 63;
        var txt = "Rangée : convecteurs " + C + " A" + (CE ? ", chauffe-eau " + CE + " A" : "") + ", autres circuits " + oth.join(" A, ") + " A.";
        out.push({ qcm: true, I: I, q: txt + " Calibre de l'interrupteur différentiel ?", options: ["25 A", "40 A", "63 A"], answer: [25, 40, 63].indexOf(cal),
          explain: C + (CE ? " + " + CE : "") + " + 0,5 × (" + oth.join(" + ") + ") = " + fr(I) + " A → " + cal + " A" });
      }
    }
    S.gens[key] = out; save(); return out;
  }

  /* ---------- correction ---------- */
  function maxOf(m, i, ex) {
    switch (ex.type) {
      case "qcm": case "num": return 1;
      case "tf": return ex.items.length;
      case "match": return ex.pairs.length;
      case "order": return ex.items.length;
      case "pick": return ex.items.length;
      case "gen": return ex.n;
      default: return 0;
    }
  }
  function grade(m, i, ex, val) {
    var sc = 0, ok = [];
    if (ex.type === "qcm") { ok = [val === ex.answer]; }
    else if (ex.type === "num") { var x = parseNum(val); ok = [!isNaN(x) && Math.abs(x - ex.answer) <= (ex.tol || 0) + 1e-9]; }
    else if (ex.type === "tf") { ok = ex.items.map(function (it, k) { return val[k] === it[1]; }); }
    else if (ex.type === "match") { ok = ex.pairs.map(function (p, k) { return val[k] === p[1]; }); }
    else if (ex.type === "order") { ok = ex.items.map(function (it, k) { return val[k] === it; }); }
    else if (ex.type === "pick") { ok = ex.items.map(function (it, k) { return !!val[k] === it[1]; }); }
    else if (ex.type === "gen") {
      ok = genItems(m, i, ex).map(function (g, k) { if (g.qcm) return val[k] === g.answer; var x = parseNum(val[k]); return !isNaN(x) && Math.abs(x - g.answer) <= g.tol + 1e-9; });
    }
    ok.forEach(function (b) { if (b) sc++; });
    return { score: sc, ok: ok };
  }

  /* ---------- rendu d'un exercice ---------- */
  function renderEx(m, i, ex) {
    var key = m.id + "-" + i, st = S.ex[key] || {}, done = !!st.done;
    var card = h("section", { class: "ex" + (done ? " done" : ""), id: "ex-" + key, "aria-labelledby": "q-" + key });
    var max = maxOf(m, i, ex);
    var head = h("div", { class: "exhead" }, [
      h("span", { class: "exnum" }, [String(i + 1)]),
      ex.type === "task" ? h("span", { class: "tag phone" }, ["Téléphone"]) : null,
      ex.research ? h("span", { class: "tag search" }, ["Recherche"]) : null,
      ex.type === "open" ? h("span", { class: "tag" }, ["Réponse rédigée"]) : null,
      done && max ? h("span", { class: "tag score" }, [st.score + " / " + max]) : null
    ]);
    card.appendChild(head);
    if (ex.research) card.appendChild(h("p", { class: "research" }, [ex.research]));
    if (ex.q) card.appendChild(h("h3", { id: "q-" + key }, [ex.q]));
    if (ex.img) card.appendChild(h("img", { class: "schema", src: ex.img, alt: ex.alt || "Schéma multifilaire du simple allumage" }));
    var val = st.val != null ? st.val : null;
    var body = h("div", { class: "exbody" });
    card.appendChild(body);
    var res = done ? { ok: st.ok || [] } : null;
    var mark = function (el, good) { if (res) el.classList.add(good ? "good" : "bad"); };

    if (ex.type === "qcm") {
      var cur = val;
      ex.options.forEach(function (o, k) {
        var id = key + "-o" + k;
        var lab = h("label", { class: "opt", for: id }, [h("input", { type: "radio", name: key, id: id, value: k, checked: cur === k ? "checked" : false, disabled: done ? "disabled" : false, onchange: function () { cur = k; } }), h("span", null, [o])]);
        if (res) { if (k === ex.answer) lab.classList.add("good"); else if (k === cur) lab.classList.add("bad"); }
        body.appendChild(lab);
      });
      card._get = function () { return cur; };
    } else if (ex.type === "num") {
      var inp = h("input", { type: "text", inputmode: "decimal", class: "num", value: val != null ? val : "", disabled: done ? "disabled" : false, "aria-label": "Ta réponse" });
      var row = h("div", { class: "numrow" }, [inp, ex.unit ? h("span", { class: "unit" }, [ex.unit]) : null]);
      mark(row, res && res.ok[0]); body.appendChild(row);
      if (res && !res.ok[0]) body.appendChild(h("p", { class: "fix" }, ["Réponse attendue : " + fr(ex.answer) + " " + (ex.unit || "")]));
      card._get = function () { return inp.value; };
    } else if (ex.type === "tf") {
      var tv = val || {};
      ex.items.forEach(function (it, k) {
        var row = h("div", { class: "tfrow" }, [h("span", { class: "tft" }, [it[0]])]);
        var grp = h("div", { class: "seg", role: "group", "aria-label": it[0] });
        [["Vrai", true], ["Faux", false]].forEach(function (c) {
          var b = h("button", { type: "button", class: "segb", "aria-pressed": tv[k] === c[1] ? "true" : "false", disabled: done ? "disabled" : false,
            onclick: function () { tv[k] = c[1]; Array.prototype.forEach.call(grp.children, function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); } }, [c[0]]);
          grp.appendChild(b);
        });
        row.appendChild(grp); mark(row, res && res.ok[k]);
        if (res && !res.ok[k]) row.appendChild(h("span", { class: "fix" }, ["→ " + (it[1] ? "Vrai" : "Faux")]));
        body.appendChild(row);
      });
      card._get = function () { return tv; };
    } else if (ex.type === "match") {
      var mv = val || {}, opts = shuffle(uniq(ex.pairs.map(function (p) { return p[1]; })), key + "o"), order = shuffle(ex.pairs.map(function (p, k) { return k; }), key + "l");
      var sels = {};
      order.forEach(function (k) {
        var p = ex.pairs[k];
        var sel = h("select", { disabled: done ? "disabled" : false, "aria-label": ex.imgs ? "Nom du symbole" : p[0] }, [h("option", { value: "" }, ["Choisir…"])].concat(opts.map(function (o) { return h("option", { value: o, selected: mv[k] === o ? "selected" : false }, [o]); })));
        sels[k] = sel;
        var left = ex.imgs ? h("img", { class: "sym", src: p[0], alt: "Symbole à identifier" }) : h("span", { class: "ml" }, [p[0]]);
        var row = h("div", { class: "mrow" + (ex.imgs ? " img" : "") }, [left, sel]);
        mark(row, res && res.ok[k]);
        if (res && !res.ok[k]) row.appendChild(h("span", { class: "fix" }, ["→ " + p[1]]));
        body.appendChild(row);
      });
      card._get = function () { var o = {}; for (var k in sels) o[k] = sels[k].value; return o; };
    } else if (ex.type === "order") {
      var list = val || shuffle(ex.items, key);
      var ol = h("ol", { class: "order" });
      var draw = function () {
        ol.innerHTML = "";
        list.forEach(function (it, k) {
          var li = h("li", null, [h("span", { class: "ot" }, [it])]);
          if (!done) {
            li.appendChild(h("span", { class: "obtn" }, [
              h("button", { type: "button", "aria-label": "Monter", disabled: k === 0 ? "disabled" : false, onclick: function () { var t = list[k - 1]; list[k - 1] = list[k]; list[k] = t; draw(); } }, ["▲"]),
              h("button", { type: "button", "aria-label": "Descendre", disabled: k === list.length - 1 ? "disabled" : false, onclick: function () { var t = list[k + 1]; list[k + 1] = list[k]; list[k] = t; draw(); } }, ["▼"])]));
          }
          mark(li, res && res.ok[k]);
          if (res && !res.ok[k]) li.appendChild(h("span", { class: "fix" }, ["→ " + ex.items[k]]));
          ol.appendChild(li);
        });
      };
      draw(); body.appendChild(ol);
      card._get = function () { return list.slice(); };
    } else if (ex.type === "pick") {
      var pv = val || {};
      ex.items.forEach(function (it, k) {
        var id = key + "-p" + k;
        var cb = h("input", { type: "checkbox", id: id, checked: pv[k] ? "checked" : false, disabled: done ? "disabled" : false, onchange: function () { pv[k] = cb.checked; } });
        var lab = h("label", { class: "opt", for: id }, [cb, h("span", null, [it[0]])]);
        mark(lab, res && res.ok[k]);
        if (res && !res.ok[k]) lab.appendChild(h("span", { class: "fix" }, [it[1] ? " → erreur à repérer" : " → ligne correcte"]));
        body.appendChild(lab);
      });
      card._get = function () { return pv; };
    } else if (ex.type === "gen") {
      var gi = genItems(m, i, ex), gv = val || {}, ins = {};
      gi.forEach(function (g, k) {
        var row = h("div", { class: "genrow" }, [h("p", null, [g.q])]);
        if (g.qcm) {
          var seg = h("div", { class: "seg" });
          g.options.forEach(function (o, j) {
            var b = h("button", { type: "button", class: "segb", "aria-pressed": gv[k] === j ? "true" : "false", disabled: done ? "disabled" : false,
              onclick: function () { gv[k] = j; Array.prototype.forEach.call(seg.children, function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); } }, [o]);
            seg.appendChild(b);
          });
          row.appendChild(seg); ins[k] = { get: function () { return gv[k]; } };
        } else {
          var inp = h("input", { type: "text", inputmode: "decimal", class: "num", value: gv[k] != null ? gv[k] : "", disabled: done ? "disabled" : false, "aria-label": "Ta réponse" });
          row.appendChild(h("div", { class: "numrow" }, [inp, h("span", { class: "unit" }, [g.unit])]));
          ins[k] = { get: function () { return inp.value; } };
        }
        mark(row, res && res.ok[k]);
        if (res) row.appendChild(h("p", { class: "fix" }, [g.explain]));
        body.appendChild(row);
      });
      card._get = function () { var o = {}; for (var k in ins) o[k] = ins[k].get(); return o; };
    } else if (ex.type === "open") {
      var ta = h("textarea", { rows: "5", disabled: done ? "disabled" : false, placeholder: ex.hint || "", "aria-label": "Ta réponse rédigée" }, [val || ""]);
      body.appendChild(ta);
      card._get = function () { return ta.value; };
    } else if (ex.type === "task") {
      var tk = (val && val.steps) || {};
      ex.steps.forEach(function (s, k) {
        var id = key + "-t" + k;
        var cb = h("input", { type: "checkbox", id: id, checked: tk[k] ? "checked" : false, disabled: done ? "disabled" : false, onchange: function () { tk[k] = cb.checked; } });
        body.appendChild(h("label", { class: "opt step", for: id }, [cb, h("span", null, [s])]));
      });
      var note = h("textarea", { rows: "3", disabled: done ? "disabled" : false, placeholder: ex.note || "", "aria-label": ex.note || "Remarques" }, [(val && val.note) || ""]);
      body.appendChild(h("label", { class: "notelab" }, [ex.note || "Remarques"]));
      body.appendChild(note);
      card._get = function () { return { steps: tk, note: note.value }; };
    }

    if (done && ex.explain && max) card.appendChild(h("p", { class: "explain" }, [ex.explain]));
    var msg = h("p", { class: "msg", role: "status", "aria-live": "polite" });
    if (!done) {
      card.appendChild(h("div", { class: "actions" }, [
        h("button", { type: "button", class: "primary", onclick: function () { validate(m, i, ex, card, msg); } }, [ex.type === "task" ? "J'ai terminé" : ex.type === "open" ? "Enregistrer ma réponse" : "Valider"]), msg]));
    }
    return card;
  }

  function validate(m, i, ex, card, msg) {
    var key = m.id + "-" + i, v = card._get();
    // contrôle de complétude
    var miss = false;
    if (ex.type === "qcm" && (v == null)) miss = true;
    if (ex.type === "num" && isNaN(parseNum(v))) miss = true;
    if (ex.type === "tf" && ex.items.some(function (_, k) { return v[k] === undefined; })) miss = true;
    if (ex.type === "match" && ex.pairs.some(function (_, k) { return !v[k]; })) miss = true;
    if (ex.type === "gen" && genItems(m, i, ex).some(function (g, k) { return g.qcm ? v[k] == null : isNaN(parseNum(v[k])); })) miss = true;
    if (ex.type === "open" && String(v).trim().length < 20) { msg.textContent = "Écris au moins une ou deux phrases."; return; }
    if (ex.type === "task" && ex.steps.some(function (_, k) { return !v.steps[k]; })) { msg.textContent = "Coche toutes les étapes quand elles sont faites."; return; }
    if (miss) { msg.textContent = "Réponds à toutes les questions avant de valider."; return; }
    var g = grade(m, i, ex, v);
    S.ex[key] = { val: v, done: true, score: g.score, ok: g.ok, t: Date.now() };
    if (!S.start) S.start = Date.now();
    save();
    var fresh = renderEx(m, i, ex);
    card.replaceWith(fresh);
    progressBar(m);
  }

  /* ---------- scores ---------- */
  function missionStats(m) {
    var sc = 0, mx = 0, dn = 0;
    m.ex.forEach(function (ex, i) { var st = S.ex[m.id + "-" + i]; mx += maxOf(m, i, ex); if (st && st.done) { dn++; sc += st.score || 0; } });
    return { score: sc, max: mx, done: dn, total: m.ex.length };
  }
  function progressBar(m) {
    var el = document.getElementById("mprog"); if (!el) return;
    var s = missionStats(m);
    el.querySelector(".bar i").style.width = Math.round(100 * s.done / s.total) + "%";
    el.querySelector(".ptxt").textContent = s.done + " / " + s.total + " exercices · " + s.score + " / " + s.max + " points";
    if (s.done === s.total) document.getElementById("mnext").classList.add("ready");
  }

  /* ---------- pages ---------- */
  function header(sub) {
    return h("header", { class: "top" }, [
      h("a", { href: "#/", class: "brand", "aria-label": "Accueil du TP" }, [h("img", { src: D.logo || "logo_greta.png", alt: "GRETA GIP FIPAN" })]),
      h("div", { class: "toptxt" }, [h("strong", null, [D.formation || "CAP Électricien"]), h("span", null, [sub || D.sousTitre])])
    ]);
  }
  function home() {
    app.innerHTML = "";
    app.appendChild(header());
    var main = h("main", { class: "wrap" });
    main.appendChild(h("div", { class: "hero" }, [
      h("p", { class: "eyebrow" }, [D.sousTitre]), h("h1", null, [D.titre]),
      h("p", { class: "lead" }, ["Travail en autonomie · durée conseillée " + D.duree + ". " + (D.lead || "Tu utilises la présentation du cours, les guides NF C 15-100 (sur le PC) et ton téléphone.")])
    ]));
    var nameIn = h("input", { type: "text", id: "nm", value: S.name, autocomplete: "name", placeholder: "Prénom Nom", oninput: function () { S.name = nameIn.value; save(); } });
    main.appendChild(h("section", { class: "card" }, [h("label", { for: "nm", class: "lab" }, ["Ton prénom et ton nom"]), nameIn]));
    main.appendChild(h("section", { class: "card rules" }, [
      h("h2", null, ["Comment ça marche"]),
      h("ol", null, [
        h("li", null, ["Fais les 5 missions dans l'ordre. Chaque mission indique où chercher les réponses."]),
        h("li", null, ["Réponds, puis clique sur « Valider » : la correction s'affiche. Tu n'as qu'un essai par exercice."]),
        h("li", null, ["Les pastilles « Téléphone » demandent une photo, une recherche ou un enregistrement avec ton téléphone."]),
        h("li", null, ["Tes réponses sont enregistrées sur cet appareil : reste sur le même PC du début à la fin."]),
        h("li", null, ["À la fin, ouvre le bilan et envoie-le ou imprime-le pour ton formateur."])])
    ]));
    var grid = h("div", { class: "mgrid" });
    D.missions.forEach(function (m) {
      var s = missionStats(m), pct = Math.round(100 * s.done / s.total);
      grid.appendChild(h("a", { class: "mcard" + (s.done === s.total ? " full" : ""), href: "#/" + m.id }, [
        h("span", { class: "mn" }, [String(m.num).padStart(2, "0")]),
        h("span", { class: "mt" }, [m.titre]),
        h("span", { class: "mm" }, [m.duree + " · " + m.competences]),
        h("span", { class: "bar" }, [h("i", { style: "width:" + pct + "%" })]),
        h("span", { class: "mm" }, [s.done + " / " + s.total + " exercices"])]));
    });
    grid.appendChild(h("a", { class: "mcard bilan", href: "#/bilan" }, [h("span", { class: "mn" }, ["✓"]), h("span", { class: "mt" }, ["Bilan à rendre"]), h("span", { class: "mm" }, ["Scores, réponses rédigées, envoi"])]));
    main.appendChild(grid);
    // QR code pour ouvrir sur le téléphone
    var qrBox = h("section", { class: "card qr" }, [h("h2", null, ["Ouvrir sur ton téléphone"]), h("p", { class: "hint" }, ["Scanne ce code avec l'appareil photo de ton téléphone pour faire les recherches ou relire une consigne."])]);
    var url = location.href.split("#")[0];
    if (/^https?:/.test(url) && window.qrcode) {
      var q = qrcode(0, "M"); q.addData(url); q.make();
      qrBox.appendChild(h("div", { class: "qrimg", html: q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }) }));
      qrBox.appendChild(h("p", { class: "url" }, [url]));
    } else qrBox.appendChild(h("p", { class: "hint" }, ["Le QR code apparaît quand le TP est publié en ligne (GitHub Pages)."]));
    main.appendChild(qrBox);
    app.appendChild(main);
    app.appendChild(footer());
  }
  function mission(m) {
    app.innerHTML = "";
    app.appendChild(header("Mission " + m.num + " · " + m.titre));
    var main = h("main", { class: "wrap" });
    main.appendChild(h("div", { class: "hero" }, [
      h("p", { class: "eyebrow" }, ["Mission " + m.num + " / " + D.missions.length + " · " + m.duree + " · " + m.competences]),
      h("h1", null, [m.titre]), h("p", { class: "lead" }, [m.intro]),
      h("p", { class: "src" }, [h("strong", null, ["Où chercher : "]), m.source])]));
    var s = missionStats(m);
    main.appendChild(h("div", { class: "prog", id: "mprog" }, [h("span", { class: "bar" }, [h("i", { style: "width:" + Math.round(100 * s.done / s.total) + "%" })]), h("span", { class: "ptxt" }, [""])]));
    m.ex.forEach(function (ex, i) { main.appendChild(renderEx(m, i, ex)); });
    var idx = D.missions.indexOf(m), nx = D.missions[idx + 1];
    main.appendChild(h("nav", { class: "next", id: "mnext" }, [
      h("a", { href: "#/", class: "btn" }, ["← Sommaire"]),
      nx ? h("a", { href: "#/" + nx.id, class: "btn primary" }, ["Mission " + nx.num + " →"]) : h("a", { href: "#/bilan", class: "btn primary" }, ["Voir mon bilan →"])]));
    app.appendChild(main); app.appendChild(footer());
    progressBar(m); window.scrollTo(0, 0);
  }
  function bilanText() {
    var L = [], tot = 0, mx = 0;
    L.push(D.sousTitre + " – " + D.titre);
    L.push("Élève : " + (S.name || "(nom non renseigné)"));
    L.push("Date : " + new Date().toLocaleString("fr-FR"));
    L.push("");
    D.missions.forEach(function (m) { var s = missionStats(m); tot += s.score; mx += s.max; L.push("Mission " + m.num + " – " + m.titre + " : " + s.score + " / " + s.max + " (" + s.done + "/" + s.total + " exercices)"); });
    L.push(""); L.push("TOTAL : " + tot + " / " + mx + " (" + (mx ? Math.round(100 * tot / mx) : 0) + " %)");
    D.missions.forEach(function (m) { m.ex.forEach(function (ex, i) {
      var st = S.ex[m.id + "-" + i]; if (!st || !st.done) return;
      if (ex.type === "open") { L.push(""); L.push("[M" + m.num + "] " + ex.q); L.push(st.val); }
      if (ex.type === "task") { L.push(""); L.push("[M" + m.num + "] " + ex.q + " : fait"); if (st.val.note) L.push("  " + (ex.note || "Note") + " : " + st.val.note); }
    }); });
    return L.join("\n");
  }
  /* ---------- envoi du bilan vers le Google Sheets du formateur ---------- */
  var SHEET_URL = (window.TPCONFIG && window.TPCONFIG.sheetUrl) || "";
  function bilanData() {
    var tot = 0, mx = 0, all = true, ms = D.missions.map(function (m) { var s = missionStats(m); tot += s.score; mx += s.max; if (s.done < s.total) all = false;
      return { num: m.num, titre: m.titre, score: s.score, max: s.max, faits: s.done, total: s.total }; });
    return { tp: D.num || 1, code: D.code || "", groupe: D.groupe || "CAP", titre: D.titre, nom: S.name || "(nom non renseigné)", date: new Date().toLocaleString("fr-FR"), score: tot, max: mx,
      pct: mx ? Math.round(100 * tot / mx) : 0, complet: all, missions: ms, texte: bilanText(), appareil: String(S.seed), envoi: (S.sent || []).length + 1 };
  }
  function sendBilan(btn, out) {
    if (!S.name) { out.className = "msg"; out.textContent = "Écris d'abord ton prénom et ton nom en haut de cette page."; return; }
    btn.disabled = true; out.className = "msg info"; out.textContent = "Envoi en cours…";
    var body = JSON.stringify(bilanData());
    var done, fail;
    done = function (txt) { S.sent = (S.sent || []).concat([new Date().toLocaleString("fr-FR")]); save(); btn.disabled = false; out.className = "msg ok"; out.textContent = txt; };
    fail = function () { btn.disabled = false; out.className = "msg"; out.textContent = "Échec de l'envoi (pas d'internet ?). Réessaie, ou utilise « Copier le bilan »."; };
    var finished = false, timer = setTimeout(function () { fail(); }, 20000);
    var ok0 = done, ko0 = fail;
    done = function (t) { if (finished) return; finished = true; clearTimeout(timer); ok0(t); };
    fail = function () { if (finished) return; finished = true; clearTimeout(timer); ko0(); };
    fetch(SHEET_URL, { method: "POST", body: body }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) done("Bilan envoyé à ton formateur le " + new Date().toLocaleString("fr-FR") + "."); else fail();
    }).catch(function () {
      if (!navigator.onLine) return fail();
      fetch(SHEET_URL, { method: "POST", mode: "no-cors", body: body }).then(function () { done("Bilan envoyé à ton formateur. Préviens-le pour qu'il vérifie qu'il l'a bien reçu."); }).catch(fail);
    });
  }
  function bilan() {
    app.innerHTML = "";
    app.appendChild(header("Bilan"));
    var main = h("main", { class: "wrap" });
    main.appendChild(h("div", { class: "hero" }, [h("p", { class: "eyebrow" }, [D.sousTitre]), h("h1", null, ["Mon bilan"]),
      h("p", { class: "lead" }, [new Date().toLocaleDateString("fr-FR")])]));
    var bname = h("input", { type: "text", id: "bnm", value: S.name, autocomplete: "name", placeholder: "Prénom Nom", oninput: function () {
      S.name = bname.value; save(); var pr = document.querySelector(".btxt"); if (pr) pr.textContent = bilanText(); } });
    main.appendChild(h("section", { class: "card" + (S.name ? "" : " warnbox") }, [h("label", { for: "bnm", class: "lab" }, ["Ton prénom et ton nom"]), bname,
      S.name ? null : h("p", { class: "hint warn" }, ["Écris ton nom avant d'envoyer ou d'imprimer ton bilan."])]));
    var tb = h("table", { class: "bt" }, [h("thead", null, [h("tr", null, [h("th", null, ["Mission"]), h("th", null, ["Exercices"]), h("th", null, ["Points"]), h("th", null, ["Réussite"])])])]);
    var tbody = h("tbody"), tot = 0, mx = 0, allDone = true;
    D.missions.forEach(function (m) {
      var s = missionStats(m); tot += s.score; mx += s.max; if (s.done < s.total) allDone = false;
      var p = s.max ? Math.round(100 * s.score / s.max) : 0;
      tbody.appendChild(h("tr", null, [h("td", null, [m.num + ". " + m.titre]), h("td", { class: "n" }, [s.done + " / " + s.total]), h("td", { class: "n" }, [s.score + " / " + s.max]),
        h("td", null, [h("span", { class: "lvl " + (p >= 80 ? "a" : p >= 50 ? "b" : "c") }, [p + " %"])])]));
    });
    var P = mx ? Math.round(100 * tot / mx) : 0;
    tbody.appendChild(h("tr", { class: "tot" }, [h("td", null, ["Total"]), h("td", null, [""]), h("td", { class: "n" }, [tot + " / " + mx]), h("td", null, [h("span", { class: "lvl " + (P >= 80 ? "a" : P >= 50 ? "b" : "c") }, [P + " %"])])]));
    tb.appendChild(tbody);
    main.appendChild(h("section", { class: "card" }, [tb, allDone ? null : h("p", { class: "hint warn" }, ["Certaines missions ne sont pas terminées."])]));
    var pre = h("pre", { class: "btxt" }, [bilanText()]);
    main.appendChild(h("section", { class: "card" }, [h("h2", null, ["Réponses rédigées et tâches"]), pre]));
    if (SHEET_URL) {
      var sout = h("p", { class: "msg" + (S.sent && S.sent.length ? " ok" : ""), role: "status", "aria-live": "polite" }, [S.sent && S.sent.length ? "Déjà envoyé le " + S.sent[S.sent.length - 1] + ". Tu peux renvoyer si tu as continué le TP." : ""]);
      var sbtn = h("button", { type: "button", class: "primary big", onclick: function () { sendBilan(sbtn, sout); } }, ["Envoyer à mon formateur"]);
      main.appendChild(h("section", { class: "card send" }, [h("h2", null, ["Rendre mon travail"]),
        h("p", { class: "hint" }, [allDone ? "Toutes les missions sont terminées : envoie ton bilan." : "Termine d'abord toutes les missions, puis envoie ton bilan."]), sbtn, sout]));
    }
    var info = h("p", { class: "msg", role: "status", "aria-live": "polite" });
    var acts = h("div", { class: "actions wrapbtn" }, [
      h("a", { href: "#/", class: "btn" }, ["← Accueil"]),
      h("button", { type: "button", class: SHEET_URL ? "" : "primary", onclick: function () { window.print(); } }, ["Imprimer / PDF"]),
      h("button", { type: "button", onclick: function () { var t = bilanText(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { info.textContent = "Bilan copié : colle-le dans un mail ou un message."; }); } }, ["Copier le bilan"]),
      h("button", { type: "button", onclick: function () { var b = new Blob([bilanText()], { type: "text/plain;charset=utf-8" }); var a = h("a", { href: URL.createObjectURL(b), download: "bilan_TP_documentaire_" + (D.num || 1) + "_" + (S.name || "eleve").replace(/\s+/g, "_") + ".txt" }); document.body.appendChild(a); a.click(); a.remove(); } }, ["Télécharger (.txt)"]),
      navigator.share ? h("button", { type: "button", onclick: function () { navigator.share({ title: "Bilan TP documentaire", text: bilanText() }).catch(function () {}); } }, ["Partager"]) : null,
      info]);
    main.appendChild(acts);
    main.appendChild(h("details", { class: "reset" }, [h("summary", null, ["Recommencer le TP (formateur)"]),
      h("p", { class: "hint" }, ["Efface toutes les réponses enregistrées sur cet appareil. Code formateur obligatoire."]),
      h("div", { class: "actions wrapbtn" }, [
        h("input", { type: "password", id: "rcode", autocomplete: "off", placeholder: "Code formateur", "aria-label": "Code formateur", style: "max-width:220px" }),
        h("button", { type: "button", class: "danger", onclick: function () {
          var c = document.getElementById("rcode"), msg = document.getElementById("rmsg");
          if (hash(String(c.value).trim().toUpperCase()) !== RESET_HASH) { msg.textContent = "Code incorrect : demande à ton formateur."; c.value = ""; c.focus(); return; }
          localStorage.removeItem(KEY); S = load(); save(); location.hash = "#/"; } }, ["Tout effacer"]),
        h("p", { class: "msg", id: "rmsg", role: "status", "aria-live": "polite" })])]));
    app.appendChild(main); app.appendChild(footer()); window.scrollTo(0, 0);
  }
  function footer() { return h("footer", { class: "foot" }, ["GRETA GIP FIPAN — Académie de Nice · " + (D.formation || "CAP Électricien") + " · " + (D.code ? "TP documentaire " + D.code : "TP documentaire n°" + (D.num || 1))]); }

  function route() {
    var r = (location.hash || "#/").slice(2);
    if (r === "bilan") return bilan();
    var m = D.missions.filter(function (x) { return x.id === r; })[0];
    if (m) return mission(m);
    home();
  }
  window.addEventListener("hashchange", route);
  route();
})();
