document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('w-budget');
  if (!host) return;
  const P = new Plot(host.querySelector('.plot-host'), { xmax: 24, ymax: 18, xlabel: 'a', ylabel: 'b' });
  const ctl = host.querySelector('.ctl');
  const n = v => fmt(v, 2);
  let base = { pa: 2, pb: 4, Y: 20 };
  let test = null;

  const sPa = UI.slider(ctl, { label: 'Price of a, \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 2, fmt: v => '$' + n(v), onInput: draw });
  const sPb = UI.slider(ctl, { label: 'Price of b, \\(p_b\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n(v), onInput: draw });
  const sY = UI.slider(ctl, { label: 'Income, \\(Y\\)', min: 0, max: 60, step: 1, value: 20, fmt: v => '$' + n(v), onInput: draw });
  const row = document.createElement('div'); row.className = 'row'; ctl.append(row);
  UI.button(row, 'Double income', () => { sY.set(Math.min(60, sY.get() * 2)); draw(); });
  UI.button(row, 'Double both prices', () => { sPa.set(Math.min(10, sPa.get() * 2)); sPb.set(Math.min(10, sPb.get() * 2)); draw(); });
  UI.button(row, 'Double everything', () => { sY.set(Math.min(60, sY.get() * 2)); sPa.set(Math.min(10, sPa.get() * 2)); sPb.set(Math.min(10, sPb.get() * 2)); draw(); });
  const row2 = document.createElement('div'); row2.className = 'row'; ctl.append(row2);
  UI.button(row2, 'Pin current as baseline', () => { base = cur(); draw(); }, 'ghost');
  UI.button(row2, 'Reset', () => { sPa.set(2); sPb.set(4); sY.set(20); base = { pa: 2, pb: 4, Y: 20 }; test = null; draw(); });
  const out = UI.readout(ctl);

  function cur() { return { pa: sPa.get(), pb: sPb.get(), Y: sY.get() }; }

  function draw() {
    P.clear();
    const { pa, pb, Y } = cur();
    const ia = Y / pa, ib = Y / pb;
    if (base) P.line(0, base.Y / base.pb, base.Y / base.pa, 0, { cls: 'smuted', dash: '7 6', w: 2 });
    P.area([[0, 0], [ia, 0], [0, ib]]);
    P.line(0, ib, ia, 0, { cls: 's1', w: 3.2 });
    if (ia <= 24) { P.dot(ia, 0, { cls: 'f1', r: 5 }); P.text(ia, 0, '(' + n(ia) + ', 0)', { dy: -10, anchor: 'middle', cls: 'c1' }); }
    if (ib <= 18) { P.dot(0, ib, { cls: 'f1', r: 5 }); P.text(0, ib, '(0, ' + n(ib) + ')', { dx: 10, dy: -8, cls: 'c1' }); }
    let tinfo = '<p class="hint">Click or tap the graph to test whether a bundle is affordable.</p>';
    if (test) {
      const c = pa * test[0] + pb * test[1];
      const ok = c <= Y + 1e-9;
      P.dot(test[0], test[1], { cls: ok ? 'f3' : 'f2', r: 6 });
      P.text(test[0], test[1], ok ? 'affordable' : 'too expensive', { dx: 10, dy: -10, cls: ok ? 'c3' : 'c2' });
      tinfo = `<p>Bundle \\((${n(test[0])},\\,${n(test[1])})\\) costs \\(${n(pa)}(${n(test[0])})+${n(pb)}(${n(test[1])})=${n(c)}\\): ` +
        (ok ? (Math.abs(c - Y) < 0.01 ? '<b>exactly on</b> the budget line.' : `<b>affordable</b>, with $${n(Y - c)} unspent.`) : `<b>not affordable</b> (short by $${n(c - Y)}).`) + '</p>';
    }
    out.set(
      `<p>Budget set: \\(${n(pa)}a+${n(pb)}b\\le ${n(Y)}\\)</p>` +
      `<p>Intercepts: \\(a=Y/p_a=${n(ia)}\\), \\(b=Y/p_b=${n(ib)}\\)</p>` +
      `<p>Slope: \\(-p_a/p_b=${n(-pa / pb)}\\). One more unit of \\(a\\) costs \\(${n(pa / pb)}\\) units of \\(b\\).</p>` + tinfo);
  }

  P.onPoint((x, y) => { test = [Math.round(x * 2) / 2, Math.round(y * 2) / 2]; draw(); });
  draw();

  // exercise helper: load a scenario into the widget
  window.BudgetDemo = {
    load(pa, pb, Y, asBase) {
      sPa.set(pa); sPb.set(pb); sY.set(Y);
      if (asBase) base = { pa, pb, Y };
      test = null; draw();
      host.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
});
