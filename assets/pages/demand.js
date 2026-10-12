document.addEventListener('DOMContentLoaded', () => {
  const n = v => fmt(v, 2);

  // Demand for good a as a function of its own price: list of polyline segments [[Q,p],...]
  function demandCurve(type, p, pb, Y, pmin, pmax) {
    const segs = [], step = 0.05;
    if (type === 'ps') {
      const pstar = p.al * pb / p.be;
      const s1 = []; for (let q = pmin; q <= Math.min(pstar, pmax); q += step) s1.push([Y / q, q]);
      if (pstar >= pmin && pstar <= pmax) { s1.push([Y / pstar, pstar]); segs.push(s1); segs.push([[0, pstar], [Y / pstar, pstar]]); if (pstar < pmax) segs.push([[0, pstar], [0, pmax]]); }
      else if (pstar > pmax) segs.push(s1);
      else segs.push([[0, pmin], [0, pmax]]);
      return segs;
    }
    const s = []; for (let q = pmin; q <= pmax + 1e-9; q += step) s.push([Econ.optimal(type, p, q, pb, Y).a, q]);
    return [s];
  }

  // ================= Widget 1: derive a demand curve =================
  (function () {
    const host = document.getElementById('w-derive');
    if (!host) return;
    const ctl = host.querySelector('.ctl');
    const P1 = new Plot(host.querySelector('.ph1'), { xmax: 20, ymax: 10, xlabel: 'a', ylabel: 'b' });
    const P2 = new Plot(host.querySelector('.ph2'), { xmax: 20, ymax: 10, xlabel: 'quantity of a', ylabel: 'price p_a' });
    let type = 'cd';
    UI.select(ctl, {
      label: 'Preferences', value: 'cd', onChange: v => { type = v; draw(); },
      options: [['cd', 'Cobb-Douglas  a^α b^β'], ['pc', 'Perfect complements  min{αa, βb}'], ['ps', 'Perfect substitutes  αa + βb']]
    });
    const sAl = UI.slider(ctl, { label: '\\(\\alpha\\)', min: 1, max: 5, step: 1, value: 1, onInput: draw });
    const sBe = UI.slider(ctl, { label: '\\(\\beta\\)', min: 1, max: 5, step: 1, value: 1, onInput: draw });
    const sPb = UI.slider(ctl, { label: 'Price \\(p_b\\) (held fixed)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n(v), onInput: draw });
    const sY = UI.slider(ctl, { label: 'Income \\(Y\\) (held fixed)', min: 10, max: 60, step: 1, value: 40, fmt: v => '$' + n(v), onInput: draw });
    const sPa = UI.slider(ctl, { label: 'Price \\(p_a\\): move me!', min: 1, max: 10, step: 0.25, value: 4, fmt: v => '$' + n(v), onInput: draw });
    const out = UI.readout(ctl);

    function draw() {
      const p = { al: sAl.get(), be: sBe.get() }, pb = sPb.get(), Y = sY.get(), pa = sPa.get();
      const o = Econ.optimal(type, p, pa, pb, Y);
      const aMax = Math.max(Econ.optimal(type, p, 1, pb, Y).a, Y / 1) ; // generous
      // left: bundle space (fixed to income-based range so the line visibly pivots)
      const bx = Y / 1 * 0.5 + 2, by = Y / pb * 1.15;
      P1.setRange(Math.ceil(Math.max(bx, Y / pa * 1.1)), Math.ceil(by));
      P1.area([[0, 0], [Y / pa, 0], [0, Y / pb]]);
      P1.line(0, Y / pb, Y / pa, 0, { cls: 'sink', w: 2.6 });
      if (o.u > 1e-9) P1.path(Econ.ic(type, p, o.u, P1.o.xmax, P1.o.ymax), { cls: 's1', w: 3 });
      if (o.tie) P1.line(0, Y / pb, Y / pa, 0, { cls: 's3', w: 6, op: .7 }); else { P1.dot(o.a, o.b, { cls: 'f3', r: 7 }); }
      // right: demand curve
      const segs = demandCurve(type, p, pb, Y, 0.3, 10);
      const d1 = Econ.optimal(type, p, 1, pb, Y).a;
      const xm = Math.ceil(Math.min(d1 * 1.15, Y * 1.3));
      P2.setRange(Math.max(xm, 4), 10);
      segs.forEach(sg => P2.path(sg, { cls: 's1', w: 3 }));
      P2.line(0, pa, Math.max(o.a, 0), pa, { cls: 'smuted', dash: '4 4', w: 1.5 });
      if (!o.tie) { P2.dot(o.a, pa, { cls: 'f3', r: 7 }); P2.text(o.a, pa, `(${n(o.a)}, $${n(pa)})`, { dx: 10, dy: -10, cls: 'c3' }); }
      let html = `<p>\\(${Econ.tex(type, p)}\\)</p>`;
      html += o.tie ? `<p>At \\(p_a=${n(pa)}\\) she is <b>indifferent</b> between buying only \\(a\\), only \\(b\\), or any mix on the budget line: the demand curve has a flat piece here.</p>`
        : `<p>At \\(p_a=${n(pa)}\\): \\(a^*=${n(o.a)}\\), \\(b^*=${n(o.b)}\\).</p>`;
      if (type === 'cd') html += `<p>Demand: \\(D_a(p_a)=\\dfrac{\\alpha}{\\alpha+\\beta}\\cdot\\dfrac{Y}{p_a}=\\dfrac{${n(p.al / (p.al + p.be) * Y)}}{p_a}\\). It does not depend on \\(p_b\\).</p>`;
      if (type === 'pc') html += `<p>Demand: \\(D_a(p_a)=\\dfrac{\\beta Y}{\\beta p_a+\\alpha p_b}=\\dfrac{${n(p.be * Y)}}{${p.be}p_a+${n(p.al * pb)}}\\).</p>`;
      if (type === 'ps') html += `<p>Demand jumps at \\(p_a=\\dfrac{\\alpha}{\\beta}p_b=${n(p.al * pb / p.be)}\\): above it she buys none of \\(a\\); below it she spends all income on \\(a\\), \\(Y/p_a\\).</p>`;
      out.set(html);
    }
    draw();
  })();

  // ================= Widget 2: market demand =================
  (function () {
    const host = document.getElementById('w-market');
    if (!host) return;
    const ctl = host.querySelector('.ctl');
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 40, ymax: 12, xlabel: 'quantity of a', ylabel: 'price p_a' });
    const presets = {
      cd1: { t: 'cd', p: { al: 1, be: 1 }, name: 'Cobb-Douglas, half of income on a' },
      cd2: { t: 'cd', p: { al: 1, be: 2 }, name: 'Cobb-Douglas, a third on a' },
      pc1: { t: 'pc', p: { al: 1, be: 1 }, name: 'Perfect complements, a = b' },
      pc2: { t: 'pc', p: { al: 1, be: 2 }, name: 'Perfect complements, a = 2b' },
      ps: { t: 'ps', p: { al: 2, be: 1 }, name: 'Perfect substitutes, 2a + b' }
    };
    const opts = Object.entries(presets).map(([k, v]) => [k, v.name]);
    const C = [{ k: 'cd1' }, { k: 'ps' }];
    const sels = [], inc = [];
    C.forEach((c, i) => {
      const s = UI.select(ctl, { label: `Consumer ${i + 1}`, value: c.k, options: opts, onChange: v => { c.k = v; draw(); } });
      sels.push(s);
      inc.push(UI.slider(ctl, { label: `Consumer ${i + 1} income`, min: 10, max: 60, step: 1, value: i ? 30 : 40, fmt: v => '$' + n(v), onInput: draw }));
    });
    const sPb = UI.slider(ctl, { label: 'Price \\(p_b\\)', min: 1, max: 6, step: 0.5, value: 2, fmt: v => '$' + n(v), onInput: draw });
    const sPa = UI.slider(ctl, { label: 'Read off at \\(p_a\\)', min: 0.5, max: 12, step: 0.25, value: 3, fmt: v => '$' + n(v), onInput: draw });
    const out = UI.readout(ctl);
    const colors = ['s1', 's2'], fc = ['f1', 'f2'], tc = ['c1', 'c2'];

    function dem(i, pa) { const c = presets[C[i].k]; return Econ.optimal(c.t, c.p, pa, sPb.get(), inc[i].get()); }
    function draw() {
      P.clear();
      const pb = sPb.get(), grid = [];
      for (let q = 0.3; q <= 12.0001; q += 0.05) grid.push(q);
      const curves = C.map((c, i) => grid.map(q => [dem(i, q).a, q]));
      const sum = grid.map((q, j) => [curves[0][j][0] + curves[1][j][0], q]);
      const xm = Math.ceil(Math.max(5, sum.find(pt => pt[1] >= 1)[0] * 1.1) / 5) * 5;
      P.setRange(xm, 12);
      curves.forEach((cv, i) => P.path(cv, { cls: colors[i], w: 2.2, dash: '7 5', op: .9 }));
      P.path(sum, { cls: 'sink', w: 3.6 });
      const pa = sPa.get();
      const q1 = dem(0, pa), q2 = dem(1, pa);
      const tot = q1.a + q2.a;
      P.line(0, pa, tot, pa, { cls: 'smuted', dash: '4 4', w: 1.4 });
      P.dot(q1.a, pa, { cls: fc[0], r: 5 }); P.dot(q2.a, pa, { cls: fc[1], r: 5 }); P.dot(tot, pa, { cls: 'fink', r: 6.5 });
      out.set(`<p>At \\(p_a=${n(pa)}\\):</p><p>Consumer 1 buys <b>${n(q1.a)}</b>${q1.tie ? ' (or any amount in a tie range)' : ''}, consumer 2 buys <b>${n(q2.a)}</b>${q2.tie ? ' (or any amount in a tie range)' : ''}.</p>` +
        `<p>Market demand \\(= ${n(q1.a)}+${n(q2.a)}=\\mathbf{${n(tot)}}\\)</p>` +
        '<p class="hint">Add <em>quantities</em> at the same price (horizontal sum). Kinks appear in the market curve when a consumer stops buying.</p>');
    }
    draw();
  })();
});
