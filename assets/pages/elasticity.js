document.addEventListener('DOMContentLoaded', () => {
  const n2 = v => fmt(v, 2);
  const sgn = v => (v > 0 ? '+' : '') + fmt(v, 2);

  const ownTxt = e => !isFinite(e) ? '—' : Math.abs(e + 1) < 0.015 ? 'unit elastic' : Math.abs(e) > 1 ? 'elastic' : e === 0 ? 'perfectly inelastic' : 'inelastic';
  const crossTxt = e => !isFinite(e) ? '—' : Math.abs(e) < 0.015 ? 'unrelated (zero cross effect)' : e > 0 ? 'substitutes' : 'complements';
  const incTxt = e => !isFinite(e) ? '—' : Math.abs(e) < 0.015 ? 'zero income elasticity' : e < 0 ? 'inferior good' : Math.abs(e - 1) < 0.015 ? 'normal, exactly proportional' : e < 1 ? 'normal, necessity' : 'normal, luxury';

  // ================= Widget 1: constant-elasticity demand =================
  (function () {
    const host = document.getElementById('w-const');
    if (!host) return;
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 60, ymax: 10, xlabel: 'quantity of a', ylabel: 'price p_a' });
    const ctl = host.querySelector('.ctl');
    const e1 = UI.slider(ctl, { label: 'Own-price elasticity \\(\\varepsilon\\)', min: -3, max: -0.1, step: 0.1, value: -1.5, fmt: v => n2(v), onInput: draw });
    const e2 = UI.slider(ctl, { label: 'Cross-price elasticity \\(\\varepsilon_{ab}\\)', min: -2, max: 2, step: 0.1, value: 0, fmt: v => sgn(v), onInput: draw });
    const e3 = UI.slider(ctl, { label: 'Income elasticity \\(\\eta\\)', min: -1, max: 2.5, step: 0.1, value: 1, fmt: v => sgn(v), onInput: draw });
    const pa = UI.slider(ctl, { label: 'Price \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n2(v), onInput: draw });
    const pb = UI.slider(ctl, { label: 'Price \\(p_b\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n2(v), onInput: draw });
    const Y = UI.slider(ctl, { label: 'Income \\(Y\\)', min: 10, max: 100, step: 5, value: 40, fmt: v => '$' + n2(v), onInput: draw });
    const out = UI.readout(ctl);
    const D = (p, q, y) => 20 * Math.pow(p / 4, e1.get()) * Math.pow(q / 4, e2.get()) * Math.pow(y / 40, e3.get());

    function draw() {
      P.clear();
      const cur = D(pa.get(), pb.get(), Y.get());
      const base = []; const now = [];
      for (let p = 0.5; p <= 10.01; p += 0.1) { base.push([D(p, 4, 40), p]); now.push([D(p, pb.get(), Y.get()), p]); }
      P.path(base, { cls: 'smuted', dash: '6 5', w: 2, op: 0.7 });
      P.path(now, { cls: 's1', w: 3 });
      P.dot(cur, pa.get(), { cls: 'f2' });
      P.text(cur, pa.get(), `Q = ${n2(cur)}`, { dx: 10, dy: -10, cls: 'c2' });
      const e = e1.get(), c = e2.get(), h = e3.get();
      const chg = (x, k) => (Math.pow(1.1, x) - 1) * 100;
      out.set(
        `<p>Own-price: <b>${ownTxt(e)}</b>. Cross-price: <b>${crossTxt(c)}</b>. Income: <b>${incTxt(h)}</b>.</p>` +
        `<p>If something rises by 10%, quantity of \\(a\\) changes by about:</p>` +
        `<p>\\(p_a\\) up 10%: <b>${sgn(chg(e))}%</b>   \\(p_b\\) up 10%: <b>${sgn(chg(c))}%</b>   \\(Y\\) up 10%: <b>${sgn(chg(h))}%</b></p>` +
        `<p class="hint">Dashed grey: the demand curve at \\(p_b=4\\), \\(Y=40\\). Change \\(p_b\\) or \\(Y\\) and watch the curve shift.</p>`);
    }
    draw();
  })();

  // ================= Widget 2: linear demand & revenue =================
  (function () {
    const host = document.getElementById('w-linear');
    if (!host) return;
    const P1 = new Plot(host.querySelector('.ph1'), { xmax: 40, ymax: 20, xlabel: 'quantity Q', ylabel: 'price P' });
    const P2 = new Plot(host.querySelector('.ph2'), { xmax: 20, ymax: 200, xlabel: 'price P', ylabel: 'spending P·Q' });
    const ctl = host.querySelector('.ctl');
    const sA = UI.slider(ctl, { label: 'Intercept \\(a\\) in \\(Q=a-bP\\)', min: 20, max: 100, step: 5, value: 40, onInput: upd });
    const sB = UI.slider(ctl, { label: 'Slope \\(b\\)', min: 1, max: 5, step: 0.5, value: 2, onInput: upd });
    const sP = UI.slider(ctl, { label: 'Price \\(P\\)', min: 0.5, max: 20, step: 0.5, value: 5, fmt: v => '$' + n2(v), onInput: draw });
    const out = UI.readout(ctl);
    function upd() {
      const a = sA.get(), b = sB.get(), pmax = a / b;
      sP.setRange(0.5, Math.floor(pmax * 2 - 0.0001) / 2);
      if (sP.get() > pmax) sP.set(Math.floor(pmax * 2 - 0.0001) / 2);
      draw();
    }
    function draw() {
      const a = sA.get(), b = sB.get(), p = sP.get(), pmax = a / b, q = a - b * p, pstar = a / (2 * b);
      P1.setRange(Math.ceil(a * 1.05), Math.ceil(pmax * 1.05));
      P2.setRange(Math.ceil(pmax * 1.05), Math.ceil(a * a / (4 * b) * 1.2));
      P1.line(0, pmax, a, 0, { cls: 's1', w: 3 });
      P1.line(0, pstar, a / 2, pstar, { cls: 'smuted', dash: '5 5', w: 1.6 });
      P1.text(0, pstar, 'ε = −1', { dx: 8, dy: -6 });
      P1.dot(q, p, { cls: 'f2' });
      const rev = [];
      for (let x = 0; x <= pmax + 1e-9; x += pmax / 120) rev.push([x, x * (a - b * x)]);
      P2.path(rev, { cls: 's1', w: 3 });
      P2.line(pstar, 0, pstar, a * a / (4 * b), { cls: 'smuted', dash: '5 5', w: 1.6 });
      P2.dot(p, p * q, { cls: 'f2' });
      const e = -b * p / q;
      out.set(
        `<p>\\(Q=${n2(q)}\\), spending \\(PQ=${n2(p * q)}\\)</p>` +
        `<p>\\(\\varepsilon=-b\\dfrac{P}{Q}=${n2(e)}\\): demand is <b>${ownTxt(e)}</b> at this price.</p>` +
        `<p>Spending is maximized at \\(P=a/2b=${n2(pstar)}\\), exactly where \\(|\\varepsilon|=1\\). ` +
        (p < pstar - 1e-9 ? 'Below it demand is <b>inelastic</b>: raising the price raises spending.' : p > pstar + 1e-9 ? 'Above it demand is <b>elastic</b>: raising the price lowers spending.' : 'Right here a small price change leaves spending unchanged.') + '</p>');
    }
    upd();
  })();

  // ================= Widget 3: elasticities from a utility function =================
  (function () {
    const host = document.getElementById('w-util');
    if (!host) return;
    const ctl = host.querySelector('.ctl'), res = host.querySelector('.res');
    let type = 'cd';
    UI.select(ctl, {
      label: 'Preferences', value: 'cd', onChange: v => { type = v; draw(); },
      options: [['cd', 'Cobb-Douglas  a^α b^β'], ['pc', 'Perfect complements  min{αa, βb}'], ['ql', 'Quasilinear  √a + b']]
    });
    const sAl = UI.slider(ctl, { label: '\\(\\alpha\\)', min: 1, max: 4, step: 1, value: 1, onInput: draw });
    const sBe = UI.slider(ctl, { label: '\\(\\beta\\)', min: 1, max: 4, step: 1, value: 1, onInput: draw });
    const sPa = UI.slider(ctl, { label: 'Price \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 2, fmt: v => '$' + n2(v), onInput: draw });
    const sPb = UI.slider(ctl, { label: 'Price \\(p_b\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n2(v), onInput: draw });
    const sY = UI.slider(ctl, { label: 'Income \\(Y\\)', min: 10, max: 100, step: 5, value: 40, fmt: v => '$' + n2(v), onInput: draw });

    // log-derivative (elasticity) by central difference
    function el(f, x) {
      const h = 1e-4, hi = f(x * (1 + h)), lo = f(x * (1 - h));
      if (!(hi > 0) || !(lo > 0)) return NaN;
      return (Math.log(hi) - Math.log(lo)) / (Math.log(1 + h) - Math.log(1 - h));
    }
    function draw() {
      const p = { al: sAl.get(), be: sBe.get() }, pa = sPa.get(), pb = sPb.get(), Y = sY.get();
      const D = (a, b, y) => Econ.optimal(type, p, a, b, y).a;
      const own = el(x => D(x, pb, Y), pa), cross = el(x => D(pa, x, Y), pb), inc = el(x => D(pa, pb, x), Y);
      const o = Econ.optimal(type, p, pa, pb, Y);
      let note = '';
      if (type === 'ql') note = o.kind === 'corner'
        ? '<p class="hint">Income is too low for the interior solution, so she spends everything on \\(a\\): demand is \\(Y/p_a\\) and elasticities look like Cobb-Douglas.</p>'
        : '<p class="hint">With quasilinear utility, extra income is spent entirely on \\(b\\), so demand for \\(a\\) ignores income: \\(\\eta=0\\).</p>';
      res.innerHTML = `<p>\\(${Econ.tex(type, p)}\\)</p><p>Demand for \\(a\\): \\(a^*=${n2(o.a)}\\)</p>
        <table style="width:100%;border-collapse:collapse;font-size:.95rem">
        <tr style="text-align:left;color:var(--muted)"><th>Elasticity of \\(a\\) with respect to…</th><th>Value</th><th>Meaning</th></tr>
        <tr style="border-top:1px solid var(--line)"><td>own price \\(p_a\\)</td><td><b>${n2(own)}</b></td><td>${ownTxt(own)}</td></tr>
        <tr style="border-top:1px solid var(--line)"><td>price of \\(b\\)</td><td><b>${n2(cross)}</b></td><td>${crossTxt(cross)}</td></tr>
        <tr style="border-top:1px solid var(--line)"><td>income \\(Y\\)</td><td><b>${n2(inc)}</b></td><td>${incTxt(inc)}</td></tr></table>` + note;
      typeset(res);
    }
    draw();
  })();
});
