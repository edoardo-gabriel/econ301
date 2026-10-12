// Generated drills: "work backwards" (inverse) problems and graph-reading problems.
// Each generator returns a fresh question object every time it is called.
(function () {
  'use strict';
  if (!window.Quiz || !window.Econ) return;
  const R = String.raw;
  const { pick, shuffle, addGen } = Quiz;
  const rnd = n => Math.floor(Math.random() * n);
  const f2 = x => fmt(x, 2);
  const MRS = R`\mathrm{MRS}_{ab}`;
  const co = v => (v === 1 ? '' : v);            // coefficient: 1a -> a
  const pw = v => (v === 1 ? '' : '^{' + v + '}'); // exponent: a^{1} -> a

  // =====================================================================
  //  INVERSE / MULTI-PART CALCULATION DRILLS
  // =====================================================================

  // Given the optimum and the MRS, recover prices, income and the other good (exam-style "work backwards").
  addGen('inv', () => {
    const [al, be] = pick([[1, 1], [1, 2], [2, 1], [2, 2], [1, 3], [3, 1], [2, 3], [3, 2]]);
    const pa = pick([1, 2, 3, 4, 6]), a = pick([1, 2, 3, 4, 5]), m = pick([1, 2, 3, 4]);
    const b = m * be * a / al, pb = pa / m, Y = pa * a + pb * b;
    return {
      topic: 'optimal',
      q: R`Consumer B has Cobb-Douglas utility \(u(a,b)=a${pw(al)}b${pw(be)}\) and the price of \(a\) is \(p_a=${pa}\). At the optimal choice, \(a^*=${a}\) and \(${MRS}=-${m}\). Find \(p_b\), the consumer's income \(Y\), and \(b^*\). (Fractions such as 1/2 are fine.)`,
      parts: [{ label: R`\(p_b\)`, answer: pb }, { label: R`Income \(Y\)`, answer: Y }, { label: R`\(b^*\)`, answer: b }],
      sol: R`<b>Price of \(b\):</b> at an interior optimum \(|${MRS}|=\frac{p_a}{p_b}\), so \(p_b=\frac{p_a}{|${MRS}|}=\frac{${pa}}{${m}}=${f2(pb)}\).<br>
        <b>Quantity of \(b\):</b> for \(a^{${al}}b^{${be}}\), \(|${MRS}|=\frac{${al}\,b}{${be}\,a}\). Setting this equal to ${m} at \(a^*=${a}\) gives \(b^*=\frac{${m}\cdot${be}\cdot${a}}{${al}}=${f2(b)}\).<br>
        <b>Income:</b> the optimum is on the budget line, so \(Y=p_a a^*+p_b b^*=${pa}(${a})+${f2(pb)}(${f2(b)})=${f2(Y)}\).`
    };
  }, 'Cobb-Douglas: work backwards', 'calc');

  // Perfect complements: optimum, then "what income gives b* = k?"
  addGen('invpc', () => {
    const [al, be] = pick([[1, 1], [1, 2], [2, 1], [2, 3], [3, 2], [1, 4], [4, 1]]);
    const pa = pick([1, 2, 3, 4]), pb = pick([1, 2, 3, 4, 8]), m = pick([1, 2, 3, 4]);
    const a = be * m, b = al * m, Y = pa * a + pb * b;
    let m2; do { m2 = pick([1, 2, 3, 4, 5, 6]); } while (m2 === m);
    const b2 = al * m2, a2 = be * m2, Y2 = pa * a2 + pb * b2;
    return {
      topic: 'optimal',
      q: R`Consumer E has utility \(u(a,b)=\min\{${co(al)}a,\ ${co(be)}b\}\). Prices are \(p_a=${pa}\), \(p_b=${pb}\) and income is \(Y=${Y}\). Find the optimal choice \((a^*,b^*)\). Then suppose income changes so that the new optimal choice has \(b^*=${b2}\): find the new \(a^*\) and the new income.`,
      parts: [{ label: R`\(a^*\)`, answer: a }, { label: R`\(b^*\)`, answer: b },
              { label: R`new \(a^*\)`, answer: a2 }, { label: R`new \(Y\)`, answer: Y2 }],
      sol: R`Perfect complements are consumed at the kink: \(${al}a=${be}b\), i.e. \(b=\frac{${al}}{${be}}a\).<br>
        <b>Original:</b> \(${pa}a+${pb}\cdot\frac{${al}}{${be}}a=${Y}\Rightarrow a^*=${a}\), \(b^*=${b}\).<br>
        <b>New income:</b> with \(b^*=${b2}\) the kink gives \(a^*=\frac{${be}}{${al}}\cdot${b2}=${f2(a2)}\), so the income needed is \(Y=${pa}(${f2(a2)})+${pb}(${b2})=${f2(Y2)}\).`
    };
  }, 'Perfect complements: work backwards', 'calc');

  // Perfect substitutes: slope, corner solution, MRS
  addGen('invps', () => {
    let al, be, pa, pb;
    do { al = 1 + rnd(5); be = 1 + rnd(5); pa = pick([1, 2, 3, 4]); pb = pick([1, 2, 3, 4]); } while (al * pb === be * pa);
    const Y = pa * pb * pick([2, 3, 5]), aWins = al * pb > be * pa;
    const a = aWins ? Y / pa : 0, b = aWins ? 0 : Y / pb;
    return {
      topic: 'optimal',
      q: R`Consumer F has utility \(u(a,b)=${co(al)}a+${co(be)}b\). Prices are \(p_a=${pa}\), \(p_b=${pb}\) and income is \(Y=${Y}\). With \(a\) on the horizontal axis, find the slope of the budget constraint, the optimal choice \((a^*,b^*)\), and \(${MRS}\) at the optimum. (Enter signed numbers.)`,
      parts: [{ label: 'Budget slope', answer: -pa / pb }, { label: R`\(a^*\)`, answer: a }, { label: R`\(b^*\)`, answer: b }, { label: R`\(${MRS}\)`, answer: -al / be }],
      sol: R`<b>Slope:</b> \(-\frac{p_a}{p_b}=-\frac{${pa}}{${pb}}\).<br>
        <b>Optimum:</b> compare utility per dollar: \(\frac{${al}}{${pa}}=${fmt(al / pa, 3)}\) for \(a\) versus \(\frac{${be}}{${pb}}=${fmt(be / pb, 3)}\) for \(b\). Good <b>${aWins ? 'a' : 'b'}</b> wins, so she spends everything on it: \((a^*,b^*)=${aWins ? `(${Y / pa},0)` : `(0,${Y / pb})`}\).<br>
        <b>MRS:</b> constant for perfect substitutes: \(${MRS}=-\frac{${al}}{${be}}\) (a corner solution, so \(|${MRS}|\neq p_a/p_b\)).`
    };
  }, 'Perfect substitutes: slope, optimum, MRS', 'calc');

  // Cobb-Douglas: spending, demand, normalising exponents with a monotonic transformation
  addGen('cdfull', () => {
    const al = pick([1, 2, 3, 4]), be = pick([1, 2, 3, 4]), pb = pick([1, 2, 4]), Y = pick([12, 24, 30, 48, 60]);
    const spend = al * Y / (al + be), pa2 = pick([1, 2, 3, 5]), g = 1 / (al + be);
    return {
      topic: 'demand',
      q: R`Consumer G has utility \(u(a,b)=a${pw(al)}b${pw(be)}\). The price of \(b\) is \(p_b=${pb}\) and income is \(Y=${Y}\). (1) How much money does G spend on good \(a\) at the optimum? (2) How many units of \(a\) does G demand when \(p_a=${pa2}\)? (3) The function \(g(x)=x^{\gamma}\) turns \(u\) into \(v=g(u)=a^{\alpha'}b^{\beta'}\) with \(\alpha'+\beta'=1\). What is \(\gamma\)? (Fractions are fine.)`,
      parts: [{ label: 'Spending on \\(a\\)', answer: spend }, { label: R`\(a^*\) at \(p_a=${pa2}\)`, answer: spend / pa2 }, { label: R`\(\gamma\)`, answer: g, tol: 0.003 }],
      sol: R`Cobb-Douglas spends the fraction \(\frac{\alpha}{\alpha+\beta}=\frac{${al}}{${al + be}}\) of income on \(a\).<br>
        (1) \(${fmt(spend, 3)}\). (2) The demand curve is \(D_a(p_a)=\frac{${fmt(spend, 3)}}{p_a}\), so at \(p_a=${pa2}\): \(${fmt(spend / pa2, 3)}\).<br>
        (3) \(g(u)=(a^{${al}}b^{${be}})^{\gamma}=a^{${al}\gamma}b^{${be}\gamma}\); we need \(${al}\gamma+${be}\gamma=1\), so \(\gamma=\frac{1}{${al + be}}\). Raising utility to a positive power is a positive monotonic transformation, so the preferences are unchanged.`
    };
  }, 'Cobb-Douglas: spending, demand, rescaling exponents', 'calc');

  // Find the missing coordinate on an indifference curve
  addGen('indiff', () => {
    let al, be, k, a1, b1, b2, a2;
    do {
      [al, be] = pick([[1, 1], [1, 1], [2, 1], [1, 2]]);
      k = pick([1, 2, 3, 4, 5]); a1 = pick([1, 2, 3, 4]); b1 = pick([2, 3, 4, 6, 8]); b2 = pick([1, 2, 3, 4, 6]);
      a2 = Math.pow(Math.pow(a1, al) * Math.pow(b1, be) / Math.pow(b2, be), 1 / al);
    } while (Math.abs(a2 - a1) < 1e-9 && b1 === b2);
    return {
      topic: 'utility', tol: 0.01,
      q: R`Consumer A has utility \(u(a,b)=${k === 1 ? '' : k}a${al === 1 ? '' : '^{' + al + '}'}b${be === 1 ? '' : '^{' + be + '}'}\). She is indifferent between \((a_1,b_1)=(${a1},${b1})\) and \((a_2,b_2)=(a_2,${b2})\). What is \(a_2\)? (Round to 2 decimals.)`,
      answer: a2,
      sol: R`Indifferent means equal utility: \(u(${a1},${b1})=u(a_2,${b2})\). The constant ${k === 1 ? '' : k + ' '}cancels from both sides, so \(${a1}^{${al}}\cdot${b1}^{${be}}=a_2^{${al}}\cdot${b2}^{${be}}\).<br>
        Left side \(=${fmt(Math.pow(a1, al) * Math.pow(b1, be), 4)}\). Divide by \(${b2}^{${be}}\)${al === 1 ? '' : ' and take the root'}: \(a_2=${fmt(a2, 4)}\).`
    };
  }, 'Find a bundle on the same indifference curve', 'calc');

  // =====================================================================
  //  NON-NUMERIC CONCEPT DRILLS
  // =====================================================================

  // Same preferences? Same MRS?  (TRUE / FALSE / UNCERTAIN)
  addGen('transf', () => {
    const gs = [['3x+7', true], [R`\sqrt{x}-4`, true], ['x^{3}', true], [R`\ln x`, true], [R`\tfrac14\sqrt{x}-10`, true], ['x^{2}', true],
                ['-x', false], ['10-2x', false], [R`\frac1x`, false], [R`-\ln x`, false]];
    const [g, inc] = pick(gs), c = pick([2, 3, 4, 5]), a1 = pick([1, 2, 3]), b1 = pick([2, 3, 4]);
    return {
      topic: 'utility', type: 'tf', three: true,
      q: R`Consumer A has utility \(u(a,b)=${c}ab\) over positive quantities, and \(g(x)=${g}\). <strong>TRUE, FALSE or UNCERTAIN:</strong>`,
      items: [{ t: R`\(v(a,b)=g(u(a,b))\) represents exactly the same preferences as \(u\), <b>and</b> has the same \(${MRS}\) as \(u\) at \((${a1},${b1})\).`, a: inc }],
      expl: inc
        ? R`\(g\) is strictly increasing for \(x>0\), so it is a positive monotonic transformation: it preserves the ranking of every pair of bundles. The indifference curves are identical, so the MRS (the slope of the curve) is unchanged too. (Marginal utilities do change; their ratio does not.)`
        : R`\(g\) is strictly <em>decreasing</em>, so \(v\) <em>reverses</em> the ranking: the bundle \(u\) likes best, \(v\) likes least. The indifference curves, and so the MRS, are the same, but the preferences are not, so the statement (which needs both) is false.`
    };
  }, 'Utility transformation: same preferences? same MRS?', 'calc');

  // Choice function: C(a,b,c,d) from pairwise choices
  addGen('choice', () => {
    const names = ['a', 'b', 'c', 'd'];
    for (let tries = 0; tries < 500; tries++) {
      const rank = shuffle(names), pos = n => rank.indexOf(n);
      const order = shuffle(names), edges = [];
      for (let i = 1; i < 4; i++) edges.push([order[i], order[rnd(i)]].sort());
      const winner = (x, y) => pos(x) < pos(y) ? x : y;
      const adj = {}; names.forEach(n => adj[n] = []);
      edges.forEach(([x, y]) => { const w = winner(x, y); adj[w].push(w === x ? y : x); });
      const seen = new Set([rank[0]]), st = [rank[0]];
      while (st.length) { const u = st.pop(); adj[u].forEach(v => { if (!seen.has(v)) { seen.add(v); st.push(v); } }); }
      if (seen.size !== 4) continue;
      edges.sort((p, q) => p.join().localeCompare(q.join()));
      const obs = edges.map(([x, y]) => `C(${x},${y})=${winner(x, y)}`).join(', ');
      const facts = edges.map(([x, y]) => { const w = winner(x, y), l = w === x ? y : x; return `\\(${w}\\succ ${l}\\)`; }).join(', ');
      return {
        topic: 'preferences', type: 'mc', fixed: true,
        q: R`Suppose we observe a rational consumer make the following choices: ${obs}. What is \(C(a,b,c,d)\)?`,
        choices: names.map(n => '\\(' + n + '\\)'), answer: names.indexOf(rank[0]),
        expl: R`Each choice from a pair reveals a preference (with no ties): ${facts}. Rational preferences are transitive, so chaining these shows that \(${rank[0]}\) beats every other option. A rational consumer chooses her favorite available option, so \(C(a,b,c,d)=${rank[0]}\).`
      };
    }
  }, 'Choice functions: C(a,b,c,d)', 'calc');

  // =====================================================================
  //  GRAPH-READING DRILLS
  // =====================================================================

  // Is A optimal? Compare |MRS| with the price ratio.  (TRUE / FALSE / UNCERTAIN)
  addGen('gcross', () => {
    const al = pick([1, 1, 2, 3]), be = pick([1, 2, 3]), pa = pick([1, 2, 3]), pb = pick([1, 2, 3]);
    const fs = al / (al + be);
    const mode = pick(['steep', 'flat', 'tangent', 'budget', 'steep', 'flat']);
    const f = mode === 'steep' ? fs * pick([0.25, 0.45, 0.65])
      : mode === 'flat' ? fs + (1 - fs) * pick([0.5, 0.7, 0.85])
      : mode === 'tangent' ? fs : pick([0.3, 0.7]);
    const U = 'U', bud = mode === 'budget';
    const intro = bud
      ? R`The figure shows a consumer's <strong>budget constraint only</strong> and the bundle \(A\) she is currently choosing. Nothing is drawn for her preferences. TRUE, FALSE or UNCERTAIN?`
      : R`The figure shows a consumer's indifference curve and budget constraint. She is currently consuming at the intersection \(A\). TRUE, FALSE or UNCERTAIN?`;
    const expl = {
      steep: R`At \(A\) the indifference curve is <em>steeper</em> than the budget line, so \(|${MRS}|>p_a/p_b\): she values \(a\) more than the market charges for it. Buying more \(a\) and less \(b\) moves her to a higher indifference curve, so \(A\) is not optimal.`,
      flat: R`At \(A\) the indifference curve is <em>flatter</em> than the budget line, so \(|${MRS}|&lt;p_a/p_b\): she values \(a\) less than the market does. Selling some \(a\) to buy \(b\) raises utility, so \(A\) is not optimal.`,
      tangent: R`The indifference curve just touches the budget line at \(A\): the slopes are equal, so \(|${MRS}|=p_a/p_b\) and no reallocation can help. \(A\) is optimal.`,
      budget: R`With no indifference curve drawn we cannot compare \(|${MRS}|\) with \(p_a/p_b\), so we cannot say whether \(A\) is optimal: <b>uncertain</b>. (We can say \(A\) is affordable, since it is on the budget line.)`
    }[mode];
    return {
      topic: 'optimal', type: 'tf', three: true, q: intro,
      fig: { kind: 'cross', al, be, pa, pb, Y: 12, f, show: bud ? 'budget' : 'both' },
      items: [
        { t: R`\(A\) is the optimal choice for the consumer.`, a: mode === 'tangent' ? true : bud ? U : false },
        { t: R`\(|${MRS}|>\dfrac{p_a}{p_b}\) at \(A\).`, a: mode === 'steep' ? true : bud ? U : false },
        { t: R`She could raise her utility by buying more of \(b\) and less of \(a\).`, a: mode === 'flat' ? true : bud ? U : false }
      ],
      expl
    };
  }, 'Read the graph: is A optimal?', 'graph');

  // Which labelled bundle is optimal?
  addGen('gwhich', () => {
    const al = pick([1, 1, 2, 3]), be = pick([1, 2, 3]), pa = pick([1, 2, 3]), pb = pick([1, 2, 3]);
    const fs = al / (al + be);
    const fS = Math.min(0.9, Math.max(0.1, fs + pick([-1, 1]) * pick([0.28, 0.36]))), fI = pick([0.25, 0.5, 0.75]);
    const labels = shuffle(['A', 'B', 'C', 'D']), kinds = ['T', 'S', 'I', 'O'];
    const pts = kinds.map((k, i) => ({ k, l: labels[i] }));
    const L = k => labels[kinds.indexOf(k)];
    return {
      topic: 'optimal', type: 'mc', fixed: true,
      q: 'The figure shows a consumer\'s budget constraint and the indifference curve through each of four bundles. Which bundle is her optimal choice?',
      fig: { kind: 'which', al, be, pa, pb, Y: 12, fS, fI, pts },
      choices: ['Bundle A', 'Bundle B', 'Bundle C', 'Bundle D'], answer: ['A', 'B', 'C', 'D'].indexOf(L('T')),
      expl: R`Bundle ${L('T')} is optimal: it is on the budget line and its indifference curve just touches the line, the highest curve she can reach. Bundle ${L('S')} is affordable but a higher curve is available. Bundle ${L('I')} is affordable but inside the budget set (money unspent, and more is better). Bundle ${L('O')} is on a higher curve but outside the budget set, so she cannot afford it.`
    };
  }, 'Which bundle is optimal?', 'graph');

  // What kind of preferences?
  addGen('gshape', () => {
    const types = [
      ['cd', 'Cobb-Douglas (smooth curves bowed toward the origin)', R`The curves are smooth and bowed toward the origin, so \(|${MRS}|\) falls as \(a\) rises: convex, Cobb-Douglas-type preferences.`],
      ['ps', 'Perfect substitutes (straight lines)', R`Straight, parallel indifference curves have a constant slope, so \(|${MRS}|\) is the same everywhere: perfect substitutes.`],
      ['pc', 'Perfect complements (L-shaped)', R`L-shaped curves with a kink: goods are used in a fixed ratio and the MRS is undefined at the kink: perfect complements.`],
      ['cv', 'Not convex (bowed away from the origin)', R`The curves bow <em>away</em> from the origin, so \(|${MRS}|\) <em>rises</em> as \(a\) increases. That violates convexity (the average of two equally good bundles is worse).`]
    ];
    const i = rnd(4), [type, , why] = types[i];
    return {
      topic: 'utility', type: 'mc',
      q: 'The figure shows three indifference curves of one consumer. Which description fits her preferences?',
      fig: { kind: 'shape', type, al: pick([1, 2]), be: pick([1, 2]) },
      choices: types.map(t => t[1]), answer: i, expl: why
    };
  }, 'Read the graph: what kind of preferences?', 'graph');

  // How did the budget line move?
  addGen('gshift', () => {
    const base = pick([{ pa: 2, pb: 4, Y: 24 }, { pa: 3, pb: 3, Y: 18 }, { pa: 2, pb: 2, Y: 12 }, { pa: 4, pb: 2, Y: 24 }]);
    const ch = [
      ['The price of \\(a\\) rose', o => ({ ...o, pa: o.pa * 2 }), 'only the horizontal intercept \\(Y/p_a\\) moved (in), so the price of \\(a\\) rose'],
      ['The price of \\(a\\) fell', o => ({ ...o, pa: o.pa / 2 }), 'only the horizontal intercept \\(Y/p_a\\) moved (out), so the price of \\(a\\) fell'],
      ['The price of \\(b\\) rose', o => ({ ...o, pb: o.pb * 2 }), 'only the vertical intercept \\(Y/p_b\\) moved (down), so the price of \\(b\\) rose'],
      ['The price of \\(b\\) fell', o => ({ ...o, pb: o.pb / 2 }), 'only the vertical intercept \\(Y/p_b\\) moved (up), so the price of \\(b\\) fell'],
      ['Income rose', o => ({ ...o, Y: o.Y * 1.5 }), 'both intercepts moved out by the same proportion (a parallel shift), so income rose'],
      ['Income fell', o => ({ ...o, Y: o.Y / 2 }), 'both intercepts moved in by the same proportion (a parallel shift), so income fell']
    ];
    const k = rnd(6), chosen = [k];
    while (chosen.length < 4) { const j = rnd(6); if (!chosen.includes(j)) chosen.push(j); }
    return {
      topic: 'budget', type: 'mc',
      q: 'The dashed line is a consumer\'s original budget constraint (good \\(a\\) on the horizontal axis). The solid line is the new one. Exactly one thing changed. What was it?',
      fig: { kind: 'shift', from: base, to: ch[k][1](base) },
      choices: chosen.map(j => ch[j][0]), answer: 0,
      expl: 'Compare the intercepts: ' + ch[k][2] + '. Remember the horizontal intercept is \\(Y/p_a\\), the vertical one is \\(Y/p_b\\), and the slope is \\(-p_a/p_b\\).'
    };
  }, 'Read the graph: how did the budget line move?', 'graph');

  // "Provide one bundle that may be optimal" after prices change (revealed preference)
  addGen('gpick', () => {
    for (let tries = 0; tries < 400; tries++) {
      const pa0 = pick([2, 3, 4]), pb0 = pick([1, 2, 4]), a0 = pick([2, 3, 4, 5, 6]), b0 = pick([2, 3, 4, 6, 8]);
      const Y = pa0 * a0 + pb0 * b0;
      const mode = pick(['on', 'on', 'on', 'out', 'in']);
      const target = mode === 'on' ? Y : mode === 'out' ? Y * 1.25 : Y * 0.8;
      const pa1 = pick([1, 2, 3, 5]);
      if (pa1 === pa0) continue;
      const pb1 = (target - pa1 * a0) / b0;
      if (!(pb1 >= 0.5 && pb1 <= 8) || Math.abs(pb1 * 2 - Math.round(pb1 * 2)) > 1e-9) continue;
      if (Math.abs(pa1 / pb1 - pa0 / pb0) < 0.15) continue;
      const spec = { kind: 'pick', old: { pa: pa0, pb: pb0, Y }, nw: { pa: pa1, pb: pb1, Y }, A: [a0, b0] };
      // describe the valid segment
      let lo = Infinity, hi = -Infinity;
      for (let i = 0; i <= 400; i++) {
        const a = (Y / pa1) * i / 400, b = (Y - pa1 * a) / pb1;
        if (Figures.pickValid(spec, a, b)) { lo = Math.min(lo, a); hi = Math.max(hi, a); }
      }
      const affordable = pa1 * a0 + pb1 * b0 <= Y + 1e-9;
      const region = !affordable
        ? R`Her old bundle \(A\) costs \(${pa1}(${a0})+${f2(pb1)}(${b0})=${f2(pa1 * a0 + pb1 * b0)}\), more than her income, so \(A\) is no longer affordable. Then her choices at the two sets of prices can never contradict each other, and <b>any</b> bundle on the new budget line could be optimal.`
        : R`Her old bundle \(A\) still costs only \(${f2(pa1 * a0 + pb1 * b0)}\le${Y}\), so it is <em>affordable</em> at the new prices, and her new choice must be at least as good as \(A\). Any bundle that she could have afforded before with money to spare was strictly worse than \(A\) (more is better), so those are ruled out. What remains is the thick segment: roughly \(${f2(lo)}\le a\le ${f2(hi)}\) on the new line.`;
      return {
        topic: 'preferences', type: 'pick', fig: spec,
        q: R`Yesterday \(p_a=${pa0}\), \(p_b=${pb0}\), income \(Y=${Y}\), and the consumer chose \(A=(${a0},${b0})\). Today she has the same preferences and income, but \(p_a=${pa1}\) and \(p_b=${f2(pb1)}\). The dashed line is yesterday's budget line and the solid line is today's. <strong>Tap a bundle on today's budget line that could be her new optimal choice</strong>, then check.`,
        expl: region
      };
    }
  }, 'Revealed preference: tap a possible new choice', 'graph');
})();
