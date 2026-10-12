document.addEventListener('DOMContentLoaded', () => {
  const N = window.NOTATION || [], S = window.NOTATION_STATEMENTS || [];
  const { shuffle, pick } = Quiz;
  const groups = [...new Set(N.map(n => n.g))];
  const wrapTex = t => '\\(' + t + '\\)';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ---------- reference tables ----------
  const ref = document.getElementById('ref');
  groups.forEach(g => {
    ref.append(h('h3', null, g));
    const t = h('table', 'notation', '<tr><th>Symbol</th><th>Meaning</th><th class="ex">Example</th></tr>');
    N.filter(n => n.g === g).forEach(n => t.append(h('tr', null, `<td>${wrapTex(n.tex)}</td><td>${n.en}</td><td class="ex">${n.ex}</td>`)));
    ref.append(t);
  });
  typeset(ref);

  // ---------- shared group chips ----------
  function chips(host, options, onPick, initial) {
    host.innerHTML = '';
    options.forEach(([val, label]) => {
      const b = h('button', 'chip', label); b.setAttribute('aria-pressed', val === initial);
      b.addEventListener('click', () => { host.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b)); onPick(val); });
      host.append(b);
    });
  }

  // ---------- matching game ----------
  (function () {
    const host = document.getElementById('match'), chipHost = document.getElementById('match-chips'), status = document.getElementById('match-status');
    let group = 'all';
    chips(chipHost, [['all', 'All symbols']].concat(groups.map(g => [g, g])), v => { group = v; round(); }, 'all');
    function round() {
      const pool = N.filter(n => group === 'all' || n.g === group);
      const items = shuffle(pool).slice(0, 6);
      host.innerHTML = '';
      const left = h('div', 'col'), right = h('div', 'col');
      let selL = null, selR = null, tries = 0, done = 0;
      const btnL = items.map((it, i) => { const b = h('button', 'choice', wrapTex(it.tex)); b.dataset.i = i; return b; });
      const order = shuffle(items.map((_, i) => i));
      const btnR = order.map(i => { const b = h('button', 'choice', items[i].en); b.dataset.i = i; return b; });
      const clear = () => { btnL.concat(btnR).forEach(b => b.classList.remove('sel')); selL = selR = null; };
      const attempt = () => {
        if (selL == null || selR == null) return;
        tries++;
        if (selL === selR) {
          [btnL[selL], btnR.find(b => +b.dataset.i === selR)].forEach(b => { b.classList.add('done'); b.disabled = true; });
          done++;
        } else {
          const bl = btnL[selL], br = btnR.find(b => +b.dataset.i === selR);
          [bl, br].forEach(b => b.classList.add('shake'));
          setTimeout(() => [bl, br].forEach(b => b.classList.remove('shake')), 500);
        }
        clear();
        status.innerHTML = done === items.length
          ? `<b>Round complete!</b> ${items.length} pairs in ${tries} tries${tries === items.length ? ' (perfect)' : ''}.`
          : `${done} of ${items.length} matched · ${tries} tries`;
        if (done === items.length) { const nb = h('button', 'btn small', 'New round'); nb.style.marginLeft = '10px'; nb.addEventListener('click', round); status.append(nb); }
      };
      btnL.forEach((b, i) => b.addEventListener('click', () => { btnL.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selL = i; attempt(); }));
      btnR.forEach(b => b.addEventListener('click', () => { btnR.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selR = +b.dataset.i; attempt(); }));
      btnL.forEach(b => left.append(b)); btnR.forEach(b => right.append(b));
      host.append(left, right);
      status.textContent = `0 of ${items.length} matched · 0 tries. Tap a symbol, then its meaning.`;
      typeset(host);
    }
    round();
  })();

  // ---------- quick quiz ----------
  (function () {
    const chipHost = document.getElementById('quiz-chips'), host = document.getElementById('quiz'), scoreEl = document.getElementById('quiz-score');
    let mode = 'sym', right = 0, total = 0;
    chips(chipHost, [['sym', 'Symbol → words'], ['words', 'Words → symbol']], v => { mode = v; right = total = 0; next(); }, 'sym');
    function next() {
      host.innerHTML = '';
      const it = pick(N);
      const others = shuffle(N.filter(n => n !== it && n.tex !== it.tex)).slice(0, 3);
      const all = shuffle([it].concat(others));
      const q = mode === 'sym'
        ? { q: `What does ${wrapTex(it.tex)} mean?`, choices: all.map(n => n.en), answer: all.indexOf(it), expl: `${wrapTex(it.tex)}: ${it.en}. ${it.ex}` }
        : { q: `Which symbol means: <em>${it.en}</em>?`, choices: all.map(n => wrapTex(n.tex)), answer: all.indexOf(it), expl: `${it.en}: ${wrapTex(it.tex)}. ${it.ex}` };
      Quiz.renderQuestion(Object.assign({ type: 'mc', topicLabel: 'Notation' }, q), host, {
        onDone(ok) {
          total++; if (ok) right++;
          scoreEl.textContent = `${right} of ${total} correct`;
          const nb = h('button', 'btn small', 'Next question'); nb.style.marginTop = '10px';
          nb.addEventListener('click', next);
          host.lastChild.append(nb);
        }
      });
    }
    scoreEl.textContent = '';
    next();
  })();

  // ---------- read the statement ----------
  (function () {
    const host = document.getElementById('statements');
    const pool = [...new Set(S.map(s => s.ans))];
    let order = shuffle(S.map((_, i) => i)), k = 0;
    function next() {
      host.innerHTML = '';
      const s = S[order[k % order.length]]; k++;
      const others = shuffle(pool.filter(a => a !== s.ans)).slice(0, 3);
      const all = shuffle([s.ans].concat(others));
      Quiz.renderQuestion({
        type: 'mc', topicLabel: 'Read the statement',
        q: `<p>What is this statement?</p><p style="font-size:1.15rem;text-align:center">${wrapTex(s.tex)}</p>`,
        choices: all, answer: all.indexOf(s.ans),
        expl: `It is <b>${s.ans}</b>.`
      }, host, {
        onDone() {
          const nb = h('button', 'btn small', 'Next statement'); nb.style.marginTop = '10px';
          nb.addEventListener('click', next);
          host.lastChild.append(nb);
        }
      });
    }
    next();
  })();
});
