document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('w-opt');
  if (!host) return;
  const n = v => fmt(v, 2);
  const P = new Plot(host.querySelector('.plot-host'), { xmax: 20, ymax: 10 });
  const ctl = host.querySelector('.ctl');
  let type = 'cd', challenge = false, tried = null, best = null;

  UI.select(ctl, {
    label: 'Preferences', value: 'cd', onChange: v => { type = v; resetChallenge(); draw(); },
    options: [['cd', 'Cobb-Douglas  a^α b^β'], ['pc', 'Perfect complements  min{αa, βb}'], ['ps', 'Perfect substitutes  αa + βb']]
  });
  const sAl = UI.slider(ctl, { label: '\\(\\alpha\\)', min: 1, max: 5, step: 1, value: 1, onInput: () => { resetChallenge(); draw(); } });
  const sBe = UI.slider(ctl, { label: '\\(\\beta\\)', min: 1, max: 5, step: 1, value: 1, onInput: () => { resetChallenge(); draw(); } });
  const sPa = UI.slider(ctl, { label: 'Price \\(p_a\\)', min: 1, max: 10, step: 0.5, value: 2, fmt: v => '$' + n(v), onInput: () => { resetChallenge(); draw(); } });
  const sPb = UI.slider(ctl, { label: 'Price \\(p_b\\)', min: 1, max: 10, step: 0.5, value: 4, fmt: v => '$' + n(v), onInput: () => { resetChallenge(); draw(); } });
  const sY = UI.slider(ctl, { label: 'Income \\(Y\\)', min: 10, max: 60, step: 1, value: 40, fmt: v => '$' + n(v), onInput: () => { resetChallenge(); draw(); } });
  const row = document.createElement('div'); row.className = 'row'; ctl.append(row);
  const chBtn = UI.button(row, 'Challenge mode: find the optimum yourself', () => { challenge = !challenge; resetChallenge(); chBtn.textContent = challenge ? 'Show the answer' : 'Challenge mode: find the optimum yourself'; draw(); }, 'ghost');
  const out = UI.readout(ctl);

  function resetChallenge() { tried = null; best = null; }
  const prm = () => ({ al: sAl.get(), be: sBe.get() });

  function draw() {
    P.clear();
    const p = prm(), pa = sPa.get(), pb = sPb.get(), Y = sY.get();
    const ia = Y / pa, ib = Y / pb;
    P.setRange(Math.ceil(ia * 1.2), Math.ceil(ib * 1.2));
    const xm = P.o.xmax, ym = P.o.ymax;
    const o = Econ.optimal(type, p, pa, pb, Y);
    P.area([[0, 0], [ia, 0], [0, ib]]);
    P.line(0, ib, ia, 0, { cls: 'sink', w: 2.5 });

    const showAns = !challenge;
    let html = `<p>\\(${Econ.tex(type, p)}\\)</p>`;
    if (showAns) {
      if (o.u > 1e-9) {
        P.path(Econ.ic(type, p, o.u * 0.55, xm, ym), { cls: 's1', w: 2, op: 0.45 });
        P.path(Econ.ic(type, p, o.u * 1.5, xm, ym), { cls: 's2', w: 2, op: 0.55, dash: '6 5' });
        P.path(Econ.ic(type, p, o.u, xm, ym), { cls: 's1', w: 3.4 });
      }
      if (o.tie) P.line(0, ib, ia, 0, { cls: 's3', w: 6, op: 0.7 });
      else { P.dot(o.a, o.b, { cls: 'f3', r: 7 }); P.text(o.a, o.b, `(${n(o.a)}, ${n(o.b)})`, { dx: 12, dy: -12, cls: 'c3' }); }

      if (o.tie) html += `<p><b>Tie:</b> every bundle on the budget line is optimal, because \\(\\alpha/p_a=\\beta/p_b\\).</p>`;
      else html += `<p>Optimal bundle: \\((a^*,b^*)=(${n(o.a)},\\,${n(o.b)})\\)<br>Utility: \\(${n(o.u)}\\)</p>`;
      const ratio = pa / pb;
      if (type === 'cd') {
        const m = Econ.mrs(type, p, o.a, o.b);
        html += `<p>Share of income spent on \\(a\\): \\(\\frac{\\alpha}{\\alpha+\\beta}=${n(p.al / (p.al + p.be))}\\)</p><p>\\(|MRS_{ab}|=${n(m)}\\) and \\(p_a/p_b=${n(ratio)}\\): <b>equal</b> (tangency).</p>`;
      } else if (type === 'pc') {
        html += `<p>Optimum is at the kink, \\(${p.al}a=${p.be}b\\). The MRS is undefined there, so we use the kink condition plus the budget line.</p>`;
      } else {
        const m = p.al / p.be;
        html += `<p>\\(|MRS_{ab}|=${n(m)}\\) everywhere vs. \\(p_a/p_b=${n(ratio)}\\): ` +
          (Math.abs(m - ratio) < 1e-9 ? 'equal, so any bundle on the line is optimal.' : m > ratio ? '<b>she values \\(a\\) more than the market does</b>, so she buys only \\(a\\).' : '<b>she values \\(a\\) less than the market does</b>, so she buys only \\(b\\).') + '</p>';
      }
    } else {
      // challenge mode
      if (tried) {
        const u = Econ.util(type, p, tried[0], tried[1]);
        if (best == null || u > best) best = u;
        if (u > 1e-9) P.path(Econ.ic(type, p, u, xm, ym), { cls: 's1', w: 2.5, op: 0.8 });
        P.dot(tried[0], tried[1], { cls: 'f2' });
        html += `<p>You chose \\((${n(tried[0])},\\,${n(tried[1])})\\), utility <b>${n(u)}</b>.</p>`;
      }
      html += `<p>Best utility so far: <b>${best == null ? '—' : n(best)}</b></p>` +
        `<p class="hint">Tap along the budget line. Look at the indifference curve through your bundle: can you find a point where a higher curve still touches the budget set?</p>`;
    }
    out.set(html);
  }

  P.onPoint((x, y) => {
    if (!challenge) return;
    const pa = sPa.get(), pb = sPb.get(), Y = sY.get();
    const a = Math.min(Math.max(x, 0), Y / pa);
    tried = [a, (Y - pa * a) / pb];
    draw();
  });
  draw();
});
