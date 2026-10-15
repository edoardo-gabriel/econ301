// Notation data for the "Math notation" page. Append rows to add symbols.
//   g: group   tex: the symbol (LaTeX)   en: plain-English meaning   ex: a short example
(function () {
  'use strict';
  const R = String.raw;
  window.NOTATION = [
    // ---------------- logic and sets ----------------
    { g: 'Logic and sets', tex: R`\forall`, en: 'for all / for every', ex: R`\(\forall x\in X\): the statement holds for every \(x\) in \(X\)` },
    { g: 'Logic and sets', tex: R`\exists`, en: 'there exists', ex: R`\(\exists\,x\): at least one \(x\) works` },
    { g: 'Logic and sets', tex: R`\nexists`, en: 'there does not exist', ex: R`\(\nexists\,x\): no \(x\) works` },
    { g: 'Logic and sets', tex: R`\in`, en: 'is an element of', ex: R`\(a\in A\): \(a\) is one of the members of \(A\)` },
    { g: 'Logic and sets', tex: R`B\subseteq A`, en: 'B is a subset of A (every element of B is also in A)', ex: R`a smaller budget set is a subset of a larger one` },
    { g: 'Logic and sets', tex: R`P\Rightarrow Q`, en: 'P implies Q (if P is true, then Q is true)', ex: R`\(P\) is <em>sufficient</em> for \(Q\); \(Q\) is <em>necessary</em> for \(P\)` },
    { g: 'Logic and sets', tex: R`P\Leftarrow Q`, en: 'Q implies P (P is necessary for Q)', ex: R`the arrow points at what is implied` },
    { g: 'Logic and sets', tex: R`P\Longleftrightarrow Q`, en: 'P if and only if Q (each implies the other)', ex: R`\(u(X)\ge u(Y)\iff X\succeq Y\)` },
    { g: 'Logic and sets', tex: R`\{a,b\}`, en: 'the set containing a and b', ex: R`\(C(\{a,b\})\) is the choice from the set \(\{a,b\}\)` },
    { g: 'Logic and sets', tex: R`\mathbb R_+`, en: 'the nonnegative real numbers, [0, ∞)', ex: R`quantities of goods live in \(\mathbb R_+\) (you can't consume a negative amount)` },
    { g: 'Logic and sets', tex: R`\mathbb R_+^2`, en: 'all pairs (a, b) of nonnegative numbers: every possible bundle', ex: R`the budget set is a subset of \(\mathbb R_+^2\)` },

    // ---------------- preferences ----------------
    { g: 'Preferences', tex: R`(a,b)`, en: 'a bundle: a units of good a and b units of good b', ex: R`\((2,5)\) is 2 units of \(a\) and 5 units of \(b\)` },
    { g: 'Preferences', tex: R`X`, en: 'the set of all available options or bundles', ex: R`\(\forall x,y,z\in X\ldots\)` },
    { g: 'Preferences', tex: R`\succeq`, en: 'is weakly preferred to / is at least as good as', ex: R`\(X\succeq Y\): the consumer likes \(X\) at least as much as \(Y\)` },
    { g: 'Preferences', tex: R`\succ`, en: 'is strictly preferred to / is better than', ex: R`\(X\succ Y\): \(X\) is better than \(Y\)` },
    { g: 'Preferences', tex: R`\sim`, en: 'is indifferent to / is equally good as', ex: R`\((1,5)\sim(5,1)\): she is equally happy with either` },
    { g: 'Preferences', tex: R`C(A)`, en: 'the choice function: the option chosen from the set A', ex: R`\(C(a,b)=b\): faced with \(a\) and \(b\), she picks \(b\)` },
    { g: 'Preferences', tex: R`u(a,b)`, en: 'the utility function: gives each bundle a number (bigger = better)', ex: R`\(u(a,b)=ab\)` },
    { g: 'Preferences', tex: R`u(X)\ge u(Y)\iff X\succeq Y`, en: 'u represents the preferences', ex: R`only the ranking matters, not the size of the numbers` },

    // ---------------- utility, slopes, transformations ----------------
    { g: 'Utility and slopes', tex: R`\partial`, en: 'a partial derivative: change one variable, hold the others fixed', ex: R`\(\partial u/\partial a\)` },
    { g: 'Utility and slopes', tex: R`MU_a=\dfrac{\partial u}{\partial a}`, en: 'marginal utility of a: the extra utility from one more unit of a', ex: R`more is better \(\Rightarrow MU_a\ge0\)` },
    { g: 'Utility and slopes', tex: R`\mathrm{MRS}_{ab}=-\dfrac{MU_a}{MU_b}`, en: 'marginal rate of substitution: the slope of the indifference curve', ex: R`how many units of \(b\) she would give up for one more \(a\)` },
    { g: 'Utility and slopes', tex: R`|\mathrm{MRS}_{ab}|`, en: 'the size of the MRS (a positive number)', ex: R`convex preferences: \(|\mathrm{MRS}_{ab}|\) falls as \(a\) rises` },
    { g: 'Utility and slopes', tex: R`\min\{x,y\}`, en: 'the smaller of x and y', ex: R`\(u=\min\{a,2b\}\): perfect complements` },
    { g: 'Utility and slopes', tex: R`a^{\alpha}b^{\beta}`, en: 'Cobb-Douglas utility', ex: R`spends the share \(\frac{\alpha}{\alpha+\beta}\) of income on \(a\)` },
    { g: 'Utility and slopes', tex: R`g(u)`, en: 'a transformation of utility; it keeps the same preferences if g is strictly increasing', ex: R`\(\sqrt u\), \(u^2\), \(3u+7\), \(\ln u\)` },

    // ---------------- budget and optimal choice ----------------
    { g: 'Budget and choice', tex: R`p_a,\ p_b`, en: 'the prices of good a and good b', ex: R`\(p_a=2\) dollars per unit of \(a\)` },
    { g: 'Budget and choice', tex: R`Y`, en: 'income (the consumer\'s budget)', ex: R`\(Y=20\)` },
    { g: 'Budget and choice', tex: R`p_a a+p_b b\le Y`, en: 'the budget constraint: spending cannot exceed income', ex: R`\(2a+4b\le20\)` },
    { g: 'Budget and choice', tex: R`B`, en: 'the budget set: all affordable bundles', ex: R`\(B=\{(a,b)\in\mathbb R_+^2:\ p_aa+p_bb\le Y\}\)` },
    { g: 'Budget and choice', tex: R`\dfrac{p_a}{p_b}`, en: 'the price ratio: the market\'s relative value of a (units of b given up per unit of a)', ex: R`the (negative of the) slope of the budget line` },
    { g: 'Budget and choice', tex: R`a^*,\ b^*`, en: 'the optimal quantities of a and b', ex: R`\((a^*,b^*)\) is the optimal bundle` },
    { g: 'Budget and choice', tex: R`|\mathrm{MRS}_{ab}|=\dfrac{p_a}{p_b}`, en: 'the optimality condition: her relative value equals the market\'s (interior optimum)', ex: R`if \(|\mathrm{MRS}|>p_a/p_b\), buy more \(a\)` },

    // ---------------- demand and elasticity ----------------
    { g: 'Demand and elasticity', tex: R`D_a(p_a)`, en: 'the demand curve: the optimal quantity of a at price p_a', ex: R`Cobb-Douglas: \(D_a=\frac{\alpha}{\alpha+\beta}\frac{Y}{p_a}\)` },
    { g: 'Demand and elasticity', tex: R`Q`, en: 'quantity demanded', ex: R`\(Q=60-3P\)` },
    { g: 'Demand and elasticity', tex: R`\Delta`, en: 'a change in', ex: R`\(\Delta Q\): the change in quantity` },
    { g: 'Demand and elasticity', tex: R`\%\Delta Q`, en: 'the percentage change in quantity', ex: R`\(\frac{\Delta Q}{Q}\times100\)` },
    { g: 'Demand and elasticity', tex: R`\varepsilon=\dfrac{dQ}{dP}\cdot\dfrac PQ`, en: 'own-price elasticity of demand: % change in quantity per 1% change in its own price', ex: R`\(|\varepsilon|>1\): elastic` },
    { g: 'Demand and elasticity', tex: R`\varepsilon_{ab}`, en: 'cross-price elasticity: response of the demand for a to the price of b', ex: R`positive: substitutes; negative: complements` },
    { g: 'Demand and elasticity', tex: R`\eta`, en: 'income elasticity of demand: % change in quantity per 1% change in income', ex: R`negative: inferior; above 1: luxury` },
    { g: 'Demand and elasticity', tex: R`SE,\ IE`, en: 'the substitution effect and the income effect of a price change', ex: R`total effect \(=SE+IE\)` },

    // ---------------- production and profit ----------------
    { g: 'Production and profit', tex: R`q`, en: 'the firm\'s output', ex: R`\(q\ge0\)` },
    { g: 'Production and profit', tex: R`\pi(q)=R(q)-C(q)`, en: 'profit: revenue minus cost', ex: R`a price taker has \(R(q)=pq\)` },
    { g: 'Production and profit', tex: R`MR=\dfrac{dR}{dq},\ \ MC=\dfrac{dC}{dq}`, en: 'marginal revenue and marginal cost: the extra revenue and cost of one more unit', ex: R`at an interior optimum, \(MR=MC\)` },
    { g: 'Production and profit', tex: R`p=MC(q^*)`, en: 'the profit-maximizing condition for a price taker (needs q* > 0)', ex: R`if \(p&lt;MC(0)\), then \(q^*=0\)` },
    { g: 'Production and profit', tex: R`F(K,L)`, en: 'the production function: output from capital K and labor L', ex: R`\(F(K,L)=K^{1/3}L^{1/2}\)` },
    { g: 'Production and profit', tex: R`MP_K,\ MP_L`, en: 'marginal products: the extra output from one more unit of capital or labor', ex: R`\(MP_L=\partial F/\partial L\)` },
    { g: 'Production and profit', tex: R`MRTS_{KL}=-\dfrac{MP_K}{MP_L}`, en: 'marginal rate of technical substitution: the slope of the isoquant', ex: R`labor the firm can give up for one more unit of capital` },
    { g: 'Production and profit', tex: R`F(xK,xL)\ \gtreqless\ xF(K,L)`, en: 'returns to scale: > is increasing, = is constant, < is decreasing', ex: R`Cobb-Douglas: compare \(\alpha+\beta\) with 1` }
  ];

  // "Read the statement": formal statement -> what is it called?
  window.NOTATION_STATEMENTS = [
    { tex: R`\forall\, x,y,z\in X,\ \text{if } x\succeq y \text{ and } y\succeq z \text{ then } x\succeq z`, ans: 'Transitivity' },
    { tex: R`\forall\, x,y\in X:\ x\succeq y \ \text{ or } \ y\succeq x`, ans: 'Completeness' },
    { tex: R`(1,5)\sim(5,1)\ \Rightarrow\ (3,3)\succeq(1,5)`, ans: 'Convexity' },
    { tex: R`a_1\ge a_2 \text{ and } b_1\ge b_2 \ \Rightarrow\ (a_1,b_1)\succeq(a_2,b_2)`, ans: 'More is better' },
    { tex: R`|\mathrm{MRS}_{ab}| \text{ is decreasing in } a`, ans: 'Convexity' },
    { tex: R`u(X)\ge u(Y)\iff X\succeq Y`, ans: 'u represents the preferences' },
    { tex: R`v=g(u),\ \ g \text{ strictly increasing}`, ans: 'A positive monotonic transformation (same preferences)' },
    { tex: R`p_a a+p_b b\le Y`, ans: 'The budget constraint' },
    { tex: R`|\mathrm{MRS}_{ab}|=\dfrac{p_a}{p_b}`, ans: 'The optimality condition (interior optimum)' },
    { tex: R`\mathrm{MRS}_{ab}=-\dfrac{MU_a}{MU_b}`, ans: 'Definition of the MRS' }
  ];
})();
