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
      a: css('--ca'), at: css('--cat'), an: css('--can'), F: css('--cf'), M: css('--cm')
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
    const X = x => m.l + (x - xr[0]) / (xr[1] - xr[0]) * (w - m.l - m.r);
    const Y = y => h - m.b - (y - yr[0]) / (yr[1] - yr[0]) * (h - m.t - m.b);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '11px Inter, sans-serif'; ctx.lineWidth = 1;
    const sx = niceStep(xr[1] - xr[0], 6), sy = niceStep(yr[1] - yr[0], 5);
    const dx = Math.max(0, -Math.floor(Math.log10(sx) + 1e-9)), dy = Math.max(0, -Math.floor(Math.log10(sy) + 1e-9));
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
    new ResizeObserver(doe).observe(document.body);
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
      vl: css('--cvl'), w: css('--cw'), vm: css('--cvm') };   // paginakleuren voor extra (deel)snelheden
    // in een macro is # het argumentteken: een kleurcode #rrggbb moet daarom als ##rrggbb geschreven worden
    const kl = hex => hex.replace(/^#/, '##');
    for (const [n, hex] of Object.entries(k)) {
      if (!hex) continue;
      m['\\k' + n] = `\\textcolor{${kl(hex)}}{#1}`;
      m['\\ub' + n] = `\\textcolor{${kl(hex)}}{\\underbrace{\\textcolor{${kl(C.ink)}}{#1}}_{#2}}`;
    }
    return m;
  }
  function tex(root = document) {
    if (!global.katex) return;
    const macros = texMacros();
    root.querySelectorAll('.tex').forEach(el => {
      if (el.dataset.tex === undefined) el.dataset.tex = el.textContent;
      try {
        global.katex.render(el.dataset.tex, el, { displayMode: !el.classList.contains('inline'), throwOnError: false, macros: { ...macros } });
      } catch (e) { /* laat de TeX-code staan */ }
    });
  }
  if (document.readyState === 'complete') tex(); else global.addEventListener('load', () => tex());

  global.TM1 = Object.assign(global.TM1 || {}, {
    tex,
    kleuren, fmt, deg, rad, setup, arrow, label, formule, tipLabel, niceStep, niceNum,
    frame, curve, dot, cursor, scrub, afgeleide, tweedeAfgeleide, lus, bijGrootte, schaalLegende, uitlezing
  });
})(window);
