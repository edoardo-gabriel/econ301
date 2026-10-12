// Tiny SVG plotting helper for 2-D economics graphs (no dependencies).
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function niceStep(max, target = 6) {
    const raw = max / target, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }

  class Plot {
    // opts: xmax, ymax, xlabel, ylabel, w, h
    constructor(container, opts) {
      this.o = Object.assign({ xmax: 10, ymax: 10, xlabel: 'a', ylabel: 'b', w: 520, h: 400 }, opts);
      this.pad = { l: 46, r: 16, t: 30, b: 40 };
      this.id = 'clip' + (++uid);
      container.classList.add('plot');
      container.innerHTML = '';
      this.svg = el('svg', { viewBox: `0 0 ${this.o.w} ${this.o.h}`, role: 'img' }, container);
      const defs = el('defs', {}, this.svg);
      this.clip = el('clipPath', { id: this.id }, defs);
      this.clipRect = el('rect', {}, this.clip);
      this.axes = el('g', {}, this.svg);
      this.layer = el('g', { 'clip-path': `url(#${this.id})` }, this.svg);
      this.top = el('g', {}, this.svg); // unclipped labels
      this.setRange(this.o.xmax, this.o.ymax);
    }
    get iw() { return this.o.w - this.pad.l - this.pad.r; }
    get ih() { return this.o.h - this.pad.t - this.pad.b; }
    x(v) { return this.pad.l + (v / this.o.xmax) * this.iw; }
    y(v) { return this.pad.t + this.ih - (v / this.o.ymax) * this.ih; }
    invX(px) { return ((px - this.pad.l) / this.iw) * this.o.xmax; }
    invY(py) { return ((this.pad.t + this.ih - py) / this.ih) * this.o.ymax; }

    setRange(xmax, ymax) {
      this.o.xmax = xmax; this.o.ymax = ymax;
      const { l, t } = this.pad;
      this.clipRect.setAttribute('x', l - 1); this.clipRect.setAttribute('y', t - 4);
      this.clipRect.setAttribute('width', this.iw + 8); this.clipRect.setAttribute('height', this.ih + 5);
      this.axes.innerHTML = '';
      const xs = niceStep(xmax), ys = niceStep(ymax);
      for (let v = 0; v <= xmax + 1e-9; v += xs) {
        el('line', { x1: this.x(v), x2: this.x(v), y1: this.y(0), y2: this.y(ymax), class: 'grid-l' }, this.axes);
        const tx = el('text', { x: this.x(v), y: this.y(0) + 16, 'text-anchor': 'middle', class: 'tick-t' }, this.axes);
        tx.textContent = +v.toFixed(6);
      }
      for (let v = 0; v <= ymax + 1e-9; v += ys) {
        el('line', { x1: this.x(0), x2: this.x(xmax), y1: this.y(v), y2: this.y(v), class: 'grid-l' }, this.axes);
        const ty = el('text', { x: this.x(0) - 8, y: this.y(v) + 4, 'text-anchor': 'end', class: 'tick-t' }, this.axes);
        ty.textContent = +v.toFixed(6);
      }
      el('line', { x1: this.x(0), x2: this.x(xmax), y1: this.y(0), y2: this.y(0), class: 'axis' }, this.axes);
      el('line', { x1: this.x(0), x2: this.x(0), y1: this.y(0), y2: this.y(ymax), class: 'axis' }, this.axes);
      const xl = el('text', { x: this.x(xmax) - 4, y: this.y(0) + 34, 'text-anchor': 'end', class: 'axis-t' }, this.axes);
      xl.textContent = this.o.xlabel;
      const yl = el('text', { x: 6, y: 18, 'text-anchor': 'start', class: 'axis-t' }, this.axes);
      yl.textContent = this.o.ylabel;
      this.clear();
    }

    clear() { this.layer.innerHTML = ''; this.top.innerHTML = ''; }

    // style: {cls:'s1', w:2.5, dash:'6 4', op:1}
    line(x1, y1, x2, y2, s = {}) {
      return el('line', {
        x1: this.x(x1), y1: this.y(y1), x2: this.x(x2), y2: this.y(y2),
        class: s.cls || 'sink', 'stroke-width': s.w || 2.5, 'stroke-dasharray': s.dash || '', opacity: s.op == null ? 1 : s.op, 'stroke-linecap': 'round', fill: 'none'
      }, this.layer);
    }
    path(pts, s = {}) {
      if (pts.length < 2) return null;
      const d = pts.map((p, i) => (i ? 'L' : 'M') + this.x(p[0]).toFixed(1) + ' ' + this.y(p[1]).toFixed(1)).join('');
      return el('path', {
        d, class: s.cls || 'sink', fill: 'none', 'stroke-width': s.w || 2.5, 'stroke-dasharray': s.dash || '',
        opacity: s.op == null ? 1 : s.op, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }, this.layer);
    }
    area(pts, cls = 'fill-set') {
      const d = pts.map((p, i) => (i ? 'L' : 'M') + this.x(p[0]).toFixed(1) + ' ' + this.y(p[1]).toFixed(1)).join('') + 'Z';
      return el('path', { d, class: cls }, this.layer);
    }
    dot(x, y, s = {}) {
      el('circle', { cx: this.x(x), cy: this.y(y), r: (s.r || 6) + 2, class: 'dot-halo' }, this.layer);
      return el('circle', { cx: this.x(x), cy: this.y(y), r: s.r || 6, class: s.cls || 'fink' }, this.layer);
    }
    text(x, y, str, s = {}) {
      const t = el('text', {
        x: this.x(x) + (s.dx || 0), y: this.y(y) + (s.dy || 0), 'text-anchor': s.anchor || 'start', class: 'lab ' + (s.cls || '')
      }, this.top);
      t.textContent = str;
      return t;
    }
    // callback receives data coords; also works for touch/drag (pointer events)
    onPoint(cb, drag = true) {
      const handler = ev => {
        const r = this.svg.getBoundingClientRect();
        const sx = this.o.w / r.width, sy = this.o.h / r.height;
        const px = (ev.clientX - r.left) * sx, py = (ev.clientY - r.top) * sy;
        const dx = this.invX(px), dy = this.invY(py);
        if (dx < -0.02 * this.o.xmax || dy < -0.02 * this.o.ymax || dx > this.o.xmax * 1.02 || dy > this.o.ymax * 1.02) return;
        cb(Math.max(0, dx), Math.max(0, dy));
      };
      let down = false;
      this.svg.style.cursor = 'crosshair';
      this.svg.addEventListener('pointerdown', ev => { down = true; handler(ev); try { this.svg.setPointerCapture(ev.pointerId); } catch (e) { /* */ } });
      if (drag) this.svg.addEventListener('pointermove', ev => { if (down) handler(ev); });
      const up = () => { down = false; };
      this.svg.addEventListener('pointerup', up);
      this.svg.addEventListener('pointercancel', up);
    }
  }

  window.Plot = Plot;
})();
