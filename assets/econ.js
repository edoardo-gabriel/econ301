// Consumer-theory math used by the interactive widgets.
// Utility types (params p = {al, be}):
//   cd : a^al * b^be        ps : al*a + be*b        pc : min{al*a, be*b}
//   sq : sqrt(a)+sqrt(b)    cv : a^2 + b^2 (NOT convex; for the convexity demo)
(function () {
  'use strict';

  const Econ = {
    names: {
      cd: 'Cobb-Douglas', ps: 'Perfect substitutes', pc: 'Perfect complements',
      sq: 'Concave root utility', cv: 'Non-convex preferences', ql: 'Quasilinear'
    },

    tex(type, p) {
      const a = p.al, b = p.be, c = v => (v === 1 ? '' : v);
      switch (type) {
        case 'cd': return `u(a,b)=a^{${a}}b^{${b}}`.replace(/\^\{1\}/g, '');
        case 'ps': return `u(a,b)=${c(a)}a+${c(b)}b`;
        case 'pc': return `u(a,b)=\\min\\{${c(a)}a,\\,${c(b)}b\\}`;
        case 'sq': return 'u(a,b)=\\sqrt{a}+\\sqrt{b}';
        case 'cv': return 'u(a,b)=a^2+b^2';
        case 'ql': return 'u(a,b)=\\sqrt{a}+b';
      }
    },

    util(type, p, a, b) {
      switch (type) {
        case 'cd': return Math.pow(a, p.al) * Math.pow(b, p.be);
        case 'ps': return p.al * a + p.be * b;
        case 'pc': return Math.min(p.al * a, p.be * b);
        case 'sq': return Math.sqrt(a) + Math.sqrt(b);
        case 'cv': return a * a + b * b;
        case 'ql': return Math.sqrt(a) + b;
      }
    },

    // marginal utilities [MUa, MUb]; null where undefined (kink / origin)
    mu(type, p, a, b) {
      switch (type) {
        case 'cd': return (a > 0 && b > 0) ? [p.al * Math.pow(a, p.al - 1) * Math.pow(b, p.be), p.be * Math.pow(a, p.al) * Math.pow(b, p.be - 1)] : null;
        case 'ps': return [p.al, p.be];
        case 'pc': {
          const x = p.al * a, y = p.be * b;
          if (Math.abs(x - y) < 1e-9) return null;
          return x < y ? [p.al, 0] : [0, p.be];
        }
        case 'sq': return (a > 0 && b > 0) ? [0.5 / Math.sqrt(a), 0.5 / Math.sqrt(b)] : null;
        case 'cv': return [2 * a, 2 * b];
        case 'ql': return a > 0 ? [0.5 / Math.sqrt(a), 1] : null;
      }
    },

    // |MRS_ab| = MUa/MUb; null if undefined
    mrs(type, p, a, b) {
      const m = Econ.mu(type, p, a, b);
      if (!m || m[1] === 0) return null;
      return m[0] / m[1];
    },

    // Utility-maximizing bundle at prices pa, pb and income Y. Returns {a,b,u,tie,kind}.
    optimal(type, p, pa, pb, Y) {
      let a, b, tie = false, kind = 'interior';
      if (type === 'cd') {
        a = p.al * Y / ((p.al + p.be) * pa);
        b = p.be * Y / ((p.al + p.be) * pb);
      } else if (type === 'pc') {
        a = Y * p.be / (p.be * pa + p.al * pb);
        b = p.al * a / p.be;
        kind = 'kink';
      } else if (type === 'ps') {
        const ra = p.al / pa, rb = p.be / pb;
        if (Math.abs(ra - rb) < 1e-9) { tie = true; a = Y / pa; b = 0; kind = 'tie'; }
        else if (ra > rb) { a = Y / pa; b = 0; kind = 'corner'; }
        else { a = 0; b = Y / pb; kind = 'corner'; }
      }
      if (type === 'ql') {
        const ai = Math.pow(pb / (2 * pa), 2);
        if (pa * ai <= Y) { a = ai; b = (Y - pa * ai) / pb; } else { a = Y / pa; b = 0; kind = 'corner'; }
      }
      return { a, b, u: Econ.util(type, p, a, b), tie, kind };
    },

    // Points on the indifference curve u(a,b)=level within [0,xmax]x[0,ymax] (extends past axes; plot clips).
    ic(type, p, level, xmax, ymax) {
      const pts = [], N = 160;
      const big = Math.max(xmax, ymax) * 3;
      switch (type) {
        case 'cd': {
          const a0 = Math.pow(level / Math.pow(big, p.be), 1 / p.al);
          const lo = Math.max(a0, xmax * 1e-3), hi = xmax * 1.05;
          for (let i = 0; i <= N; i++) {
            const a = lo * Math.pow(hi / lo, i / N);
            pts.push([a, Math.pow(level / Math.pow(a, p.al), 1 / p.be)]);
          }
          return pts;
        }
        case 'ps':
          return [[0, level / p.be], [level / p.al, 0]];
        case 'pc':
          return [[level / p.al, big], [level / p.al, level / p.be], [big, level / p.be]];
        case 'sq': {
          const amax = Math.min(level * level, xmax * 1.05);
          for (let i = 0; i <= N; i++) {
            const a = amax * i / N, r = level - Math.sqrt(a);
            pts.push([a, r * r]);
          }
          return pts;
        }
        case 'ql': {
          const amax = Math.min(level * level, xmax * 1.05);
          for (let i = 0; i <= N; i++) { const a = amax * i / N; pts.push([a, level - Math.sqrt(a)]); }
          return pts;
        }
        case 'cv': {
          const r = Math.sqrt(level);
          for (let i = 0; i <= N; i++) {
            const a = r * i / N;
            pts.push([a, Math.sqrt(Math.max(0, level - a * a))]);
          }
          return pts;
        }
      }
    },

    // Compensated bundle: cheapest bundle on the indifference curve u = u0 at prices (pa, pb).
    compensated(type, p, pa, pb, u0) {
      const X = Math.max;
      switch (type) {
        case 'cd': {
          const r = p.be * pa / (p.al * pb);           // b = r a at the tangency
          const a = Math.pow(u0 / Math.pow(r, p.be), 1 / (p.al + p.be));
          return { a, b: r * a };
        }
        case 'pc': return { a: u0 / p.al, b: u0 / p.be };
        case 'ps': {
          if (p.al / pa >= p.be / pb) return { a: u0 / p.al, b: 0 };
          return { a: 0, b: u0 / p.be };
        }
        case 'ql': {
          const a = Math.pow(pb / (2 * pa), 2), b = u0 - Math.sqrt(a);
          return b >= 0 ? { a, b } : { a: u0 * u0, b: 0 };
        }
      }
    },

    // Does a budget line pass? cost of bundle.
    cost(pa, pb, a, b) { return pa * a + pb * b; },

    // Demand for good a under (type,p) at income Y, price of b pb, price of a pa (single-valued cases / tie -> returns null).
    demandA(type, p, pa, pb, Y) {
      const o = Econ.optimal(type, p, pa, pb, Y);
      return o.tie ? null : o.a;
    }
  };

  window.Econ = Econ;
})();
