// Shared page chrome, storage, math typesetting, and small UI helpers.
(function () {
  'use strict';

  // ---------- storage (safe if blocked) ----------
  const Store = {
    get(k, d) { try { const v = localStorage.getItem('e301-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('e301-' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  // ---------- math ----------
  function typeset(el) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el || document.body, {
          delimiters: [
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) { /* ignore */ }
    }
  }

  // ---------- header / footer ----------
  function buildChrome() {
    const page = document.body.dataset.page || '';
    const topics = window.TOPICS || [];
    const link = (href, id, text) =>
      `<a href="${href}"${page === id ? ' aria-current="page"' : ''}>${text}</a>`;
    const live = topics.filter(t => t.status !== 'soon');
    const item = t =>
      `<a href="${t.href}"${page === t.id ? ' aria-current="page"' : ''}><span>${t.title}</span>` +
      `${t.status === 'new' ? '<em class="tag new">NEW</em>' : ''}<small>Week ${t.week}</small></a>`;
    const col = ex => `<div class="dd-col"><h4>Midterm ${ex}</h4>${live.filter(t => (t.exam || 1) === ex).map(item).join('')}</div>`;
    const refs = window.REFERENCE || [];
    const refCol = refs.length
      ? `<div class="dd-col"><h4>Reference</h4>${refs.map(t => `<a href="${t.href}"${page === t.id ? ' aria-current="page"' : ''}><span>${t.title}</span></a>`).join('')}</div>` : '';
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      `<div class="bar">
        <a class="brand" href="index.html">Econ 301<span> · Study Hub</span></a>
        <nav class="nav" aria-label="Main">
          <div class="dd">
            <button class="dd-btn${live.concat(refs).some(t => t.id === page) ? ' on' : ''}" aria-haspopup="true" aria-expanded="false">Topics <i>▾</i></button>
            <div class="dd-panel"><div class="dd-inner three">${col(1)}${col(2)}${refCol}</div></div>
          </div>
          ${link('practice.html', 'practice', 'Exercises')}
          ${link('about.html', 'about', 'About')}
        </nav>
        <button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode" title="Toggle dark mode">◐</button>
      </div>`;
    document.body.prepend(header);

    // Topics menu: opens on hover (CSS), and on tap/click/Enter for touch and keyboard users.
    const dd = header.querySelector('.dd'), ddBtn = dd.querySelector('.dd-btn');
    const panel = dd.querySelector('.dd-panel');
    // keep the menu inside the window: if it would run past the right edge, slide it left
    const fit = () => {
      panel.style.left = '';
      if (window.innerWidth <= 640) return;
      const over = panel.getBoundingClientRect().right - (document.documentElement.clientWidth - 12);
      if (over > 0) panel.style.left = (-over) + 'px';
    };
    dd.addEventListener('mouseenter', () => requestAnimationFrame(fit));
    window.addEventListener('resize', fit);
    const setOpen = o => { dd.classList.toggle('open', o); ddBtn.setAttribute('aria-expanded', String(o)); if (o) requestAnimationFrame(fit); };
    ddBtn.addEventListener('click', e => { e.stopPropagation(); setOpen(!dd.classList.contains('open')); });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

    document.getElementById('theme-btn').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      if (window.saveTheme) window.saveTheme(next);
      window.dispatchEvent(new Event('themechange'));
    });

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.textContent = 'ECON 301 · Fall 2026 · Unofficial study aid by your TA. Your progress is saved only in this browser.';
    document.body.append(footer);

    // prev/next links between topics
    const holder = document.getElementById('pagenav');
    if (holder) {
      const live = topics.filter(t => t.status !== 'soon');
      const i = live.findIndex(t => t.id === page);
      const prev = live[i - 1], next = live[i + 1];
      holder.className = 'pagenav';
      holder.innerHTML =
        (prev ? `<a href="${prev.href}">← ${prev.title}</a>` : '<span></span>') +
        (next ? `<a href="${next.href}">${next.title} →</a>` : '<a href="practice.html">Exercises →</a>');
    }
  }

  // ---------- controls ----------
  const UI = {
    // slider(parent, {label, min, max, step, value, fmt, onInput}) -> {el, get, set}
    slider(parent, o) {
      const lab = document.createElement('label');
      const fmt = o.fmt || (v => v);
      lab.innerHTML = `<span>${o.label}</span><b></b><input type="range">`;
      const inp = lab.querySelector('input'), out = lab.querySelector('b');
      inp.min = o.min; inp.max = o.max; inp.step = o.step || 1; inp.value = o.value;
      const upd = () => { out.textContent = fmt(+inp.value); };
      inp.addEventListener('input', () => { upd(); o.onInput && o.onInput(+inp.value); });
      upd();
      parent.append(lab);
      typeset(lab);
      return { el: lab, get: () => +inp.value, set(v) { inp.value = v; upd(); }, setRange(mn, mx) { inp.min = mn; inp.max = mx; upd(); } };
    },
    select(parent, o) {
      const lab = document.createElement('label');
      lab.innerHTML = `<span>${o.label}</span><span></span><select></select>`;
      lab.style.gridTemplateColumns = '1fr';
      const sel = lab.querySelector('select');
      sel.style.gridColumn = '1 / -1';
      o.options.forEach(([v, t]) => { const op = document.createElement('option'); op.value = v; op.textContent = t; sel.append(op); });
      sel.value = o.value;
      sel.addEventListener('change', () => o.onChange(sel.value));
      parent.append(lab);
      return { el: lab, get: () => sel.value, set(v) { sel.value = v; } };
    },
    button(parent, text, onClick, cls) {
      const b = document.createElement('button');
      b.className = 'btn small ' + (cls || 'ghost');
      b.textContent = text;
      b.addEventListener('click', onClick);
      parent.append(b);
      return b;
    },
    readout(parent) {
      const d = document.createElement('div');
      d.className = 'readout';
      parent.append(d);
      return { el: d, set(html) { d.innerHTML = html; typeset(d); } };
    }
  };

  // number formatting helpers
  const fmt = (x, d = 2) => {
    if (!isFinite(x)) return '—';
    const r = Math.round(x * 10 ** d) / 10 ** d;
    return String(Object.is(r, -0) ? 0 : r);
  };

  window.Store = Store; window.UI = UI; window.typeset = typeset; window.fmt = fmt;
  document.addEventListener('DOMContentLoaded', () => {
    buildChrome();
    typeset(document.body);
  });
})();
