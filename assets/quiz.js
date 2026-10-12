// Quiz engine: multiple-choice, true/false sets, randomized numeric exercises, pop-up quizzes, progress.
(function () {
  'use strict';
  const R = String.raw;
  const rnd = n => Math.floor(Math.random() * n);
  const pick = arr => arr[rnd(arr.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ---------- progress ----------
  const prog = () => Store.get('prog', {});
  function record(id, ok) {
    const p = prog();
    const r = p[id] || { n: 0, ok: false };
    r.n++; r.ok = r.ok || ok;
    p[id] = r;
    Store.set('prog', p);
    window.dispatchEvent(new Event('progress'));
  }
  function progress(topic) {
    const qs = (window.QUESTIONS || []).filter(q => !topic || q.topic === topic);
    const p = prog();
    return { done: qs.filter(q => p[q.id] && p[q.id].ok).length, total: qs.length };
  }

  // ---------- randomized numeric exercises ----------
  const gens = {
    cd: () => {
      const al = pick([1, 2, 3]), be = pick([1, 2, 3]), pa = pick([1, 2, 4, 5]), pb = pick([1, 2, 4, 5]), k = pick([1, 2, 3]);
      const Y = (al + be) * pa * pb * k, askA = Math.random() < .5;
      const a = al * pb * k, b = be * pa * k;
      return {
        topic: 'optimal',
        q: R`A consumer has \(u(a,b)=a^{${al}}b^{${be}}\), income \(Y=${Y}\), and prices \(p_a=${pa}\), \(p_b=${pb}\). What is her optimal quantity of good <strong>${askA ? 'a' : 'b'}</strong>?`,
        answer: askA ? a : b,
        sol: R`Cobb-Douglas spends the fraction \(\frac{\alpha}{\alpha+\beta}\) of income on \(a\) and \(\frac{\beta}{\alpha+\beta}\) on \(b\). Here that is \(\frac{${al}}{${al + be}}\) and \(\frac{${be}}{${al + be}}\).<br>
          Spending on \(a\): \(${Y}\cdot\frac{${al}}{${al + be}}=${Y * al / (al + be)}\), so \(a^*=${Y * al / (al + be)}/${pa}=${a}\).<br>
          Spending on \(b\): \(${Y * be / (al + be)}\), so \(b^*=${Y * be / (al + be)}/${pb}=${b}\).`
      };
    },
    pc: () => {
      const al = pick([1, 2, 3, 4]), be = pick([1, 2, 3, 4]), pa = pick([1, 2, 3, 4]), pb = pick([1, 2, 3, 4]), m = pick([1, 2, 3, 4]);
      const a = be * m, b = al * m, Y = pa * a + pb * b, askA = Math.random() < .5;
      return {
        topic: 'optimal',
        q: R`A consumer has \(u(a,b)=\min\{${al}a,\ ${be}b\}\), income \(Y=${Y}\), and prices \(p_a=${pa}\), \(p_b=${pb}\). What is her optimal quantity of good <strong>${askA ? 'a' : 'b'}</strong>?`,
        answer: askA ? a : b,
        sol: R`Perfect complements are consumed at the kink: \(${al}a=${be}b\), so \(b=\frac{${al}}{${be}}a\).<br>
          Plug into the budget: \(${pa}a+${pb}\cdot\frac{${al}}{${be}}a=${Y}\), so \(a^*=${a}\) and \(b^*=\frac{${al}}{${be}}\cdot${a}=${b}\).<br>
          Check: \(${pa}(${a})+${pb}(${b})=${Y}\). ✓`
      };
    },
    ps: () => {
      let al, be, pa, pb;
      do { al = 1 + rnd(6); be = 1 + rnd(6); pa = 1 + rnd(6); pb = 1 + rnd(6); } while (al * pb === be * pa);
      const k = pick([1, 2, 3]), Y = pa * pb * k, aWins = al * pb > be * pa;
      const u = aWins ? al * Y / pa : be * Y / pb;
      return {
        topic: 'optimal',
        q: R`A consumer has \(u(a,b)=${al}a+${be}b\), income \(Y=${Y}\), and prices \(p_a=${pa}\), \(p_b=${pb}\). What utility does she get at her optimal bundle?`,
        answer: u,
        sol: R`Perfect substitutes: buy only the good with the larger utility per dollar.<br>
          Good \(a\): \(${al}/${pa}=${fmt(al / pa, 3)}\) per dollar. Good \(b\): \(${be}/${pb}=${fmt(be / pb, 3)}\) per dollar.<br>
          So she spends all income on <strong>${aWins ? 'a' : 'b'}</strong>: \((a^*,b^*)=${aWins ? `(${Y / pa},0)` : `(0,${Y / pb})`}\), giving \(u^*=${u}\).`
      };
    },
    mrs: () => {
      const al = pick([1, 2, 3]), be = pick([1, 2, 3]), a = 1 + rnd(6), b = 1 + rnd(6);
      return {
        topic: 'utility', tol: 0.01,
        q: R`For \(u(a,b)=a^{${al}}b^{${be}}\), compute \(|\mathrm{MRS}_{ab}|\) at the bundle \((a,b)=(${a},${b})\). Round to 2 decimals.`,
        answer: al * b / (be * a),
        sol: R`\(MU_a=${al}a^{${al - 1}}b^{${be}}\) and \(MU_b=${be}a^{${al}}b^{${be - 1}}\), so \(|\mathrm{MRS}_{ab}|=\frac{MU_a}{MU_b}=\frac{${al}\,b}{${be}\,a}\).<br>
          At \((${a},${b})\): \(\frac{${al}\cdot${b}}{${be}\cdot${a}}=${fmt(al * b / (be * a), 4)}\).`
      };
    },
    intercept: () => {
      const pa = pick([2, 3, 4, 5]), pb = pick([2, 3, 4, 5, 6]), Y = pa * pb * pick([2, 3, 4]), askA = Math.random() < .5;
      return {
        topic: 'budget',
        q: R`Prices are \(p_a=${pa}\) and \(p_b=${pb}\); income is \(Y=${Y}\). If she spends everything on <strong>${askA ? 'a' : 'b'}</strong>, how many units does she buy (the ${askA ? 'horizontal' : 'vertical'} intercept)?`,
        answer: askA ? Y / pa : Y / pb,
        sol: R`The budget line is \(${pa}a+${pb}b=${Y}\). Setting ${askA ? '\\(b=0\\)' : '\\(a=0\\)'} gives ${askA ? `\\(a=${Y}/${pa}=${Y / pa}\\)` : `\\(b=${Y}/${pb}=${Y / pb}\\)`}.<br>The slope is \(-p_a/p_b=-${pa}/${pb}\).`
      };
    },
    market: () => {
      const pa = pick([1, 2, 3, 4]), pb = pick([1, 2, 3, 4]), k1 = pick([2, 3, 4, 5, 6]), k2 = pick([2, 3, 4, 5, 6]);
      const Y1 = 2 * pa * k1, Y2 = (pa + pb) * k2;
      return {
        topic: 'demand',
        q: R`Consumer 1 has \(u_1=ab\) and income \(${Y1}\). Consumer 2 has \(u_2=\min\{a,b\}\) and income \(${Y2}\). Both face \(p_a=${pa}\) and \(p_b=${pb}\). What is <em>market</em> demand for \(a\)?`,
        answer: k1 + k2,
        sol: R`Consumer 1 (Cobb-Douglas, half of income on \(a\)): \(D_1=\frac{Y_1}{2p_a}=\frac{${Y1}}{${2 * pa}}=${k1}\).<br>
          Consumer 2 (kink at \(a=b\)): \(p_a a+p_b a=Y_2\Rightarrow D_2=\frac{${Y2}}{${pa + pb}}=${k2}\).<br>
          Market demand adds quantities: \(${k1}+${k2}=${k1 + k2}\).`
      };
    },
    elas: () => {
      const b = pick([1, 2, 3, 4, 5]), p = pick([2, 3, 4, 5, 6, 8]), q = pick([1, 2, 3, 4, 5, 6]);
      const a = b * (p + q);
      return {
        topic: 'elasticity', tol: 0.01,
        q: R`The demand for a good is \(Q=${a}-${b}P\). What is the own-price elasticity of demand at \(P=${p}\)? Round to 2 decimals.`,
        answer: -p / q,
        sol: R`At \(P=${p}\): \(Q=${a}-${b}(${p})=${b * q}\). The slope is \(dQ/dP=-${b}\).<br>
          \(\varepsilon=\frac{dQ}{dP}\cdot\frac{P}{Q}=-${b}\cdot\frac{${p}}{${b * q}}=${fmt(-p / q, 4)}\).<br>
          Since \(|\varepsilon|${p / q > 1 ? '>' : p / q < 1 ? '<' : '='}1\), demand is <b>${p / q > 1 ? 'elastic' : p / q < 1 ? 'inelastic' : 'unit elastic'}</b> here.`
      };
    },
    incel: () => {
      let A, c, Y, D;
      do { A = pick([-20, -10, 10, 20, 40]); c = pick([1, 2, 3]); Y = pick([20, 30, 40, 50]); D = A + c * Y; } while (D <= 0);
      const eta = c * Y / D;
      return {
        topic: 'elasticity', tol: 0.01,
        q: R`A consumer's demand for a good is \(Q=${A < 0 ? '-' + (-A) : A}+${c}Y\), where \(Y\) is income. What is the income elasticity of demand at \(Y=${Y}\)? Round to 2 decimals.`,
        answer: eta,
        sol: R`At \(Y=${Y}\): \(Q=${A}+${c}(${Y})=${D}\). Then \(\eta=\frac{dQ}{dY}\cdot\frac{Y}{Q}=${c}\cdot\frac{${Y}}{${D}}=${fmt(eta, 4)}\).<br>
          Positive, so it is a <b>normal</b> good; ${eta > 1 ? 'above 1, so a <b>luxury</b>' : 'below 1, so a <b>necessity</b>'}.`
      };
    },
    crossel: () => {
      let A, b, pa, c, pb, D;
      do { A = pick([40, 60, 80, 100]); b = pick([2, 3, 4]); pa = pick([2, 4, 5]); c = pick([-3, -2, -1, 1, 2, 3]); pb = pick([2, 4, 5, 10]); D = A - b * pa + c * pb; } while (D <= 0);
      const e = c * pb / D;
      return {
        topic: 'elasticity', tol: 0.01,
        q: R`The demand for good \(a\) is \(Q_a=${A}-${b}p_a${c > 0 ? '+' : '-'}${Math.abs(c)}p_b\). Find the cross-price elasticity of demand for \(a\) with respect to \(p_b\) at \(p_a=${pa}\), \(p_b=${pb}\). Round to 2 decimals.`,
        answer: e,
        sol: R`\(Q_a=${A}-${b}(${pa})${c > 0 ? '+' : '-'}${Math.abs(c)}(${pb})=${D}\). Then \(\varepsilon_{ab}=\frac{\partial Q_a}{\partial p_b}\cdot\frac{p_b}{Q_a}=${c}\cdot\frac{${pb}}{${D}}=${fmt(e, 4)}\).<br>
          ${e > 0 ? 'Positive: \(a\) and \(b\) are <b>substitutes</b>.' : 'Negative: \(a\) and \(b\) are <b>complements</b>.'}`
      };
    },
    sub: () => {
      // u = ab. Pairs chosen so that sqrt(pa0*pa1) = s is an integer, keeping every answer a whole number.
      const [pa0, pa1, s, L] = pick([[4, 1, 2, 4], [1, 4, 2, 4], [9, 1, 3, 9], [1, 9, 3, 9], [8, 2, 4, 8], [2, 8, 4, 8]]);
      const k = pick([1, 2]), pb = pick([1, 2, 4]), Y = 2 * L * k;
      const a0 = Y / (2 * pa0), b0 = Y / (2 * pb), u0 = a0 * b0, aB = Y / (2 * s), aC = Y / (2 * pa1);
      const which = pick(['substitution', 'income', 'total']);
      const ans = which === 'substitution' ? aB - a0 : which === 'income' ? aC - aB : aC - a0;
      return {
        topic: 'effects',
        q: R`A consumer has \(u(a,b)=ab\), income \(Y=${Y}\) and \(p_b=${pb}\). The price of \(a\) changes from \(${pa0}\) to \(${pa1}\). Holding her utility fixed to isolate the substitution effect, what is the <b>${which} effect</b> on the quantity of \(a\)? (Enter a signed number.)`,
        answer: ans,
        sol: R`Original bundle: \(a_0=\frac{Y}{2p_a}=${a0}\), \(b_0=\frac{Y}{2p_b}=${fmt(b0, 3)}\), so \(u_0=${fmt(u0, 3)}\).<br>
          <b>Substitution effect:</b> at the new price ratio, \(|MRS|=\frac ba=\frac{p_a}{p_b}\) gives \(b=\frac{${pa1}}{${pb}}a\). On the original curve \(ab=${fmt(u0, 3)}\): \(a_B=\sqrt{${fmt(u0, 3)}\cdot\frac{${pb}}{${pa1}}}=${aB}\). So \(SE=${aB}-${a0}=${aB - a0}\).<br>
          <b>Income effect:</b> final \(a_C=\frac{Y}{2p_a^{new}}=${aC}\), so \(IE=${aC}-${aB}=${aC - aB}\).<br>
          <b>Total:</b> \(${aC}-${a0}=${aC - a0}\) (= SE + IE).`
      };
    }
  };
  const genKeys = Object.keys(gens);

  // ---------- generators registry (calculation + graph drills live in drills.js) ----------
  const genMeta = {};
  [['cd', 'Cobb-Douglas optimum'], ['pc', 'Perfect complements optimum'], ['ps', 'Perfect substitutes optimum'], ['mrs', 'Compute the MRS'],
   ['intercept', 'Budget intercepts'], ['market', 'Market demand'], ['elas', 'Own-price elasticity'], ['incel', 'Income elasticity'],
   ['crossel', 'Cross-price elasticity'], ['sub', 'Substitution & income effects']
  ].forEach(([k, l]) => { genMeta[k] = { label: l, group: 'calc' }; });
  function addGen(key, fn, label, group) {
    gens[key] = fn;
    if (!genKeys.includes(key)) genKeys.push(key);
    genMeta[key] = { label, group: group || 'calc' };
  }
  function genQuestion(key, label) {
    const g = gens[key]();
    g.gen = key; g.topicLabel = label || (genMeta[key] && genMeta[key].label) || 'Practice';
    if (!g.type) g.type = 'num';
    return g;
  }

  // ---------- rendering ----------
  // Accepts 3, -3.5, 1/6, -2/7 and the unicode minus sign.
  const parseNum = s => {
    s = String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(',', '.');
    const m = /^(-?(?:\d+\.?\d*|\.\d+))\/(-?(?:\d+\.?\d*|\.\d+))$/.exec(s);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  };
  const kindLabel = q => q.type === 'tf' ? (q.three ? 'True / False / Uncertain' : 'True / False')
    : q.type === 'num' ? (q.parts ? 'Multi-part' : 'Numeric') : q.type === 'pick' ? 'Click the graph' : 'Multiple choice';
  const ansWord = a => a === true ? 'True' : a === false ? 'False' : 'Uncertain';

  function renderQuestion(q, host, opts = {}) {
    const box = h('div', 'q');
    box.append(h('div', 'qmeta', `<span>${q.topicLabel || ''}</span><span>${kindLabel(q)}</span>`));
    box.append(h('div', 'qtext', q.q.startsWith('<') ? q.q : `<p>${q.q}</p>`));
    let fig = null;
    if (q.fig && window.Figures) { const fh = h('div'); box.append(fh); fig = Figures.draw(fh, q.fig); box._fig = fig; }
    const fb = h('div'); // feedback holder

    const addAgain = () => {
      if (!q.gen) return;
      const wrap = h('div', 'qfoot');
      const again = h('button', 'btn small ghost', 'New problem');
      again.addEventListener('click', () => { box.replaceWith(renderQuestion(genQuestion(q.gen, q.topicLabel), null, opts)); });
      wrap.append(again); fb.append(wrap);
    };
    const finish = ok => {
      if (q.id) record(q.id, ok);
      fb.className = 'feedback ' + (ok ? 'good' : 'bad');
      fb.innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${q.expl || ''}`;
      addAgain();
      typeset(fb);
      opts.onDone && opts.onDone(ok);
    };

    if (q.type === 'mc') {
      const order = q.fixed ? q.choices.map((c, i) => i) : shuffle(q.choices.map((c, i) => i));
      const wrap = h('div', 'choices');
      order.forEach((ci, pos) => {
        const b = h('button', 'choice', (q.fixed ? '' : `<span class="k">${'ABCD'[pos]}.</span>`) + `<span>${q.choices[ci]}</span>`);
        b.addEventListener('click', () => {
          const ok = ci === q.answer;
          wrap.querySelectorAll('button').forEach(x => x.disabled = true);
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) wrap.querySelectorAll('button')[order.indexOf(q.answer)].classList.add('right');
          finish(ok);
        });
        wrap.append(b);
      });
      box.append(wrap);

    } else if (q.type === 'tf') {
      const wrap = h('div', 'tf');
      const vals = q.three ? [['T', true], ['F', false], ['Uncertain', 'U']] : [['T', true], ['F', false]];
      const sel = q.items.map(() => null);
      const rows = q.items.map((it, i) => {
        const row = h('div', 'tf-item', `<div>${it.t}</div>`);
        const btns = h('div', 'tfbtns');
        vals.forEach(([label, val]) => {
          const b = h('button', 'choice', `<span class="k">${label}</span>`);
          b.addEventListener('click', () => {
            sel[i] = val;
            btns.querySelectorAll('button').forEach(x => x.classList.remove('right'));
            b.classList.add('right');
            check.disabled = sel.some(s => s === null);
          });
          btns.append(b);
        });
        row.append(btns); wrap.append(row);
        return row;
      });
      const check = h('button', 'btn small', 'Check answers');
      check.disabled = true;
      check.addEventListener('click', () => {
        check.disabled = true;
        let all = true;
        q.items.forEach((it, i) => {
          const ok = sel[i] === it.a; all = all && ok;
          rows[i].classList.add(ok ? 'right' : 'wrong');
          rows[i].querySelectorAll('button').forEach(x => x.disabled = true);
          rows[i].firstChild.append(h('span', 'hint', ok ? ' ✓' : ` ✗ (${ansWord(it.a)})`));
        });
        finish(all);
      });
      const foot = h('div', 'qfoot'); foot.append(check);
      box.append(wrap, foot);

    } else if (q.type === 'pick' && fig) {
      const check = h('button', 'btn small', 'Check my bundle');
      check.disabled = true;
      fig.onSelect(() => { check.disabled = false; });
      check.addEventListener('click', () => { check.disabled = true; const ok = fig.check(); fig.reveal(ok); finish(ok); });
      const foot = h('div', 'qfoot'); foot.append(check);
      box.append(foot);

    } else if (q.type === 'num') {
      const parts = q.parts || [{ label: '', answer: q.answer, tol: q.tol }];
      const grid = h('div', 'numgrid');
      const inputs = parts.map(p => {
        const w = h('label', 'numpart', p.label ? `<span>${p.label}</span>` : '');
        const inp = h('input'); inp.type = 'text'; inp.autocomplete = 'off'; inp.placeholder = 'answer';
        w.append(inp); grid.append(w);
        return inp;
      });
      const foot = h('div', 'qfoot');
      const check = h('button', 'btn small', 'Check');
      const show = h('button', 'btn small ghost', 'Show solution');
      const grade = reveal => {
        let all = true;
        const lines = parts.map((p, i) => {
          const v = parseNum(inputs[i].value);
          const tol = p.tol || q.tol || 0.011;
          const ok = !reveal && isFinite(v) && Math.abs(v - p.answer) <= Math.max(tol, Math.abs(p.answer) * 0.005);
          all = all && ok;
          inputs[i].disabled = true;
          inputs[i].classList.add(ok ? 'ok' : 'no');
          return `<li>${p.label ? p.label + ' = ' : ''}<b>${fmt(p.answer, 4)}</b> ${reveal ? '' : ok ? '✓' : '✗'}</li>`;
        });
        check.disabled = true; show.style.display = 'none';
        if (q.id) record(q.id, all);
        if (all) record('num-' + q.topic, true);
        fb.className = 'feedback ' + (all ? 'good' : 'bad');
        fb.innerHTML = `<strong>${all ? 'Correct!' : reveal ? 'Solution' : 'Not quite.'}</strong> ` +
          (parts.length === 1 ? `The answer is <b>${fmt(parts[0].answer, 4)}</b>.` : `<ul class="ans">${lines.join('')}</ul>`) + `<br>${q.sol || q.expl || ''}`;
        addAgain();
        typeset(fb);
        opts.onDone && opts.onDone(all);
      };
      const submit = () => {
        const bad = inputs.findIndex(i => !isFinite(parseNum(i.value)));
        if (bad >= 0) { inputs[bad].focus(); return; }
        grade(false);
      };
      check.addEventListener('click', submit);
      inputs.forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
      show.addEventListener('click', () => grade(true));
      foot.append(check, show);
      box.append(grid, foot);
    }
    box.append(fb);
    if (host) host.append(box);
    typeset(box);
    return box;
  }

  // ---------- topic helpers ----------
  const topicLabel = id => { const t = (window.TOPICS || []).find(x => x.id === id); return t ? t.title : id; };
  const withLabel = q => Object.assign({}, q, { topicLabel: topicLabel(q.topic) });
  const forTopic = id => (window.QUESTIONS || []).filter(q => q.topic === id).map(withLabel);

  // ---------- pop-up quiz ----------
  function closeModal() { const m = document.querySelector('.modal-bg'); if (m) m.remove(); }
  function popup(topic) {
    closeModal();
    const p = prog();
    const pool = forTopic(topic);
    if (!pool.length) return;
    const fresh = pool.filter(q => !(p[q.id] && p[q.id].ok));
    const q = pick(fresh.length ? fresh : pool);
    const bg = h('div', 'modal-bg');
    const m = h('div', 'modal');
    const head = h('div', 'modal-head', '<b>Pop quiz</b>');
    const x = h('button', 'icon-btn', '✕'); x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', closeModal);
    head.append(x); m.append(head);
    const foot = h('div', 'qfoot');
    renderQuestion(q, m, {
      onDone() {
        const more = h('button', 'btn small ghost', 'Another one');
        more.addEventListener('click', () => popup(topic));
        const done = h('button', 'btn small', 'Back to reading');
        done.addEventListener('click', closeModal);
        foot.append(more, done);
      }
    });
    m.append(foot);
    bg.append(m);
    bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); } });
    document.body.append(bg);
  }

  function toast(topic) {
    if (document.querySelector('.toast') || document.querySelector('.modal-bg')) return;
    const t = h('div', 'toast', '<span>Pop quiz: 1 quick question on this topic.</span>');
    const go = h('button', null, 'Try it');
    const x = h('button', 'x', '✕'); x.setAttribute('aria-label', 'Dismiss');
    go.addEventListener('click', () => { t.remove(); popup(topic); });
    x.addEventListener('click', () => t.remove());
    t.append(go, x);
    document.body.append(t);
    setTimeout(() => t.remove(), 20000);
  }

  // Markers: <div class="pop-marker" data-topic="budget"></div>. Fires once when the reader scrolls past one.
  function initPops() {
    const marks = document.querySelectorAll('.pop-marker');
    if (!marks.length || !('IntersectionObserver' in window)) return;
    const seen = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target); io.unobserve(e.target);
          toast(e.target.dataset.topic);
        }
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    marks.forEach(m => io.observe(m));
  }

  // Floating "Quiz me" button on topic pages
  function initFab() {
    const page = document.body.dataset.page;
    if (!page || !forTopic(page).length) return;
    const b = h('button', 'btn fab', 'Quiz me');
    b.addEventListener('click', () => popup(page));
    document.body.append(b);
  }

  // <div class="quiz-set" data-topic="budget"></div> -> all questions for the topic
  function initSets() {
    document.querySelectorAll('.quiz-set').forEach(host => {
      const topic = host.dataset.topic;
      forTopic(topic).forEach(q => renderQuestion(q, host));
    });
    document.querySelectorAll('.num-set').forEach(host => {
      host.dataset.gens.split(',').forEach(g => renderQuestion(genQuestion(g.trim(), host.dataset.label), host));
    });
  }

  // progress bars on cards
  function paintBars() {
    document.querySelectorAll('[data-progress]').forEach(el => {
      const { done, total } = progress(el.dataset.progress);
      const bar = el.querySelector('i'), lab = el.nextElementSibling;
      if (bar) bar.style.width = total ? (100 * done / total) + '%' : '0';
      if (lab && lab.classList.contains('progress-label')) lab.textContent = total ? `${done} of ${total} questions mastered` : 'No questions yet';
    });
  }

  window.Quiz = { renderQuestion, genQuestion, numQuestion: genQuestion, addGen, genMeta, parseNum, gens, genKeys, forTopic, progress, popup, shuffle, pick, paintBars, topicLabel };
  document.addEventListener('DOMContentLoaded', () => { initSets(); initPops(); initFab(); paintBars(); });
})();
