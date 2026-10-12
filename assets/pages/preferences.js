document.addEventListener('DOMContentLoaded', () => {
  const n = v => fmt(v, 2);

  // ================= Widget 1: rationality checker =================
  (function () {
    const host = document.getElementById('w-rational');
    if (!host) return;
    const ctl = host.querySelector('.ctl'), res = host.querySelector('.res');
    const names = ['X', 'Y', 'Z'];
    const pairs = [[0, 1], [1, 2], [0, 2]];
    const state = ['>', '>', '<']; // default: X>Y, Y>Z, Z>X (a cycle)
    const opts = [['>', '{L} ≻ {R}  (strictly prefers {L})'], ['<', '{R} ≻ {L}  (strictly prefers {R})'], ['~', '{L} ∼ {R}  (indifferent)'], ['?', 'cannot compare']];
    pairs.forEach(([i, j], k) => {
      const lab = document.createElement('label');
      lab.style.gridTemplateColumns = '1fr';
      lab.innerHTML = `<span>${names[i]} versus ${names[j]}</span>`;
      const sel = document.createElement('select');
      opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t.replace(/\{L\}/g, names[i]).replace(/\{R\}/g, names[j]); sel.append(o); });
      sel.value = state[k];
      sel.addEventListener('change', () => { state[k] = sel.value; run(); });
      lab.append(sel); ctl.append(lab);
    });
    function run() {
      // weak preference matrix W[i][j] = "i is at least as good as j"
      const W = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      let complete = true;
      pairs.forEach(([i, j], k) => {
        const s = state[k];
        if (s === '>') W[i][j] = 1;
        else if (s === '<') W[j][i] = 1;
        else if (s === '~') { W[i][j] = 1; W[j][i] = 1; }
        else complete = false;
      });
      let violation = null;
      for (let i = 0; i < 3 && !violation; i++) for (let j = 0; j < 3 && !violation; j++) for (let k = 0; k < 3; k++) {
        if (i !== j && j !== k && i !== k && W[i][j] && W[j][k] && !W[i][k]) { violation = [i, j, k]; break; }
      }
      let html = '';
      html += complete ? '<p>✓ <b>Complete</b>: every pair can be compared.</p>' : '<p>✗ <b>Not complete</b>: at least one pair can\'t be compared.</p>';
      html += violation
        ? `<p>✗ <b>Not transitive</b>: ${names[violation[0]]} ≽ ${names[violation[1]]} and ${names[violation[1]]} ≽ ${names[violation[2]]}, but it is not true that ${names[violation[0]]} ≽ ${names[violation[2]]}.</p>`
        : '<p>✓ <b>Transitive</b> on these three bundles.</p>';
      html += `<p><b>${complete && !violation ? 'These preferences are rational.' : 'These preferences are NOT rational.'}</b></p>`;
      res.innerHTML = html;
    }
    run();
  })();

  // ================= Widget 2: convexity =================
  (function () {
    const host = document.getElementById('w-convex');
    if (!host) return;
    const ctl = host.querySelector('.ctl');
    const cfg = {
      cd: { p: { al: 1, be: 1 }, level: 16, max: 20, amin: 1, amax: 16, tex: 'u=ab', a1: 2, a2: 8 },
      sq: { p: { al: 1, be: 1 }, level: 4, max: 18, amin: 0, amax: 16, tex: 'u=\\sqrt a+\\sqrt b', a1: 1, a2: 9 },
      ps: { p: { al: 1, be: 1 }, level: 10, max: 12, amin: 0, amax: 10, tex: 'u=a+b', a1: 2, a2: 8 },
      cv: { p: { al: 1, be: 1 }, level: 100, max: 12, amin: 0, amax: 10, tex: 'u=a^2+b^2', a1: 2, a2: 9 }
    };
    let type = 'cd';
    const bOn = (a) => {
      const c = cfg[type], L = c.level;
      switch (type) {
        case 'cd': return L / a;
        case 'sq': return Math.pow(L - Math.sqrt(a), 2);
        case 'ps': return L - a;
        case 'cv': return Math.sqrt(Math.max(0, L - a * a));
      }
    };
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 20, ymax: 20 });
    UI.select(ctl, {
      label: 'Preferences', value: 'cd', onChange: v => { type = v; reset(); },
      options: [['cd', 'Cobb-Douglas u = ab (convex)'], ['sq', 'Root utility (convex)'], ['ps', 'Perfect substitutes (weakly convex)'], ['cv', 'u = a² + b² (NOT convex)']]
    });
    const sA = UI.slider(ctl, { label: 'Bundle A: position on the curve (a)', min: 1, max: 16, step: 0.25, value: 2, onInput: draw, fmt: v => n(v) });
    const sB = UI.slider(ctl, { label: 'Bundle B: position on the curve (a)', min: 1, max: 16, step: 0.25, value: 8, onInput: draw, fmt: v => n(v) });
    const sT = UI.slider(ctl, { label: 'Mix: weight on A', min: 0, max: 1, step: 0.05, value: 0.5, onInput: draw, fmt: v => n(v) });
    const out = UI.readout(ctl);
    function reset() {
      const c = cfg[type];
      sA.setRange(c.amin, c.amax); sB.setRange(c.amin, c.amax);
      sA.set(c.a1); sB.set(c.a2); sT.set(0.5);
      P.setRange(c.max, c.max); draw();
    }
    function draw() {
      const c = cfg[type];
      P.clear();
      P.path(Econ.ic(type, c.p, c.level, c.max, c.max), { cls: 's1', w: 3 });
      const aA = sA.get(), aB = sB.get(), t = sT.get();
      const A = [aA, bOn(aA)], B = [aB, bOn(aB)];
      const M = [t * A[0] + (1 - t) * B[0], t * A[1] + (1 - t) * B[1]];
      P.line(A[0], A[1], B[0], B[1], { cls: 'smuted', dash: '6 5', w: 2 });
      P.dot(A[0], A[1], { cls: 'f1' }); P.text(A[0], A[1], 'A', { dx: 9, dy: -9, cls: 'c1' });
      P.dot(B[0], B[1], { cls: 'f1' }); P.text(B[0], B[1], 'B', { dx: 9, dy: -9, cls: 'c1' });
      P.dot(M[0], M[1], { cls: 'f2' }); P.text(M[0], M[1], 'mix', { dx: 9, dy: -9, cls: 'c2' });
      const uA = Econ.util(type, c.p, A[0], A[1]), uM = Econ.util(type, c.p, M[0], M[1]);
      const d = uM - uA;
      const verdict = Math.abs(d) < 1e-6 * Math.max(1, uA) ? 'mix ∼ A: <b>just as good</b>' : d > 0 ? 'mix ≻ A: <b>strictly better</b>' : 'mix ≺ A: <b>worse</b>, so convexity fails';
      out.set(`<p>\\(${c.tex}\\). A and B are both on the curve \\(u=${n(uA)}\\).</p><p>Mix = \\((${n(M[0])},\\,${n(M[1])})\\), with \\(u=${n(uM)}\\): ${verdict}.</p>` +
        `<p class="hint">Convex preferences: the mix of two equally good bundles is <em>at least as good</em> as either one.</p>`);
    }
    reset();
  })();

  // ================= Widget 3: revealed preference consistency =================
  (function () {
    const host = document.getElementById('w-revealed');
    if (!host) return;
    const ctl = host.querySelector('.ctl'), res = host.querySelector('.res');
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 10, ymax: 10 });
    const init = [{ pa: 1, pb: 2, Y: 14, a: 4, b: 5 }, { pa: 2, pb: 1, Y: 14, a: 5, b: 4 }];
    const obs = init.map(o => Object.assign({}, o));
    const fields = [['pa', 'p_a'], ['pb', 'p_b'], ['Y', 'Y'], ['a', 'a'], ['b', 'b']];
    const cls = ['c1', 'c2'], sc = ['s1', 's2'], fc = ['f1', 'f2'];
    obs.forEach((o, i) => {
      const box = document.createElement('div');
      box.innerHTML = `<b class="${'lab ' + cls[i]}" style="font-size:.9rem">Observation ${i + 1}</b>`;
      const g = document.createElement('div');
      g.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:4px';
      fields.forEach(([k, label]) => {
        const l = document.createElement('label');
        l.style.cssText = 'display:block;font-size:.78rem;color:var(--muted)';
        l.innerHTML = `\\(${label}\\)`;
        const inp = document.createElement('input');
        inp.type = 'number'; inp.step = 'any'; inp.min = 0; inp.value = o[k];
        inp.style.cssText = 'width:100%;font:inherit;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink)';
        inp.addEventListener('input', () => { o[k] = Math.max(0, parseFloat(inp.value) || 0); run(); });
        l.append(inp); g.append(l);
      });
      box.append(g); ctl.append(box);
      typeset(box);
    });

    function run() {
      const cost = (i, j) => obs[i].pa * obs[j].a + obs[i].pb * obs[j].b;
      // own-affordability
      const msgs = [];
      let bad = false;
      obs.forEach((o, i) => { if (cost(i, i) > o.Y + 1e-9) { msgs.push(`<p>✗ Bundle ${i + 1} costs more than the income in observation ${i + 1}: it was not affordable.</p>`); bad = true; } });
      // revealed relations
      const weak = [[0, 0], [0, 0]], strict = [[0, 0], [0, 0]];
      [[0, 1], [1, 0]].forEach(([i, j]) => {
        const same = obs[i].a === obs[j].a && obs[i].b === obs[j].b;
        if (same) return;
        const c = cost(i, j);
        if (c <= obs[i].Y + 1e-9) weak[i][j] = 1;
        if (c < obs[i].Y - 1e-9) strict[i][j] = 1;
        msgs.push(`<p>In observation ${i + 1}, bundle ${j + 1} costs \\(${n(c)}\\) vs. income \\(${n(obs[i].Y)}\\): ` +
          (strict[i][j] ? `affordable with money left, so (more is better) <b>bundle ${i + 1} ≻ bundle ${j + 1}</b>.` : weak[i][j] ? `just affordable, so <b>bundle ${i + 1} ≽ bundle ${j + 1}</b>.` : 'not affordable, so no information.') + '</p>');
      });
      const viol = (strict[0][1] && weak[1][0]) || (strict[1][0] && weak[0][1]);
      msgs.push(bad ? '' : viol
        ? '<p><b>✗ Inconsistent with rational preferences.</b> The two observations imply a strict preference one way and a weak preference the other way.</p>'
        : '<p><b>✓ Consistent</b> with some rational preferences (more is better).</p>');
      res.innerHTML = msgs.join('');
      typeset(res);
      // plot
      const mx = Math.max(...obs.flatMap(o => [o.Y / Math.max(o.pa, 1e-6), o.a]), 1), my = Math.max(...obs.flatMap(o => [o.Y / Math.max(o.pb, 1e-6), o.b]), 1);
      const m = Math.ceil(Math.min(Math.max(mx, my) * 1.15, 1000));
      P.setRange(m, m);
      obs.forEach((o, i) => {
        if (o.pa > 0 && o.pb > 0) P.line(0, o.Y / o.pb, o.Y / o.pa, 0, { cls: sc[i], w: 3 });
        P.dot(o.a, o.b, { cls: fc[i] });
        P.text(o.a, o.b, `bundle ${i + 1}`, { dx: 9, dy: -9, cls: cls[i] });
      });
    }
    run();
  })();
});
