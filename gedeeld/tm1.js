/* TM1-animaties — gedeelde tekenfuncties.
   Gebruik in een pagina:  <script src="../gedeeld/tm1.js"></script>
   en daarna bv.  const { setup, arrow, tipLabel, frame, curve, dot } = TM1;
   Alles tekent op een <canvas> in schermcoördinaten (pixels, y naar beneden). */
(function (global) {
  'use strict';

  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /** Kleuren uit tm1.css, zodat vectoren overal dezelfde kleur hebben. */
  function kleuren() {
    return {
      ink: css('--ink'), muted: css('--muted'), grid: css('--grid'), line: css('--line'), accent: css('--accent'),
      r: css('--cr'), v: css('--cv'), vx: css('--cvx'), vy: css('--cvy'),
      a: css('--ca'), at: css('--cat'), an: css('--can'), F: css('--cf'), M: css('--cm'),
      // schakels van een vectoriële ketting (hoofdstuk 2): elke schakel een eigen kleur
      ka: css('--cka'), kb: css('--ckb'), kc: css('--ckc'), kd: css('--ckd'), ke: css('--cke')
    };
  }

  /** Getal met vaste breedte: spatie voor positieve waarden, echt minteken voor negatieve. */
  function fmt(x, d = 3) {
    const v = Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x;
    return (v >= 0 ? ' ' : '−') + Math.abs(v).toFixed(d);
  }
  const deg = r => r * 180 / Math.PI;
  const rad = d => d * Math.PI / 180;

  /** Maakt een canvas scherp op elk scherm. Roep o.resize() aan bij een venstergrootte-wijziging. */
  function setup(cv) {
    const o = { c: cv, ctx: cv.getContext('2d'), w: 0, h: 0 };
    o.resize = () => {
      const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
      o.w = r.width; o.h = r.height; o.ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    return o;
  }

  /** Pijl van (x0,y0) naar (x1,y1). Geeft false terug als ze te kort is om te tekenen. */
  function arrow(ctx, x0, y0, x1, y1, color, opt = {}) {
    const w = opt.w ?? 2.6, head = opt.head ?? 11, dash = opt.dash, alpha = opt.alpha ?? 1;
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    if (L < 2) return false;
    const ux = dx / L, uy = dy / L, hl = Math.min(head, L * 0.5), hw = hl * 0.42;
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hl * 0.85, y1 - uy * hl * 0.85); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * hl - uy * hw, y1 - uy * hl + ux * hw);
    ctx.lineTo(x1 - ux * hl + uy * hw, y1 - uy * hl - ux * hw);
    ctx.closePath(); ctx.fill(); ctx.restore();
    return true;
  }

  /** Symboollabel zoals in het handboek: cursieve letter, optioneel vectorpijl erboven, subscript. */
  function label(ctx, base, sub, x, y, color, opt = {}) {
    const size = opt.size ?? 16, vec = opt.vec ?? true, align = opt.align ?? 'left';
    const serif = '"Source Serif 4", Georgia, serif';
    ctx.save();
    ctx.font = `italic 600 ${size}px ${serif}`;
    const wb = ctx.measureText(base).width;
    ctx.font = `italic 500 ${size * 0.68}px ${serif}`;
    const ws = sub ? ctx.measureText(sub).width + 1 : 0;
    if (align === 'center') x -= (wb + ws) / 2; else if (align === 'right') x -= wb + ws;
    ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    ctx.font = `italic 600 ${size}px ${serif}`;
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.strokeText(base, x, y);
    ctx.fillStyle = color; ctx.fillText(base, x, y);
    if (vec) {
      const ay = y - size * 0.82;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(x + 1, ay); ctx.lineTo(x + wb + 2, ay); ctx.stroke();
      ctx.strokeStyle = color; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(x + 1, ay); ctx.lineTo(x + wb + 2, ay);
      ctx.moveTo(x + wb - 2, ay - 2.5); ctx.lineTo(x + wb + 2, ay); ctx.lineTo(x + wb - 2, ay + 2.5); ctx.stroke();
    }
    if (sub) {
      ctx.font = `italic 500 ${size * 0.68}px ${serif}`;
      ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeText(sub, x + wb + 1, y + size * 0.28); ctx.fillStyle = color; ctx.fillText(sub, x + wb + 1, y + size * 0.28);
    }
    ctx.restore();
  }

  /** Tekst met wiskunde in LaTeX-stijl, bv. '$|\\vec{v}_P|$ [m/s]' of '$a_{Pt}$ [m/s²]'.
      Tussen $…$: cursieve serif, \vec{…} (pijl erboven), _x of _{…} (subscript), ^x of ^{…} (superscript),
      en Griekse letters (\theta, \omega, \alpha, \beta, …). Buiten $…$: gewone tekst.
      opt: size (px, standaard 12), color, align ('left' | 'center' | 'right'). Basislijn op y. */
  const GRIEKS = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', theta: 'θ', omega: 'ω', Omega: 'Ω',
    phi: 'φ', varphi: 'φ', rho: 'ρ', pi: 'π', mu: 'μ', tau: 'τ', psi: 'ψ', cdot: '·' };
  function formule(ctx, src, x, y, opt = {}) {
    const size = opt.size ?? 12, color = opt.color ?? css('--muted'), align = opt.align ?? 'left';
    const serif = '"Source Serif 4", Georgia, serif', sans = 'Inter, sans-serif', ms = size + 2;
    const runs = [];
    String(src).split('$').forEach((seg, i) => {
      if (!seg) return;
      if (i % 2 === 0) { runs.push({ t: seg, f: `${size}px ${sans}`, dy: 0 }); return; }
      let k = 0;
      const groep = () => {
        if (seg[k] === '{') {
          let d = 1, j = k + 1;
          while (j < seg.length && d) { if (seg[j] === '{') d++; else if (seg[j] === '}') d--; j++; }
          const s = seg.slice(k + 1, j - 1); k = j; return s;
        }
        if (seg[k] === '\\') {
          const m = /^\\[a-zA-Z]+/.exec(seg.slice(k));
          if (m) { k += m[0].length; return m[0]; }
          // backslash gevolgd door een leesteken: \| is de dubbele norm ‖, anders het teken zelf
          const ch = seg[k + 1] || ''; k += 2; return ch === '|' ? '‖' : ch;
        }
        return seg[k++];
      };
      const sym = s => s.replace(/\\([a-zA-Z]+)/g, (m, n) => GRIEKS[n] ?? n);
      const stuk = (s, niveau, vec) => {
        const sz = niveau ? ms * 0.7 : ms, dy = niveau === 'sub' ? ms * 0.3 : niveau === 'sup' ? -ms * 0.42 : 0;
        const tekst = sym(s);
        if (vec) { runs.push({ t: tekst, f: `italic 600 ${sz}px ${serif}`, dy, vec: true, sz }); return; }
        for (const ch of tekst) {
          const cursief = /[A-Za-zͰ-Ͽ]/.test(ch);
          runs.push({ t: ch, f: `${cursief ? 'italic ' : ''}500 ${sz}px ${serif}`, dy });
        }
      };
      while (k < seg.length) {
        const c = seg[k];
        if (seg.startsWith('\\vec', k)) { k += 4; stuk(groep(), 0, true); continue; }
        if (c === '_' || c === '^') { k++; stuk(groep(), c === '_' ? 'sub' : 'sup'); continue; }
        if (c === '\\') { stuk(groep(), 0); continue; }
        if (c === ' ') { k++; runs.push({ t: ' ', f: `${ms * 0.6}px ${serif}`, dy: 0 }); continue; }
        stuk(c, 0); k++;
      }
    });
    ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    let W = 0;
    runs.forEach(r => { ctx.font = r.f; r.w = ctx.measureText(r.t).width + (r.vec ? 1 : 0); W += r.w; });
    let cx = align === 'center' ? x - W / 2 : align === 'right' ? x - W : x;
    ctx.fillStyle = color; ctx.strokeStyle = color;
    runs.forEach(r => {
      ctx.font = r.f; ctx.fillText(r.t, cx, y + r.dy);
      if (r.vec) {
        const ay = y + r.dy - r.sz * 0.82, x0 = cx + 1, x1 = cx + r.w + 1;
        ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x0, ay); ctx.lineTo(x1, ay);
        ctx.moveTo(x1 - 3.5, ay - 2.3); ctx.lineTo(x1, ay); ctx.lineTo(x1 - 3.5, ay + 2.3); ctx.stroke();
      }
      cx += r.w;
    });
    ctx.restore();
    return W;
  }

  /** Label net voorbij de punt van een pijl. */
  function tipLabel(ctx, x0, y0, x1, y1, base, sub, color, vec = true) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (L < 6) return;
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    label(ctx, base, sub, x1 + ux * 12, y1 + uy * 12 + 6, color,
      { vec, align: ux < -0.35 ? 'right' : (ux > 0.35 ? 'left' : 'center') });
  }

  function niceStep(span, target) {
    const raw = span / target, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  }
  function niceNum(x) {
    const p = Math.pow(10, Math.floor(Math.log10(x))), f = x / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }

  /** Assen, raster en asbijschriften voor een grafiek. Geeft omzetfuncties X(x), Y(y) terug. */
  function frame(G, xr, yr, xl, yl, xfmt) {
    const C = kleuren();
    const ctx = G.ctx, w = G.w, h = G.h, m = { l: 44, r: 10, t: 10, b: 34 };
    ctx.clearRect(0, 0, w, h);
    ctx.font = '11px Inter, sans-serif'; ctx.lineWidth = 1;
    const sx = niceStep(xr[1] - xr[0], 6), sy = niceStep(yr[1] - yr[0], 5);
    const dx = Math.max(0, -Math.floor(Math.log10(sx) + 1e-9)), dy = Math.max(0, -Math.floor(Math.log10(sy) + 1e-9));
    // linkermarge zo breed dat het asbijschrift niet over de getallen van de y-as valt (bv. 0.25, −0.05)
    let wy = 0;
    for (let y = Math.ceil(yr[0] / sy - 1e-9) * sy; y <= yr[1] + 1e-9; y += sy) wy = Math.max(wy, ctx.measureText((Math.abs(y) < 1e-9 ? 0 : y).toFixed(dy).replace('-', '−')).width);
    m.l = Math.max(44, Math.ceil(wy) + 36);
    const X = x => m.l + (x - xr[0]) / (xr[1] - xr[0]) * (w - m.l - m.r);
    const Y = y => h - m.b - (y - yr[0]) / (yr[1] - yr[0]) * (h - m.t - m.b);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let x = Math.ceil(xr[0] / sx - 1e-9) * sx; x <= xr[1] + 1e-9; x += sx) {
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(X(x), m.t); ctx.lineTo(X(x), h - m.b); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.fillText(xfmt ? xfmt(x) : (Math.abs(x) < 1e-9 ? 0 : x).toFixed(dx).replace('-', '−'), X(x), h - m.b + 4);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let y = Math.ceil(yr[0] / sy - 1e-9) * sy; y <= yr[1] + 1e-9; y += sy) {
      ctx.strokeStyle = Math.abs(y) < 1e-9 ? '#b9bec5' : C.grid;
      ctx.beginPath(); ctx.moveTo(m.l, Y(y)); ctx.lineTo(w - m.r, Y(y)); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.fillText((Math.abs(y) < 1e-9 ? 0 : y).toFixed(dy).replace('-', '−'), m.l - 6, Y(y));
    }
    ctx.strokeStyle = '#b9bec5'; ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, h - m.b); ctx.lineTo(w - m.r, h - m.b); ctx.stroke();
    // asbijschriften: mogen wiskunde in LaTeX-stijl bevatten, zie formule()
    formule(ctx, xl, w - m.r, h - 7, { align: 'right', color: C.muted });
    ctx.save(); ctx.translate(15, m.t + (h - m.t - m.b) / 2); ctx.rotate(-Math.PI / 2);
    formule(ctx, yl, 0, 0, { align: 'center', color: C.muted }); ctx.restore();
    return { X, Y, m, xr, yr };
  }

  /** Parametrische kromme (fx(u), fy(u)) voor u van a tot b, in n stappen. */
  function curve(ctx, F, n, a, b, fx, fy, color, w = 2) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const u = a + (b - a) * i / n, X = F.X(fx(u)), Y = F.Y(fy(u));
      i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    ctx.stroke(); ctx.restore();
  }

  function dot(ctx, x, y, color, r = 5) {
    ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  /** Verticale cursorlijn in een grafiek op x. */
  function cursor(ctx, F, x) {
    ctx.save(); ctx.strokeStyle = kleuren().ink; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(F.X(x), F.Y(F.yr[0])); ctx.lineTo(F.X(x), F.Y(F.yr[1])); ctx.stroke(); ctx.restore();
  }

  /**
   * Grafiek voor de interpretatie (stap 5) in een canvas dat in de stapkaart staat.
   * krommen: [{ f: x => y, kleur, naam?, stippel?, bolletje? }]; waarden buiten het bereik of NaN worden niet getekend.
   * xNu: de gekozen waarde (cursorlijn en bolletjes op de krommen); legende rechtsboven met de namen.
   */
  function grafiekIn(cv, xr, yr, xl, yl, krommen, xNu) {
    if (!cv) return null;
    const r = cv.getBoundingClientRect(); if (r.width < 10 || r.height < 10) return null;
    const d = window.devicePixelRatio || 1; cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    const ctx = cv.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
    const G = { c: cv, ctx, w: r.width, h: r.height }, F = frame(G, xr, yr, xl, yl);
    ctx.save(); ctx.beginPath(); ctx.rect(F.m.l, F.m.t, G.w - F.m.l - F.m.r, G.h - F.m.t - F.m.b); ctx.clip();
    for (const k of krommen) {
      ctx.save(); ctx.strokeStyle = k.kleur; ctx.lineWidth = k.dik ?? 2.2; ctx.lineJoin = 'round'; if (k.stippel) ctx.setLineDash([6, 4]);
      ctx.beginPath(); let aan = false;
      for (let i = 0; i <= 300; i++) {
        const x = xr[0] + (xr[1] - xr[0]) * i / 300, y = k.f(x);
        if (!isFinite(y) || y < yr[0] - 10 * (yr[1] - yr[0]) || y > yr[1] + 10 * (yr[1] - yr[0])) { aan = false; continue; }
        aan ? ctx.lineTo(F.X(x), F.Y(y)) : ctx.moveTo(F.X(x), F.Y(y)); aan = true;
      }
      ctx.stroke(); ctx.restore();
    }
    ctx.restore();
    if (xNu != null && xNu >= xr[0] && xNu <= xr[1]) {
      cursor(ctx, F, xNu);
      for (const k of krommen) { if (k.bolletje === false) continue; const y = k.f(xNu); if (isFinite(y) && y >= yr[0] && y <= yr[1]) dot(ctx, F.X(xNu), F.Y(y), k.kleur); }
    }
    ctx.save(); ctx.font = '11.5px Inter, sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    krommen.filter(k => k.naam).forEach((k, i) => { ctx.fillStyle = k.kleur; ctx.fillText(k.naam, G.w - F.m.r - 4, F.m.t + 12 + 14 * i); });
    ctx.restore();
    return { F, ctx, G };
  }

  /**
   * Blok "Versnelling" onder de verbinding (stap 2 van de dynamicavoorbeelden).
   * Twee vragen over de snelheid: verandert haar grootte (→ a_t) en verandert haar richting (→ a_n)?
   * cfg = {
   *   na: element waaronder het blok komt (de proeftabel), titel,
   *   soort: 'cirkel' | 'recht',
   *   grootte: 'constant' | 'toe' | 'af' | 'rust' | 'trilling',
   *   zin: 1 (wijzerzin) of -1 (cirkel), hoek: bewegingsrichting op het scherm in rad (recht, 0 = naar rechts, π/2 = naar beneden),
   *   fase: plaats op de cirkel in rad vanaf de top, in wijzerzin (cirkel), straal: naam van de straal ('R', 'L', …), midden: naam van het middelpunt,
   *   rijen: { grootte: { uit, kop }, richting: { uit, kop } }   (uit: html in de tabel; kop: formule boven de figuur, zie formule()),
   *   kleur, bijKlik(): de pagina wist haar eigen oplichten en hertekent, tik(): hertekent het vrijlichaamsdiagram tijdens de animatie
   * }
   * Teruggegeven: toon(zichtbaar), reset(), licht() (id die oplicht), gloed(id) (0..1, pulserend tijdens de animatie), mk(id, tex) (kader rond een formuledeel).
   */
  function versnelling(cfg) {
    const C = kleuren(), KA = cfg.kleur || '#1c7ed6';
    const blok = document.createElement('div'); blok.style.display = 'none';
    blok.innerHTML = `<h3 style="margin:16px 0 4px">${cfg.titel || 'Versnelling'}</h3>${cfg.intro ? `<p class="noot" style="margin:2px 0 6px">${cfg.intro}</p>` : ''}<canvas style="width:100%;height:${cfg.hoogte || 210}px;display:block;touch-action:pan-y;cursor:default"></canvas><table class="proef"></table>`;
    cfg.na.insertAdjacentElement('afterend', blok);
    const G = setup(blok.querySelector('canvas')), tab = blok.querySelector('table');
    let anim = null, licht = null, zicht = false; const gezien = {};
    const VRAGEN = [['grootte', 'grootte van de snelheid'], ['richting', 'richting van de snelheid']];
    function tabel() {
      tab.innerHTML = VRAGEN.map(([id, t]) => `<tr><td><button data-v="${id}">▶ bekijk</button></td><td>${t}</td><td>${gezien[id] ? `<span class="uit vrij">✓</span> ${cfg.rijen[id].uit}` : '<span class="uit nog">nog niet bekeken</span>'}</td></tr>`).join('');
      tab.querySelectorAll('button').forEach(b => b.onclick = () => {
        const id = b.dataset.v; gezien[id] = true; licht = id; anim = { id, t: 0, T: 3 };
        if (cfg.bijKlik) cfg.bijKlik();
        let last = null; const f = ts => { if (!anim) return; if (last !== null) anim.t += Math.min((ts - last) / 1000, 0.05); last = ts;
          if (anim.t >= anim.T) anim = null; teken(); if (cfg.tik) cfg.tik(); if (anim) requestAnimationFrame(f); };
        requestAnimationFrame(f);
      });
    }
    // pijl met dubbele lijn (versnelling)
    function dubbel(ctx, x0, y0, x1, y1, w = 2) {
      const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy); if (l < 4) return false;
      const ux = dx / l, uy = dy / l, nx = -uy, ny = ux, h = 12, s = 3.5;
      ctx.save(); ctx.strokeStyle = KA; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x0 + k * s * nx, y0 + k * s * ny); ctx.lineTo(x1 - ux * h * 0.55 + k * s * nx, y1 - uy * h * 0.55 + k * s * ny); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(x1 - ux * h + nx * h * 0.75, y1 - uy * h + ny * h * 0.75); ctx.lineTo(x1, y1); ctx.lineTo(x1 - ux * h - nx * h * 0.75, y1 - uy * h - ny * h * 0.75); ctx.stroke();
      ctx.restore(); return true;
    }
    const blokje = (ctx, x, y, ang, alfa) => { ctx.save(); ctx.globalAlpha = alfa; ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = '#c9ddf0'; ctx.strokeStyle = '#2f5d80'; ctx.lineWidth = 1.5; ctx.fillRect(-8, -8, 16, 16); ctx.strokeRect(-8, -8, 16, 16); ctx.restore(); };
    const snel = (ctx, x, y, ux, uy, L, alfa, naam) => { if (L < 3) return; ctx.save(); ctx.globalAlpha = alfa; arrow(ctx, x, y, x + ux * L, y + uy * L, C.ink, { w: 2, head: 9 }); ctx.restore(); if (naam) label(ctx, 'v', '', x + ux * (L + 8) - 2, y + uy * (L + 8) - 3, C.ink, { size: 14 }); };
    function teken() {
      const ctx = G.ctx, W = G.w, H = G.h; ctx.clearRect(0, 0, W, H);
      if (!zicht || W < 40 || H < 40) return;
      const id = anim ? anim.id : licht, u = anim ? Math.min(anim.t / anim.T, 1) : 1, gr = cfg.grootte;
      const toonT = id === 'grootte' || gezien.grootte, toonN = id === 'richting' || gezien.richting;
      if (cfg.soort === 'cirkel') {
        // helft 'onder': enkel de onderste helft van de cirkel (als de bestudeerde stand onder het middelpunt ligt)
        const onder = cfg.helft === 'onder', Rp = onder ? Math.min(W * 0.3, H - 74) : Math.min(W * 0.2, (H - 56) / 2), o = { x: W * 0.42, y: onder ? 52 : 34 + Rp + 6 }, zin = cfg.zin || 1;
        const P = f => ({ x: o.x + Rp * Math.sin(f), y: o.y - Rp * Math.cos(f) }), T = f => ({ x: zin * Math.cos(f), y: zin * Math.sin(f) });
        ctx.save(); ctx.strokeStyle = '#9fb7cc'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(o.x, o.y, Rp, 0, onder ? Math.PI : 2 * Math.PI); ctx.stroke(); ctx.restore();
        if (onder) { ctx.save(); ctx.strokeStyle = '#d0d6dc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(o.x - Rp - 8, o.y); ctx.lineTo(o.x + Rp + 8, o.y); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(o.x, o.y, 3.5, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
        if (cfg.midden) label(ctx, cfg.midden, '', o.x + 7, o.y + (onder ? -6 : 16), '#4f5862', { vec: false, size: 13 });
        const f0 = cfg.fase || 0, d = 0.55 * zin, Lv = 0.7 * Rp;
        // snelheid langs de baan: na = later (bij 'rust' bewegen we vanuit rust), voor = vroeger
        const vRel = k => gr === 'toe' ? 1 + 0.35 * k : gr === 'af' ? 1 - 0.25 * k : gr === 'rust' ? 0.45 * k : 1;   // k < 0: vroeger, k > 0: later
        const ks = gr === 'rust' ? [1, 2] : [-2, -1];
        for (const k of ks) { const f = f0 + k * d, q = P(f), t = T(f); blokje(ctx, q.x, q.y, f, 0.25); snel(ctx, q.x, q.y, t.x, t.y, Lv * vRel(k) * (gr === 'rust' ? 1 : 1), 0.35, false); }
        const fNu = gr === 'rust' ? f0 : f0 - (1 - u) * d, q = P(fNu), t = T(fNu);
        blokje(ctx, q.x, q.y, fNu, 1); snel(ctx, q.x, q.y, t.x, t.y, gr === 'rust' ? 0 : Lv * vRel(-(1 - u)), 1, true);
        const links = q.x < o.x, tekstje = (s, kleur, rij) => { ctx.save(); ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = kleur; ctx.textAlign = links ? 'right' : 'left'; ctx.fillText(s, q.x + (links ? -14 : 14), q.y - 22 + 15 * rij); ctx.restore(); };
        if (gr === 'rust') tekstje('v = 0', C.ink, 0);
        if (toonN) {
          const nx = (o.x - q.x) / Rp, ny = (o.y - q.y) / Rp;
          ctx.save(); ctx.strokeStyle = '#9aa1a9'; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(o.x, o.y); ctx.stroke(); ctx.restore();
          if (cfg.straal) label(ctx, cfg.straal, '', (q.x + o.x) / 2 - 14 * ny, (q.y + o.y) / 2 + 14 * nx + 4, '#4f5862', { vec: false, size: 13 });
          if (gr === 'rust') tekstje('a_n = 0', KA, 1);
          else if (dubbel(ctx, q.x + nx * 10, q.y + ny * 10, q.x + nx * (10 + 0.5 * Rp), q.y + ny * (10 + 0.5 * Rp))) label(ctx, 'a', 'n', q.x + nx * (10 + 0.62 * Rp) + 8, q.y + ny * (10 + 0.62 * Rp) + 4, KA, { size: 14 });
        }
        if (toonT && gr !== 'constant') {
          const s = gr === 'af' ? -1 : 1, L = 0.45 * Rp, b = { x: q.x - t.y * 16, y: q.y + t.x * 16 };   // iets naast de baan
          if (dubbel(ctx, b.x, b.y, b.x + s * t.x * L, b.y + s * t.y * L)) label(ctx, 'a', 't', b.x + s * t.x * (L + 8) - 4, b.y + s * t.y * (L + 8) + 14, KA, { size: 14 });
        }
      } else {   // rechtlijnig
        const ang = cfg.hoek || 0, ux = Math.cos(ang), uy = Math.sin(ang), c = { x: W * 0.45, y: 34 + (H - 34) * 0.5 }, Ls = Math.min(W * 0.7, Math.abs(uy) > 0.5 ? H - 60 : W * 0.8);
        ctx.save(); ctx.strokeStyle = '#9fb7cc'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(c.x - ux * Ls / 2, c.y - uy * Ls / 2); ctx.lineTo(c.x + ux * Ls / 2, c.y + uy * Ls / 2); ctx.stroke(); ctx.restore();
        const pos = s => ({ x: c.x + ux * s * Ls / 2, y: c.y + uy * s * Ls / 2 });
        let standen, nu;
        if (gr === 'trilling') {   // harmonische trilling: x = A cos ωt; snelheid nul in de uitersten, maximaal in het midden
          const vAt = ph => -Math.sin(ph), xAt = ph => 0.8 * Math.cos(ph);
          standen = [0.6, 1.3, 2.0].map(ph => ({ s: xAt(ph), v: vAt(ph) })); const ph = 0.4 + 2 * Math.PI * u * (anim ? 1 : 0) + (anim ? 0 : 2.4); nu = { s: xAt(ph), v: vAt(ph), a: -xAt(ph) };
        } else {
          const fv = s => 0.35 + 0.65 * (s + 0.8) / 1.6;   // versnellend: snelheid neemt toe in de zin van de beweging
          standen = [-0.8, -0.45].map(s => ({ s, v: fv(s) })); const sN = -0.45 + 0.6 * u; nu = { s: sN, v: fv(sN), a: 1 };
        }
        const Lv = 0.22 * Ls;
        for (const st of standen) { const q = pos(st.s); blokje(ctx, q.x, q.y, 0, 0.25); snel(ctx, q.x, q.y, ux * Math.sign(st.v || 1), uy * Math.sign(st.v || 1), Lv * Math.abs(st.v), 0.35, false); }
        const q = pos(nu.s); blokje(ctx, q.x, q.y, 0, 1); snel(ctx, q.x, q.y, ux * Math.sign(nu.v || 1), uy * Math.sign(nu.v || 1), Lv * Math.abs(nu.v), 1, true);
        if (toonT) { const s = Math.sign(nu.a) || 1, L = gr === 'trilling' ? 0.3 * Ls * Math.abs(nu.a) : 0.18 * Ls, b = { x: q.x - uy * 18, y: q.y + ux * 18 };
          if (dubbel(ctx, b.x, b.y, b.x + s * ux * L, b.y + s * uy * L)) label(ctx, 'a', '', b.x + s * ux * (L + 8) - 2, b.y + s * uy * (L + 8) + 12, KA, { size: 14 }); }
        if (toonN) { ctx.save(); ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = KA; ctx.fillText('a_n = 0', q.x + uy * 22 + 6, q.y - ux * 22 - 4); ctx.restore(); }
      }
      if (id && cfg.rijen[id].kop) formule(ctx, cfg.rijen[id].kop, W / 2, 18, { align: 'center', color: KA, size: 13 });
    }
    return {
      toon(z) { zicht = z; blok.style.display = z ? '' : 'none'; if (z) { G.resize(); tabel(); teken(); } },
      reset() { anim = null; licht = null; teken(); },
      licht: () => licht,
      gloed: id => (licht === id ? (anim ? 0.5 + 0.5 * Math.sin(anim.t * 9) : 1) : 0),
      mk: (id, s) => (licht === id ? `\\colorbox{#ffe08a}{$${s}$}` : s)
    };
  }

  /** Klikken of slepen in een grafiek: callback krijgt de x-waarde op de horizontale as. */
  function scrub(G, getFrame, onX) {
    let down = false;
    const set = e => {
      const F = getFrame(); if (!F) return;
      const r = G.c.getBoundingClientRect(), px = e.clientX - r.left;
      const f = Math.min(Math.max((px - F.m.l) / (G.w - F.m.l - F.m.r), 0), 0.9999);
      onX(F.xr[0] + f * (F.xr[1] - F.xr[0]));
    };
    G.c.addEventListener('pointerdown', e => { down = true; G.c.setPointerCapture(e.pointerId); set(e); });
    G.c.addEventListener('pointermove', e => { if (down) set(e); });
    G.c.addEventListener('pointerup', () => { down = false; });
    G.c.addEventListener('pointercancel', () => { down = false; });
  }

  /** Numerieke afgeleide van een vectorfunctie f(t) -> {x, y}. Handig als je enkel r(t) kent. */
  function afgeleide(f, t, h = 1e-4) {
    const a = f(t + h), b = f(t - h);
    return { x: (a.x - b.x) / (2 * h), y: (a.y - b.y) / (2 * h) };
  }
  function tweedeAfgeleide(f, t, h = 1e-3) {
    const a = f(t + h), b = f(t), c = f(t - h);
    return { x: (a.x - 2 * b.x + c.x) / (h * h), y: (a.y - 2 * b.y + c.y) / (h * h) };
  }

  /** Animatielus. stap(dt) wordt elke frame opgeroepen zolang isPlaying() true is; render() altijd na een stap. */
  function lus(stap, isPlaying) {
    let last = null;
    function f(ts) {
      if (last !== null && isPlaying()) stap(Math.min((ts - last) / 1000, 0.05));
      last = ts; requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  /** Hertekent alle canvassen als de pagina van grootte verandert, en opnieuw als de lettertypes geladen zijn. */
  function bijGrootte(canvassen, render) {
    const doe = () => { canvassen.forEach(o => o.resize()); render(); };
    const ro = new ResizeObserver(doe);
    ro.observe(document.body);
    canvassen.forEach(o => ro.observe(o.c));   // ook als enkel een canvas van grootte verandert (werkblad-indeling)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
    doe();
  }

  /** Vectorschaal-legende linksonder in een scène. balken: [[lengte_px, kleur, tekst], ...]
      Met opt.rechtsboven = { w, y } komt ze rechtsboven (w = breedte van de scène, y = bovenkant). */
  function schaalLegende(ctx, h, balken, opt = {}) {
    const C = kleuren();
    if (opt.rechtsboven && balken.length) {
      const { w, y = 44 } = opt.rechtsboven, xr = w - 70;
      ctx.save(); ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = C.muted; ctx.textBaseline = 'middle';
      let yb = y; ctx.textAlign = 'right'; ctx.fillText('vectorschaal', w - 14, yb); yb += 18;
      balken.forEach(([len, col, txt]) => {
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xr - len, yb); ctx.lineTo(xr, yb); ctx.stroke();
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(xr - len, yb - 5); ctx.lineTo(xr - len, yb + 5); ctx.moveTo(xr, yb - 5); ctx.lineTo(xr, yb + 5); ctx.stroke();
        ctx.textAlign = 'left'; ctx.fillText(txt, xr + 6, yb); yb += 18;
      });
      ctx.restore();
      return;
    }
    ctx.save(); ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = C.muted; ctx.textBaseline = 'middle';
    let yb = h - 18;
    balken.slice().reverse().forEach(([len, col, txt]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(14, yb); ctx.lineTo(14 + len, yb); ctx.stroke();
      ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(14, yb - 5); ctx.lineTo(14, yb + 5); ctx.moveTo(14 + len, yb - 5); ctx.lineTo(14 + len, yb + 5); ctx.stroke();
      ctx.fillText(txt, 22 + len, yb); yb -= 20;
    });
    if (balken.length) ctx.fillText('vectorschaal', 14, yb);
    ctx.restore();
  }

  /** Uitleestabel: cellen = [[sleutel(html), waarde, breed?], ...] */
  function uitlezing(el, cellen) {
    el.innerHTML = cellen.map(([k, v, w]) =>
      `<div class="ro${w ? ' wide' : ''}"><div class="k">${k}</div><div class="val">${v}</div></div>`).join('');
  }

  /** Formules in TeX: elk element met class "tex" wordt met KaTeX gezet (class "tex inline" voor in de lopende tekst).
      Kleurmacro's, met dezelfde kleuren als de vectoren in de animatie:
        \kr{…} positie, \kv{…} snelheid, \ka{…} versnelling, \kat{…} tangentieel, \kan{…} normaal, \ke{…} eenheidsvector,
        \kvx, \kvy (componenten), \kF, \kM, en paginakleuren \kvl, \kw als --cvl / --cw bestaan.
      Accolade in kleur, inhoud zwart: \ubv{inhoud}{naam}, \ubat{…}{…}, \uban{…}{…}, \ube{…}{…}, enz.
      Vereist KaTeX in de pagina (zie README); zonder KaTeX blijft de TeX-code als tekst staan. */
  function texMacros() {
    const C = kleuren(), m = {};
    const k = { r: C.r, v: C.v, a: C.a, at: C.at, an: C.an, e: '#4f5862', vx: C.vx, vy: C.vy, F: C.F, M: C.M,
      vl: css('--cvl'), w: css('--cw'), vm: css('--cvm'),     // paginakleuren voor extra (deel)snelheden
      ka: C.ka, kb: C.kb, kc: C.kc, kd: C.kd, ke: C.ke };     // schakels van een vectoriële ketting: \kka … \kke
    // in een macro is # het argumentteken: een kleurcode #rrggbb moet daarom als ##rrggbb geschreven worden
    const kl = hex => hex.replace(/^#/, '##');
    for (const [n, hex] of Object.entries(k)) {
      if (!hex) continue;
      m['\\k' + n] = `\\textcolor{${kl(hex)}}{#1}`;
      m['\\ub' + n] = `\\textcolor{${kl(hex)}}{\\underbrace{\\textcolor{${kl(C.ink)}}{#1}}_{#2}}`;
    }
    return m;
  }
  // Een formule die breder is dan haar kader, krijgt de klasse "scrollbaar" (zichtbare schuifbalk en een
  // vervaging rechts zolang er nog iets verborgen is); aan het einde van het schuiven verdwijnt de vervaging.
  function markeerScroll(el) {
    const kan = el.scrollWidth > el.clientWidth + 1;
    el.classList.toggle('scrollbaar', kan);
    el.classList.toggle('eind', !kan || el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }
  const scrollWacht = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(es => es.forEach(e => markeerScroll(e.target))) : null;
  function tex(root = document) {
    if (!global.katex) return;
    const macros = texMacros();
    root.querySelectorAll('.tex').forEach(el => {
      if (el.dataset.tex === undefined) el.dataset.tex = el.textContent;
      try {
        global.katex.render(el.dataset.tex, el, { displayMode: !el.classList.contains('inline'), throwOnError: false, macros: { ...macros } });
      } catch (e) { /* laat de TeX-code staan */ }
      if (!el.classList.contains('inline')) {
        markeerScroll(el);
        if (!el.dataset.scrollWacht) { el.dataset.scrollWacht = '1'; el.addEventListener('scroll', () => markeerScroll(el), { passive: true }); if (scrollWacht) scrollWacht.observe(el); }
      }
    });
  }
  if (document.readyState === 'complete') tex(); else global.addEventListener('load', () => tex());

  /** Werkblad-indeling: zet de figuur en de grafieken naast elkaar, zodat een student ze samen ziet.
      De pagina's zelf blijven eenvoudig opgebouwd (scène, zijpanelen, grafieken eronder); deze functie
      verhuist de onderdelen bij het laden, nog vóór het paginascript de canvassen opmeet:
        - de toon-opties (paneel "Tonen") komen als uitklapbaar kader linksboven in de figuur,
        - de overige panelen (Bediening, Spring naar …) komen als balk onder de figuur,
        - de uitleestabel komt dichtgeklapt onder die balk,
        - de grafieken komen in een kolom rechts van de figuur,
        - korte toelichtingen (.note, .hint) en de doorverwijzing komen onder het werkblad.
      Een pagina die al een .werkblad heeft, wordt niet aangepast. */
  function werkblad() {
    const main = document.querySelector('.wrap > .main');
    if (!main || document.querySelector('.werkblad')) return;
    const scene = main.querySelector('.scene'), side = main.querySelector('.side');
    const graphs = document.querySelector('.wrap > .graphs');
    const maak = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
    const blad = maak('div', 'werkblad'), toel = maak('div', 'card toelichting');

    // figuur: alles vóór de uitleestabel gaat in een .doek (positie-anker voor de toon-opties)
    const doek = maak('div', 'doek'), readout = scene.querySelector('.readout');
    [...scene.children].forEach(el => { if (el !== readout) doek.appendChild(el); });
    scene.insertBefore(doek, readout);
    // vaste hints gaan naar de toelichting; een hint met een id wordt door de pagina bijgewerkt en blijft in de figuur
    doek.querySelectorAll('.hint').forEach(h => { if (!h.id) { toel.appendChild(maak('p', 'note', h.innerHTML)); h.remove(); } });
    // canvassen met een vaste verhouding (page-CSS aspect-ratio) houden die; de andere krijgen de werkbladhoogte
    doek.querySelectorAll('canvas').forEach(c => { if (getComputedStyle(c).aspectRatio === 'auto') c.classList.add('vrij'); });

    const bed = maak('div', 'bediening');
    [...(side ? side.children : [])].forEach(p => {
      const h2 = p.querySelector(':scope > h2'), titel = h2 ? h2.textContent.trim() : '';
      p.querySelectorAll('.note').forEach(n => toel.appendChild(n));   // het element zelf verhuist (een id blijft werken)
      if (h2) h2.remove();
      if (/^Tonen/.test(titel)) {
        const lagen = maak('div', 'lagen');
        lagen.appendChild(maak('span', 'titel', 'Tonen'));
        const t = p.querySelector('.toggles'); if (t) { t.removeAttribute('style'); lagen.appendChild(t); }
        doek.appendChild(lagen);
        if (p.children.length) { const g = maak('div', 'groep'); [...p.children].forEach(el => g.appendChild(el)); bed.appendChild(g); }
      } else if (/^Bediening/.test(titel)) {
        [...p.children].forEach(el => bed.appendChild(el));
      } else {
        const g = maak('div', 'groep'); if (titel) g.appendChild(maak('span', 'groeptitel', h2.innerHTML));
        [...p.children].forEach(el => g.appendChild(el));
        bed.appendChild(g);
      }
    });
    // de eerste schuifregelaar blijft in de balk; de overige gaan in een uitklapbaar "Meer instellingen".
    // Schuifregelaars met class "vast" blijven altijd in de balk (dan gaan alle andere naar "Meer instellingen").
    const alle = [...bed.querySelectorAll(':scope > .slider')], vast = alle.filter(s => s.classList.contains('vast'));
    const extra = vast.length ? alle.filter(s => !vast.includes(s)) : alle.slice(1);
    if (extra.length) {
      const d = maak('details', 'meer'); d.appendChild(maak('summary', '', side && side.dataset.meer || 'Meer instellingen'));
      const r = maak('div', 'rij'); extra.forEach(s => r.appendChild(s)); d.appendChild(r); bed.appendChild(d);
    }
    scene.insertBefore(bed, readout);
    if (readout) {
      const d = maak('details', 'waarden'); d.appendChild(maak('summary', '', 'Waarden in deze stand'));
      scene.insertBefore(d, readout); d.appendChild(readout);
    }
    blad.appendChild(scene);

    // grafieken in een kolom rechts
    const kaarten = graphs ? [...graphs.querySelectorAll(':scope > .graph')] : [];
    if (kaarten.length) {
      const kol = maak('div', 'grafiekkolom n' + Math.min(kaarten.length, 6));
      kaarten.forEach(k => kol.appendChild(k));
      blad.appendChild(kol);
      graphs.remove();
    } else blad.classList.add('zonder-grafieken');

    main.replaceWith(blad);
    const vervolg = document.querySelector('.wrap > .vervolg');
    if (vervolg) blad.after(vervolg);
    if (toel.children.length) (vervolg || blad).after(toel);

    // hoogte van de figuur: wat er op het scherm overblijft naast de kop en onder de bedieningsbalk
    const waarden = scene.querySelector('details.waarden');
    const kol = blad.querySelector('.grafiekkolom');
    const pas = () => {
      const kaarten = kol ? [...kol.children] : [];
      if (global.innerWidth <= 900) {
        blad.style.removeProperty('--h');
        kaarten.forEach(k => { const c = k.querySelector('canvas'); if (c) c.style.removeProperty('height'); });
        return;
      }
      const boven = blad.getBoundingClientRect().top + global.scrollY;
      const lagen = doek.querySelector('.lagen');
      const onder = bed.offsetHeight + (lagen ? lagen.offsetHeight : 0) + (waarden ? waarden.querySelector('summary').offsetHeight + 2 : 0);
      const beschikbaar = Math.max(420, global.innerHeight - boven - 14);
      blad.style.setProperty('--h', Math.max(260, Math.min(680, beschikbaar - onder)) + 'px');
      // grafieken: de kolom is even hoog als de figuur met haar bediening (niet hoger)
      if (kaarten.length) {
        const rijen = kaarten.length <= 3 ? kaarten.length : Math.ceil(kaarten.length / 2), gap = 12;
        const totaal = Math.min(beschikbaar, scene.offsetHeight), netto = totaal - gap * (rijen - 1);
        // in één kolom kan een grafiek meer hoogte krijgen met data-gewicht="2" (standaard 1)
        const gew = k => (rijen === kaarten.length ? +(k.dataset.gewicht || 1) : 1);
        const som = rijen === kaarten.length ? kaarten.reduce((s, k) => s + gew(k), 0) : rijen;
        kaarten.forEach(k => {
          const c = k.querySelector('canvas'); if (!c) return;
          const rest = k.offsetHeight - c.offsetHeight;
          // data-minhoogte="…" op een kaart: die grafiek wordt nooit lager (de kolom mag dan iets hoger worden);
          // in px ("210") of als fractie van de breedte van de grafiek ("0.62w")
          const mh = k.dataset.minhoogte || '90', min = mh.endsWith('w') ? parseFloat(mh) * c.clientWidth : +mh;
          c.style.height = Math.max(min, Math.floor(netto * gew(k) / som - rest)) + 'px';
        });
      }
    };
    pas();
    global.addEventListener('resize', pas);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pas);
  }
  werkblad();

  /** Vaste schaal voor een snelheidsdriehoek/-veelhoek. reeksen = lijst van puntenlijsten (één per bemonsterd
      tijdstip, telkens met de oorsprong en de hoekpunten); het vak omvat ze allemaal, zodat de schaal tijdens de
      beweging niet verandert. Geeft { k (px per m/s), Pp(p) → schermpunt }. */
  function vastVak(reeksen) {
    const b = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
    for (const pts of reeksen) for (const p of pts) {
      b.xmin = Math.min(b.xmin, p.x); b.xmax = Math.max(b.xmax, p.x); b.ymin = Math.min(b.ymin, p.y); b.ymax = Math.max(b.ymax, p.y);
    }
    return b;
  }
  function vasteSchaal(G, vak, m = 46, extra = 30) {
    m = Math.min(m, 0.14 * Math.min(G.w, G.h));            // in een lage grafiek: kleinere marge
    const bw = Math.max(vak.xmax - vak.xmin, 1e-9), bh = Math.max(vak.ymax - vak.ymin, 1e-9);
    const k = Math.min((G.w - 2 * m - extra) / bw, (G.h - 2 * m) / bh);
    const cx = (G.w - bw * k) / 2 - vak.xmin * k, cy = (G.h + bh * k) / 2 + vak.ymin * k;
    return { k, Pp: p => ({ x: cx + p.x * k, y: cy - p.y * k }) };
  }
  /** Vectorschaal rechtsboven in een driehoek-grafiek: een rond getal (1, 2, 5 × 10ⁿ m/s) van ongeveer 70 px. */
  function driehoekLegende(G, k, kleur) {
    const waarde = niceNum(70 / k), tekst = `${+waarde.toPrecision(3)} m/s`;
    schaalLegende(G.ctx, G.h, [[waarde * k, kleur, tekst]], { rechtsboven: { w: G.w, y: 6 } });
  }

  /** Breuk op het canvas, bv. een afgeleide d|AB|/dt: teller boven een breukstreep, noemer eronder. De differentiaal
      "d" vooraan staat recht, letters cursief, andere tekens (|, cijfers) recht. y = hoogte van de breukstreep;
      align 'left' (x = linkerrand), 'right' (x = rechterrand) of 'center'. Geeft de breedte terug. */
  function breuk(ctx, teller, noemer, x, y, opt = {}) {
    const size = opt.size ?? 13, kleur = opt.kleur ?? css('--ink'), align = opt.align ?? 'left', halo = opt.halo ?? true;
    const serif = '"Source Serif 4", Georgia, serif', fRecht = `500 ${size}px ${serif}`, fCurs = `italic 500 ${size}px ${serif}`;
    const delen = s => [...s].map((ch, i) => ({ ch, f: (i === 0 && ch === 'd') || !/[A-Za-zͰ-Ͽ]/.test(ch) ? fRecht : fCurs }));
    const breedte = d => d.reduce((w, p) => { ctx.font = p.f; return w + ctx.measureText(p.ch).width; }, 0);
    ctx.save();
    const T = delen(teller), N = delen(noemer), wT = breedte(T), wN = breedte(N), w = Math.max(wT, wN) + 4;
    const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    const schrijf = (d, wd, yy, basis) => {
      let cx = x0 + (w - wd) / 2; ctx.textAlign = 'left'; ctx.textBaseline = basis;
      d.forEach(p => { ctx.font = p.f; if (halo) { ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.strokeText(p.ch, cx, yy); }
        ctx.fillStyle = kleur; ctx.fillText(p.ch, cx, yy); cx += ctx.measureText(p.ch).width; });
    };
    ctx.strokeStyle = kleur; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke();
    schrijf(T, wT, y - 3, 'alphabetic'); schrijf(N, wN, y + 2, 'top');
    ctx.restore();
    return w;
  }

  global.TM1 = Object.assign(global.TM1 || {}, {
    tex, werkblad, vastVak, vasteSchaal, driehoekLegende, breuk,
    kleuren, fmt, deg, rad, setup, arrow, label, formule, tipLabel, niceStep, niceNum,
    frame, curve, dot, cursor, grafiekIn, versnelling, scrub, afgeleide, tweedeAfgeleide, lus, bijGrootte, schaalLegende, uitlezing
  });
})(window);
