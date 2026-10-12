document.addEventListener('DOMContentLoaded', () => {
  const n = v => fmt(v, 3);

  // ================= IC explorer =================
  (function () {
    const host = document.getElementById('w-ic');
    if (!host) return;
    const ctl = host.querySelector('.ctl');
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 10, ymax: 10 });
    let type = 'cd', pt = [4, 3];
    UI.select(ctl, {
      label: 'Utility function', value: 'cd', onChange: v => { type = v; draw(); },
      options: [['cd', 'Cobb-Douglas  a^α b^β'], ['ps', 'Perfect substitutes  αa + βb'], ['pc', 'Perfect complements  min{αa, βb}'], ['sq', 'Concave root  √a + √b']]
    });
    const sA = UI.slider(ctl, { label: 'Parameter \\(\\alpha\\)', min: 1, max: 5, step: 1, value: 1, onInput: draw });
    const sB = UI.slider(ctl, { label: 'Parameter \\(\\beta\\)', min: 1, max: 5, step: 1, value: 1, onInput: draw });
    const out = UI.readout(ctl);
    function draw() {
      P.clear();
      const p = { al: sA.get(), be: sB.get() };
      const u0 = Econ.util(type, p, pt[0], pt[1]);
      if (u0 > 1e-9) {
        [[0.45, 0.4], [1.9, 0.4]].forEach(([k, op]) => P.path(Econ.ic(type, p, u0 * k, 10, 10), { cls: 's1', w: 2, op }));
        P.path(Econ.ic(type, p, u0, 10, 10), { cls: 's1', w: 3.4 });
      }
      const mrs = Econ.mrs(type, p, pt[0], pt[1]);
      if (mrs != null && isFinite(mrs)) {
        const dx = 4;
        P.line(pt[0] - dx, pt[1] + mrs * dx, pt[0] + dx, pt[1] - mrs * dx, { cls: 's2', w: 2, dash: '6 5' });
      }
      P.dot(pt[0], pt[1], { cls: 'f2' });
      P.text(pt[0], pt[1], `(${fmt(pt[0], 2)}, ${fmt(pt[1], 2)})`, { dx: 10, dy: -10, cls: 'c2' });
      const m = Econ.mu(type, p, pt[0], pt[1]);
      let html = `<p>\\(${Econ.tex(type, p)}\\)</p><p>Utility at the bundle: <b>${n(u0)}</b></p>`;
      if (m) {
        html += `<p>\\(MU_a=${n(m[0])}\\), \\(MU_b=${n(m[1])}\\)</p>`;
        html += m[1] === 0 ? '<p>\\(MRS_{ab}=-\\infty\\): vertical segment of the L-shaped curve.</p>'
          : `<p>\\(MRS_{ab}=-MU_a/MU_b=${n(-mrs)}\\)<br>She would give up <b>${n(mrs)}</b> units of \\(b\\) for one more unit of \\(a\\).</p>`;
      } else {
        html += '<p>MRS is <b>undefined</b> here (the indifference curve has a kink or is on an axis).</p>';
      }
      out.set(html + '<p class="hint">Tap the graph to move the bundle. The dashed orange line is the tangent: its slope is the MRS.</p>');
    }
    P.onPoint((x, y) => { pt = [Math.max(0.25, Math.round(x * 4) / 4), Math.max(0.25, Math.round(y * 4) / 4)]; draw(); });
    draw();
  })();

  // ================= ordinal transformations =================
  (function () {
    const host = document.getElementById('w-ordinal');
    if (!host) return;
    const ctl = host.querySelector('.ctl'), res = host.querySelector('.res');
    const sa1 = UI.slider(ctl, { label: 'Bundle A: a', min: 0.5, max: 10, step: 0.5, value: 2, onInput: run });
    const sb1 = UI.slider(ctl, { label: 'Bundle A: b', min: 0.5, max: 10, step: 0.5, value: 6, onInput: run });
    const sa2 = UI.slider(ctl, { label: 'Bundle B: a', min: 0.5, max: 10, step: 0.5, value: 4, onInput: run });
    const sb2 = UI.slider(ctl, { label: 'Bundle B: b', min: 0.5, max: 10, step: 0.5, value: 4, onInput: run });
    const fs = [
      ['\\(u\\)', 'u', u => u, true],
      ['\\(3u+10\\)', '', u => 3 * u + 10, true],
      ['\\(u^2\\)', '', u => u * u, true],
      ['\\(\\ln u\\)', '', u => Math.log(u), true],
      ['\\(\\sqrt u\\)', '', u => Math.sqrt(u), true],
      ['\\(-u\\)', '', u => -u, false],
      ['\\(1/u\\)', '', u => 1 / u, false]
    ];
    function run() {
      const uA = sa1.get() * sb1.get(), uB = sa2.get() * sb2.get();
      const rel = (x, y) => Math.abs(x - y) < 1e-9 ? '∼' : x > y ? '≻' : '≺';
      const base = rel(uA, uB);
      let html = `<p>Start from \\(u(a,b)=ab\\): \\(u(A)=${n(uA)}\\), \\(u(B)=${n(uB)}\\).</p><table style="border-collapse:collapse;width:100%;font-size:.9rem"><tr style="text-align:left;color:var(--muted)"><th>Function</th><th>f(u(A))</th><th>f(u(B))</th><th>Ranking</th></tr>`;
      fs.forEach(([tex, , f, mono]) => {
        const fa = f(uA), fb = f(uB), r = rel(fa, fb), same = r === base;
        html += `<tr style="border-top:1px solid var(--line)"><td>${tex}</td><td>${n(fa)}</td><td>${n(fb)}</td><td style="color:var(${same ? '--good' : '--bad'})"><b>A ${r} B</b> ${same ? '✓' : '✗ reversed'}</td></tr>`;
      });
      html += '</table><p class="hint">Increasing functions of \\(u\\) never change the ranking. Decreasing ones (\\(-u\\), \\(1/u\\)) flip it, so they are <em>different</em> preferences.</p>';
      res.innerHTML = html; typeset(res);
    }
    run();
  })();

  // ================= Handout 2 Q1 solution plot =================
  const det = document.getElementById('sol-q1');
  if (det) {
    let done = false;
    det.addEventListener('toggle', () => {
      if (!det.open || done) return;
      done = true;
      const P = new Plot(document.getElementById('plot-q1'), { xmax: 5, ymax: 5 });
      P.path(Econ.ic('sq', {}, 1, 5, 5), { cls: 's1', w: 3 });
      P.path(Econ.ic('sq', {}, 2, 5, 5), { cls: 's2', w: 3 });
      P.text(1, 0, '1', { dx: -3, dy: -8, cls: 'c1' });
      P.text(4, 0, '4', { dx: -3, dy: -8, cls: 'c2' });
      P.text(0.6, 0.55, 'u = 1', { dx: 6, dy: 0, cls: 'c1' });
      P.text(2.2, 1.2, 'u = 2', { dx: 6, dy: 0, cls: 'c2' });
    });
  }
});
