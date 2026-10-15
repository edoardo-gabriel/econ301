document.addEventListener('DOMContentLoaded', () => {
  const n2 = v => fmt(v, 2);

  // ================= Widget 1: price-taking firm =================
  (function () {
    const host = document.getElementById('w-profit');
    if (!host) return;
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 12, ymax: 24, xlabel: 'quantity q', ylabel: '$ per unit' });
    const ctl = host.querySelector('.ctl');
    const sP = UI.slider(ctl, { label: 'Market price \\(p\\)', min: 0, max: 24, step: 0.5, value: 10, fmt: v => '$' + n2(v), onInput: draw });
    const sK = UI.slider(ctl, { label: 'Cost parameter \\(k\\)', min: 0, max: 10, step: 0.5, value: 4, fmt: v => n2(v), onInput: draw });
    const out = UI.readout(ctl);

    function draw() {
      const p = sP.get(), k = sK.get();
      const q = Math.max(0, (p - k) / 2);
      const mc = x => 2 * x + k;
      P.clear();
      if (q > 0) P.area([[0, p], [q, p], [q, mc(q)], [0, k]], 'fill-set');
      P.path([[0, k], [12, mc(12)]], { cls: 's2', w: 3 });
      P.line(0, p, 12, p, { cls: 's1', w: 3 });
      P.text(12, mc(12), 'MC', { dx: -4, dy: -8, anchor: 'end', cls: 'c2' });
      P.text(0.3, p, 'p = MR', { dx: 4, dy: -8, cls: 'c1' });
      P.dot(q, p, { cls: 'f1' });
      const profit = p * q - (q * q + k * q);
      out.set(
        `<p>\\(MC(q)=2q+${n2(k)}\\) and \\(MR=p=${n2(p)}\\).</p>` +
        (p > k
          ? `<p>Set \\(p=MC\\): \\(q^*=\\frac{p-k}{2}=<b>${n2(q)}</b>\\). Profit \\(\\pi=pq-c(q)=<b>${n2(profit)}</b>\\).</p>`
          : `<p>\\(p\\le MC(0)=${n2(k)}\\): every unit costs more than it earns, so \\(q^*=<b>0</b>\\) and \\(\\pi=0\\) (a corner solution).</p>`) +
        `<p class="hint">Shaded area: the gap between the price and \\(MC\\), summed over all units produced. With no fixed cost it equals profit.</p>`);
    }
    draw();
  })();

  // ================= Widget 2: isoquants =================
  (function () {
    const host = document.getElementById('w-iso');
    if (!host) return;
    const P = new Plot(host.querySelector('.plot-host'), { xmax: 10, ymax: 10, xlabel: 'capital K', ylabel: 'labor L' });
    const ctl = host.querySelector('.ctl');
    let type = 'cd';
    UI.select(ctl, {
      label: 'Production function', value: 'cd', onChange: v => { type = v; draw(); },
      options: [['cd', 'Cobb-Douglas  K^α L^β'], ['ps', 'Perfect substitutes  αK + βL'], ['pc', 'Perfect complements  min{αK, βL}']]
    });
    const sAl = UI.slider(ctl, { label: '\\(\\alpha\\)', min: 0.25, max: 2, step: 0.25, value: 0.5, fmt: n2, onInput: draw });
    const sBe = UI.slider(ctl, { label: '\\(\\beta\\)', min: 0.25, max: 2, step: 0.25, value: 0.5, fmt: n2, onInput: draw });
    const sQ = UI.slider(ctl, { label: 'Output \\(q\\)', min: 1, max: 4, step: 0.5, value: 2, fmt: n2, onInput: draw });
    const sK = UI.slider(ctl, { label: 'Point on the isoquant: \\(K\\)', min: 0.5, max: 9, step: 0.5, value: 4, fmt: n2, onInput: draw });
    const out = UI.readout(ctl);

    const F = (K, L, a, b) => type === 'cd' ? Math.pow(K, a) * Math.pow(L, b) : type === 'ps' ? a * K + b * L : Math.min(a * K, b * L);
    // labor needed for output q at capital K (null where the isoquant is vertical)
    const Liso = (K, q, a, b) => type === 'cd' ? Math.pow(q / Math.pow(K, a), 1 / b) : type === 'ps' ? Math.max(0, (q - a * K) / b) : (a * K <= q ? q / b : null);
    function iso(q, a, b) {
      if (type === 'pc') return [[q / a, 1e3], [q / a, q / b], [1e3, q / b]];
      const pts = [];
      for (let K = 0.05; K <= 10.001; K += 0.05) {
        const L = Liso(K, q, a, b);
        if (L != null && L <= 40) pts.push([K, L]);
        if (type === 'ps' && L === 0) break;
      }
      return pts;
    }

    function draw() {
      const a = sAl.get(), b = sBe.get(), q = sQ.get();
      P.clear();
      P.path(iso(2 * q, a, b), { cls: 'smuted', dash: '6 5', w: 2, op: .8 });
      P.path(iso(q, a, b), { cls: 's1', w: 3 });
      let K = sK.get(), L, mpk = null, mpl = null, mrts = null;
      if (type === 'pc') { K = q / a; L = q / b; }
      else {
        L = Liso(K, q, a, b);
        if (type === 'cd') { mpk = a * q / K; mpl = b * q / L; } else { mpk = a; mpl = b; }
        mrts = -mpk / mpl;
      }
      const onGraph = L != null && L <= 10 && K <= 10;
      if (onGraph) { P.dot(K, L, { cls: 'f1' }); P.text(K, L, `(${n2(K)}, ${n2(L)})`, { dx: 9, dy: -9, cls: 'c1' }); }
      const rs = type === 'cd' ? a + b : 1;
      const rsTxt = Math.abs(rs - 1) < 1e-9 ? 'constant returns to scale' : rs > 1 ? 'increasing returns to scale' : 'decreasing returns to scale';
      const ratio = type === 'cd' ? Math.pow(2, a + b) : 2;
      out.set(
        `<p>The point \\((K,L)=(${n2(K)},${n2(L)})\\) produces \\(q=${n2(q)}\\).</p>` +
        (type === 'pc'
          ? `<p>The corner is where \\(\\alpha K=\\beta L\\). \\(MP_K\\), \\(MP_L\\) and the MRTS are <b>undefined</b> there (the isoquant has a kink).</p>`
          : `<p>\\(MP_K=${n2(mpk)}\\), \\(MP_L=${n2(mpl)}\\), so \\(MRTS_{KL}=-\\frac{MP_K}{MP_L}=<b>${n2(mrts)}</b>\\).</p>`) +
        `<p>Doubling both inputs multiplies output by <b>${n2(ratio)}</b>: <b>${rsTxt}</b>${type === 'cd' ? ` (\\(\\alpha+\\beta=${n2(a + b)}\\))` : ''}.</p>` +
        `<p class="hint">Dashed grey: the isoquant for output \\(2q\\), farther from the origin.</p>`);
    }
    draw();
  })();
});
