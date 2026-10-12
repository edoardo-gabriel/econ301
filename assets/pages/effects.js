document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('w-eff');
  if (!host) return;
  const n = v => fmt(v, 2);
  const sg = v => (v > 0.005 ? '+' : '') + fmt(Math.abs(v) < 0.005 ? 0 : v, 2);
  const P = new Plot(host.querySelector('.plot-host'), { xmax: 20, ymax: 20, xlabel: 'a', ylabel: 'b' });
  const ctl = host.querySelector('.ctl');
  let type = 'cd';

  UI.select(ctl, {
    label: 'Preferences', value: 'cd', onChange: v => { type = v; draw(); },
    options: [['cd', 'Cobb-Douglas  a^α b^β'], ['pc', 'Perfect complements  min{αa, βb}'], ['ps', 'Perfect substitutes  αa + βb'], ['ql', 'Quasilinear  √a + b']]
  });
  const sAl = UI.slider(ctl, { label: '\\(\\alpha\\)', min: 1, max: 4, step: 1, value: 1, onInput: draw });
  const sBe = UI.slider(ctl, { label: '\\(\\beta\\)', min: 1, max: 4, step: 1, value: 1, onInput: draw });
  const sP0 = UI.slider(ctl, { label: 'Old price \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n(v), onInput: draw });
  const sP1 = UI.slider(ctl, { label: 'New price \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 2, fmt: v => '$' + n(v), onInput: draw });
  const sPb = UI.slider(ctl, { label: 'Price \\(p_b\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n(v), onInput: draw });
  const sY = UI.slider(ctl, { label: 'Income \\(Y\\)', min: 10, max: 80, step: 5, value: 40, fmt: v => '$' + n(v), onInput: draw });
  const out = UI.readout(ctl);

  function draw() {
    P.clear();
    const p = { al: sAl.get(), be: sBe.get() }, pa0 = sP0.get(), pa1 = sP1.get(), pb = sPb.get(), Y = sY.get();
    const A = Econ.optimal(type, p, pa0, pb, Y), C = Econ.optimal(type, p, pa1, pb, Y);
    const B = Econ.compensated(type, p, pa1, pb, A.u);
    const mB = pa1 * B.a + pb * B.b;       // spending needed at new prices to reach B
    const xm = Math.ceil(Math.max(Y / pa0, Y / pa1, A.a, B.a, C.a) * 1.12), ym = Math.ceil(Math.max(Y / pb, mB / pb, A.b, B.b, C.b) * 1.12);
    P.setRange(xm, ym);
    P.line(0, Y / pb, Y / pa0, 0, { cls: 'smuted', dash: '7 6', w: 2, op: .8 });
    P.line(0, Y / pb, Y / pa1, 0, { cls: 'sink', w: 2.5 });
    P.line(0, mB / pb, mB / pa1, 0, { cls: 's2', dash: '6 5', w: 2.2 });
    if (A.u > 1e-9) P.path(Econ.ic(type, p, A.u, xm, ym), { cls: 's1', w: 2.6 });
    if (C.u > 1e-9) P.path(Econ.ic(type, p, C.u, xm, ym), { cls: 's3', w: 2.6 });
    P.dot(A.a, A.b, { cls: 'f1' }); P.text(A.a, A.b, 'A', { dx: 9, dy: -9, cls: 'c1' });
    P.dot(B.a, B.b, { cls: 'f2' }); P.text(B.a, B.b, 'B', { dx: 9, dy: -9, cls: 'c2' });
    P.dot(C.a, C.b, { cls: 'f3' }); P.text(C.a, C.b, 'C', { dx: 9, dy: -9, cls: 'c3' });

    const se = B.a - A.a, ie = C.a - B.a, tot = C.a - A.a;
    const fall = pa1 < pa0, same = Math.abs(pa1 - pa0) < 1e-9;
    let verdict = '';
    if (same) verdict = 'Move the new price away from the old price to see the effects.';
    else if (Math.abs(ie) < 0.005) verdict = 'No income effect on \\(a\\) here.';
    else {
      const normal = fall ? ie > 0 : ie < 0;
      verdict = `Income effect pushes ${ie > 0 ? 'up' : 'down'}: behaves like a <b>${normal ? 'normal' : 'inferior'}</b> good at these numbers` +
        (!normal && Math.abs(ie) > Math.abs(se) ? ' <b>(and the IE outweighs the SE: Giffen!)</b>' : '') + '.';
    }
    out.set(
      `<p>\\(${Econ.tex(type, p)}\\)</p>` +
      `<table style="width:100%;border-collapse:collapse;font-size:.93rem">
        <tr style="text-align:left;color:var(--muted)"><th></th><th>good \\(a\\)</th><th>good \\(b\\)</th></tr>
        <tr style="border-top:1px solid var(--line)"><td>A (start)</td><td>${n(A.a)}</td><td>${n(A.b)}</td></tr>
        <tr style="border-top:1px solid var(--line)"><td>B (compensated)</td><td>${n(B.a)}</td><td>${n(B.b)}</td></tr>
        <tr style="border-top:1px solid var(--line)"><td>C (end)</td><td>${n(C.a)}</td><td>${n(C.b)}</td></tr></table>` +
      `<p><b>Substitution effect</b> (A→B): ${sg(se)}<br><b>Income effect</b> (B→C): ${sg(ie)}<br><b>Total</b> (A→C): ${sg(tot)}</p><p>${verdict}</p>` +
      (A.tie || C.tie ? '<p class="hint">Perfect substitutes with equal value ratios: an indifferent tie, so the picture shows one of many optima.</p>' : ''));
  }
  draw();
});
