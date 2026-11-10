/* Moteur du TP documentaire : navigation, exercices, correction, sauvegarde locale, bilan. */
(function () {
  "use strict";
  var D = window.TPDOC;
  var KEY = "tpdoc:" + D.id;
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
    if (ex.img) card.appendChild(h("img", { class: "schema", src: ex.img, alt: "Schéma multifilaire du simple allumage" }));
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
      h("a", { href: "#/", class: "brand", "aria-label": "Accueil du TP" }, [h("img", { src: "assets/logo_greta.png", alt: "GRETA GIP FIPAN" })]),
      h("div", { class: "toptxt" }, [h("strong", null, ["CAP Électricien"]), h("span", null, [sub || D.sousTitre])])
    ]);
  }
  function home() {
    app.innerHTML = "";
    app.appendChild(header());
    var main = h("main", { class: "wrap" });
    main.appendChild(h("div", { class: "hero" }, [
      h("p", { class: "eyebrow" }, [D.sousTitre]), h("h1", null, [D.titre]),
      h("p", { class: "lead" }, ["Travail en autonomie · durée conseillée " + D.duree + ". Tu utilises la présentation du cours, les guides NF C 15-100 (sur le PC) et ton téléphone."])
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
  function bilan() {
    app.innerHTML = "";
    app.appendChild(header("Bilan"));
    var main = h("main", { class: "wrap" });
    main.appendChild(h("div", { class: "hero" }, [h("p", { class: "eyebrow" }, [D.sousTitre]), h("h1", null, ["Mon bilan"]),
      h("p", { class: "lead" }, [(S.name || "Pense à écrire ton nom sur la page d'accueil") + " · " + new Date().toLocaleDateString("fr-FR")])]));
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
    var info = h("p", { class: "msg", role: "status", "aria-live": "polite" });
    var acts = h("div", { class: "actions wrapbtn" }, [
      h("button", { type: "button", class: "primary", onclick: function () { window.print(); } }, ["Imprimer / PDF"]),
      h("button", { type: "button", onclick: function () { var t = bilanText(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { info.textContent = "Bilan copié : colle-le dans un mail ou un message."; }); } }, ["Copier le bilan"]),
      h("button", { type: "button", onclick: function () { var b = new Blob([bilanText()], { type: "text/plain;charset=utf-8" }); var a = h("a", { href: URL.createObjectURL(b), download: "bilan_TP_documentaire_" + (S.name || "eleve").replace(/\s+/g, "_") + ".txt" }); document.body.appendChild(a); a.click(); a.remove(); } }, ["Télécharger (.txt)"]),
      navigator.share ? h("button", { type: "button", onclick: function () { navigator.share({ title: "Bilan TP documentaire", text: bilanText() }).catch(function () {}); } }, ["Partager"]) : null,
      info]);
    main.appendChild(acts);
    main.appendChild(h("details", { class: "reset" }, [h("summary", null, ["Recommencer le TP (formateur)"]),
      h("p", { class: "hint" }, ["Efface toutes les réponses enregistrées sur cet appareil."]),
      h("button", { type: "button", class: "danger", onclick: function () { localStorage.removeItem(KEY); S = load(); save(); location.hash = "#/"; } }, ["Tout effacer"])]));
    app.appendChild(main); app.appendChild(footer()); window.scrollTo(0, 0);
  }
  function footer() { return h("footer", { class: "foot" }, ["GRETA GIP FIPAN — Académie de Nice · CAP Électricien · TP documentaire n°1"]); }

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
