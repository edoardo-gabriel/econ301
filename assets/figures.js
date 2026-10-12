// Number-free graphs for "read the graph" questions (like the figures on the exam).
// Figures.draw(hostElement, spec) draws spec.kind into the element.
//   cross : budget line + indifference curve through bundle A (A on the line, spec.f = position along it)
//   which : four labelled bundles with their indifference curves; which one is optimal?
//   shape : three indifference curves of one utility type
//   shift : an original (dashed) and a new (solid) budget line
//   pick  : tap a bundle on the new budget line that could be the new optimal choice
(function () {
  'use strict';
  const W = 440, H = 330;
  const mk = (host, xmax, ymax) => new Plot(host, { xmax, ymax, w: W, h: H, ticks: false });
  const CD = (al, be) => ({ al, be });

  // Revealed-preference rule for the "pick" figure.
  // Old choice A was optimal at old prices/income. A new choice X on the new budget line is consistent with
  // rational preferences unless A is still affordable AND X was strictly inside the old budget (then A would be strictly better).
  function pickValid(s, a, b) {
    const o = s.old, n = s.nw, A = s.A;
    const aAffordable = n.pa * A[0] + n.pb * A[1] <= n.Y + 1e-9;
    if (!aAffordable) return true;
    return o.pa * a + o.pb * b >= o.Y - 1e-9;
  }

  const K = {
    cross(host, s) {
      const ia = s.Y / s.pa, ib = s.Y / s.pb;
      const P = mk(host, ia * 1.18, ib * 1.18);
      const A = [s.f * ia, (1 - s.f) * ib];
      P.line(0, ib, ia, 0, { cls: 'sink', w: 2.6 });
      if (s.show !== 'budget') {
        const p = CD(s.al, s.be), u = Econ.util('cd', p, A[0], A[1]);
        P.path(Econ.ic('cd', p, u, P.o.xmax, P.o.ymax), { cls: 's1', w: 2.8 });
      }
      P.dot(A[0], A[1], { cls: 'fink', r: 5.5 });
      P.text(A[0], A[1], s.label || 'A', { dx: 10, dy: -10 });
      return { plot: P };
    },

    which(host, s) {
      const p = CD(s.al, s.be), ia = s.Y / s.pa, ib = s.Y / s.pb, fs = s.al / (s.al + s.be);
      const onLine = f => [f * ia, (1 - f) * ib];
      const coords = { T: onLine(fs), S: onLine(s.fS), I: onLine(s.fI).map(v => v * 0.6), O: onLine(fs).map(v => v * 1.4) };
      const P = mk(host, ia * 1.6, ib * 1.6);
      P.line(0, ib, ia, 0, { cls: 'sink', w: 2.6 });
      s.pts.forEach(pt => {
        const [a, b] = coords[pt.k];
        P.path(Econ.ic('cd', p, Econ.util('cd', p, a, b), P.o.xmax, P.o.ymax), { cls: 's1', w: 1.8, op: 0.5 });
      });
      s.pts.forEach(pt => {
        const [a, b] = coords[pt.k];
        P.dot(a, b, { cls: 'fink', r: 5 });
        P.text(a, b, pt.l, { dx: 9, dy: -9 });
      });
      return { plot: P, coords };
    },

    shape(host, s) {
      const P = mk(host, 10, 10);
      const d = {
        cd: [CD(1, 1), [6, 16, 30]],
        ps: [CD(s.al || 1, s.be || 1), (s.al || 1) > (s.be || 1) ? [6, 12, 18] : [3, 6, 9]],
        pc: [CD(s.al || 1, s.be || 1), [2, 4, 6]],
        cv: [CD(1, 1), [16, 49, 100]]
      }[s.type];
      d[1].forEach(level => P.path(Econ.ic(s.type, d[0], level, 10, 10), { cls: 's1', w: 2.8 }));
      return { plot: P };
    },

    shift(host, s) {
      const f = s.from, t = s.to;
      const xm = Math.max(f.Y / f.pa, t.Y / t.pa) * 1.12, ym = Math.max(f.Y / f.pb, t.Y / t.pb) * 1.12;
      const P = mk(host, xm, ym);
      P.line(0, f.Y / f.pb, f.Y / f.pa, 0, { cls: 'smuted', dash: '7 6', w: 2.4 });
      P.line(0, t.Y / t.pb, t.Y / t.pa, 0, { cls: 'sink', w: 2.8 });
      return { plot: P };
    },

    pick(host, s) {
      const o = s.old, n = s.nw, A = s.A;
      const P = mk(host, Math.max(o.Y / o.pa, n.Y / n.pa) * 1.12, Math.max(o.Y / o.pb, n.Y / n.pb) * 1.12);
      let sel = null;
      const cbs = [];
      const statics = () => {
        P.clear();
        P.line(0, o.Y / o.pb, o.Y / o.pa, 0, { cls: 'smuted', dash: '7 6', w: 2.2 });
        P.line(0, n.Y / n.pb, n.Y / n.pa, 0, { cls: 'sink', w: 2.8 });
        P.dot(A[0], A[1], { cls: 'f1', r: 5.5 });
        P.text(A[0], A[1], 'A', { dx: 10, dy: -10, cls: 'c1' });
      };
      const redraw = () => { statics(); if (sel) P.dot(sel[0], sel[1], { cls: 'f2', r: 6.5 }); };
      P.onPoint(x => {
        const a = Math.min(Math.max(x, 0), n.Y / n.pa);
        sel = [a, (n.Y - n.pa * a) / n.pb];
        redraw(); cbs.forEach(f => f());
      }, true);
      redraw();
      return {
        plot: P,
        onSelect: f => cbs.push(f),
        check: () => !!sel && pickValid(s, sel[0], sel[1]),
        reveal(ok) {
          statics();
          let run = [];
          const flush = () => { if (run.length > 1) P.path(run, { cls: 's3', w: 8, op: 0.55 }); run = []; };
          for (let i = 0; i <= 240; i++) {
            const a = (n.Y / n.pa) * i / 240, b = (n.Y - n.pa * a) / n.pb;
            if (pickValid(s, a, b)) run.push([a, b]); else flush();
          }
          flush();
          if (sel) P.dot(sel[0], sel[1], { cls: ok ? 'f3' : 'f2', r: 6.5 });
        }
      };
    }
  };

  function draw(host, spec) {
    const f = K[spec.kind];
    if (!f) throw new Error('unknown figure kind: ' + spec.kind);
    return f(host, spec);
  }

  window.Figures = { draw, pickValid };
})();
