document.addEventListener('DOMContentLoaded', () => {
  const chipsHost = document.getElementById('chips');
  const list = document.getElementById('qlist');
  const stats = document.getElementById('stats');
  let topic = 'all', kind = 'all';

  const topics = [{ id: 'all', title: 'All topics' }].concat(window.TOPICS.filter(t => t.status !== 'soon'));
  topics.forEach(t => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = t.title; b.setAttribute('aria-pressed', t.id === 'all');
    b.addEventListener('click', () => { topic = t.id; chipsHost.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b)); render(); });
    chipsHost.append(b);
  });

  function updateStats() {
    const p = Quiz.progress();
    stats.textContent = `${p.done} of ${p.total} questions mastered (answered correctly at least once)`;
  }

  function render() {
    list.innerHTML = '';
    let qs = Quiz.forTopic(null);
    qs = (window.QUESTIONS || []).filter(q => topic === 'all' || q.topic === topic).map(q => Object.assign({}, q, { topicLabel: Quiz.topicLabel(q.topic) }));
    qs.forEach(q => Quiz.renderQuestion(q, list, { onDone: updateStats }));
    updateStats();
  }

  // ---- mock quiz ----
  let scope = 0;
  const sc = document.getElementById('mock-scope');
  [[0, 'Everything'], [1, 'Midterm 1'], [2, 'Midterm 2']].forEach(([v, t]) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = t; b.setAttribute('aria-pressed', v === 0);
    b.addEventListener('click', () => { scope = v; sc.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b)); });
    sc.append(b);
  });
  const mockHost = document.getElementById('mock');
  document.getElementById('mock-btn').addEventListener('click', () => {
    const N = 10;
    const ex = t => (window.TOPICS.find(x => x.id === t) || {}).exam || 1;
    const pool = Quiz.shuffle(window.QUESTIONS.filter(q => scope === 0 || ex(q.topic) === scope)).slice(0, N);
    mockHost.innerHTML = '';
    let answered = 0, right = 0;
    const score = document.createElement('div');
    score.className = 'callout';
    score.innerHTML = `<span class="label">Mock quiz</span><p>${N} random questions. Your score appears when you finish.</p>`;
    mockHost.append(score);
    pool.forEach(q => Quiz.renderQuestion(Object.assign({}, q, { id: null, topicLabel: Quiz.topicLabel(q.topic) }), mockHost, {
      onDone(ok) {
        answered++; if (ok) right++;
        if (answered === pool.length) {
          score.innerHTML = `<span class="label">Done</span><p class="score">${right} / ${pool.length}</p><p>${right >= 8 ? 'Great work.' : right >= 5 ? 'Solid. Review the explanations for the ones you missed.' : 'Revisit the topic pages, then try again.'}</p>`;
          score.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }));
    mockHost.scrollIntoView({ behavior: 'smooth' });
  });

  // ---- endless drills ----
  const drillHost = document.getElementById('drill');
  const labels = { cd: 'Cobb-Douglas optimum', pc: 'Perfect complements optimum', ps: 'Perfect substitutes optimum', mrs: 'Compute the MRS', intercept: 'Budget intercepts', market: 'Market demand', elas: 'Own-price elasticity', incel: 'Income elasticity', crossel: 'Cross-price elasticity', sub: 'Substitution & income effects' };
  const dchips = document.getElementById('drill-chips');
  Quiz.genKeys.forEach(k => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = labels[k] || k; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      dchips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b));
      drillHost.innerHTML = '';
      Quiz.renderQuestion(Quiz.numQuestion(k, labels[k]), drillHost);
    });
    dchips.append(b);
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Erase your saved progress on this device?')) { Store.set('prog', {}); render(); }
  });

  render();
});
