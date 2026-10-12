// Question bank. Weekly update point #2: append objects to the array below.
//
//  topic:   one of the ids in topics.js
//  type:    'mc'  -> choices[], answer = index of the correct choice (choices are shuffled on screen)
//           'tf'  -> items[{t, a:true|false}], correct only if every statement is right
//  q:       question text (HTML allowed). Write math as \( ... \) and use R`...` so backslashes survive.
//  expl:    explanation shown after answering (HTML allowed)
(function () {
  'use strict';
  const R = String.raw;
  const MRS = R`\mathrm{MRS}_{ab}`;

  window.QUESTIONS = [
    // ============================ PREFERENCES & CHOICE ============================
    {
      id: 'q01', topic: 'preferences', type: 'tf',
      q: R`<strong>True or false?</strong>`,
      items: [
        { t: R`Rational preferences are complete and transitive.`, a: true },
        { t: R`Completeness rules out indifference between distinct bundles.`, a: false },
        { t: R`A price taker can change the market price by changing her own quantity purchased.`, a: false },
        { t: R`With infinitely divisible goods and a constant unit price of $3, buying 1.5 units is allowed and costs $4.50.`, a: true }
      ],
      expl: R`Rationality means <em>complete + transitive</em>. Completeness only says any two bundles can be compared, so indifference is allowed. A price taker treats prices as given. Divisibility permits 1.5 units, costing \(3(1.5)=4.50\).`
    },
    {
      id: 'q02', topic: 'preferences', type: 'mc',
      q: R`A consumer has a strict ranking (no ties), chooses \(B\) from \(\{A,B,C\}\), and chooses \(C\) from \(\{C,D,E\}\). Which complete ranking is consistent with both choices?`,
      choices: [R`\(B\succ A\succ C\succ D\succ E\)`, R`\(A\succ B\succ C\succ D\succ E\)`, R`\(B\succ D\succ C\succ A\succ E\)`, R`\(B\succ E\succ C\succ D\succ A\)`],
      answer: 0,
      expl: R`The choices require \(B\succ A\), \(B\succ C\), \(C\succ D\) and \(C\succ E\). Only the first ranking satisfies all four. The others put \(A\) above \(B\), \(D\) above \(C\), or \(E\) above \(C\).`
    },
    {
      id: 'q03', topic: 'preferences', type: 'tf',
      q: R`Assume rational, convex preferences, and that more of both goods is strictly better. Let \(A=(2,6)\sim B=(6,2)\), \(M=(4,4)\) the midpoint of \(A\) and \(B\), \(L=(1,1)\) and \(H=(7,7)\). <strong>True or false?</strong>`,
      items: [
        { t: R`\(M\succeq A\) must hold.`, a: true },
        { t: R`\(M\succ A\) must hold.`, a: false },
        { t: R`\(L\succeq A\) must hold.`, a: false },
        { t: R`The smallest \(t\) for which the assumptions guarantee \((4,t)\succeq A\) is \(t=4\).`, a: true }
      ],
      expl: R`Convexity makes the average \(M\) <em>at least as good</em> as \(A\) and \(B\), but not strictly better: with \(u=a+b\) we get \(u(A)=u(B)=u(M)=8\). \(L\) has less of both goods than \(A\), so nothing makes it as good. Convexity guarantees \((4,4)\succeq A\); under \(u=a+b\) any \((4,t)\) with \(t<4\) is worse, so no smaller \(t\) is guaranteed.`
    },
    {
      id: 'q28', topic: 'preferences', type: 'mc',
      q: R`A consumer with stable rational preferences chooses \(A=(4,6)\) from \(2a+b\le 14\). The new budget is \(a+2b\le 16\). More of both goods is strictly better. Which statement correctly describes the restrictions on a new optimal bundle?`,
      choices: [
        R`\(0\le a^*\le 4\) and \(b^*=8-a^*/2\).`,
        R`\(4\le a^*\le 16\) and \(b^*=8-a^*/2\).`,
        R`Only \((a^*,b^*)=(4,6)\) can be optimal.`,
        R`Every bundle in the new budget set can be optimal, including those with unspent income.`
      ],
      answer: 1,
      expl: R`The old choice \(A\) is still affordable. A bundle strictly inside the old budget was strictly worse than \(A\), so it cannot be optimal now. On the new line, \(b=8-a/2\), and old spending is \(2a+b=8+3a/2\). Requiring this to be at least \(14\) gives \(a\ge 4\); feasibility gives \(a\le 16\).`
    },
    {
      id: 'q29', topic: 'preferences', type: 'tf',
      q: R`A consumer with stable rational preferences chooses \(A=(0,12)\) from \(B_0=\{(a,b)\ge0: a+b\le 12\}\). <strong>True or false?</strong>`,
      items: [
        { t: R`If the budget becomes \(2a+b\le 12\), \(A\) remains an optimal bundle.`, a: true },
        { t: R`If \(A\) was the unique optimum in \(B_0\), it remains the unique optimum under \(2a+b\le12\).`, a: true },
        { t: R`If instead the budget expands to \(a/2+b\le 12\), \(A\) must remain optimal.`, a: false }
      ],
      expl: R`Under \(2a+b\le12\) the new set is a subset of \(B_0\) and still contains \(A\). A smaller feasible set that keeps the old optimum cannot offer anything better, and uniqueness is preserved. A <em>larger</em> set can offer something better: with \(u=a+\tfrac32 b\) the optimum is \((0,12)\) originally but \((24,0)\) once \(p_a\) falls to \(1/2\).`
    },
    {
      id: 'q30', topic: 'preferences', type: 'mc',
      q: R`A consumer is said to maximize the same rational preferences in both observations, and more of both goods is strictly better.
        <table><tr><th>Obs.</th><th>\(p_a\)</th><th>\(p_b\)</th><th>\(Y\)</th><th>Chosen bundle</th></tr>
        <tr><td>1</td><td>1</td><td>2</td><td>14</td><td>\(X=(4,5)\)</td></tr>
        <tr><td>2</td><td>2</td><td>1</td><td>14</td><td>\(Z=(5,4)\)</td></tr></table>
        Which statement is correct?`,
      choices: [
        R`The observations are consistent because both choices spend the full budget.`,
        R`The observations are consistent if \(X\sim Z\).`,
        R`The observations are inconsistent: each choice is strictly inside the other budget, implying both \(X\succ Z\) and \(Z\succ X\).`,
        R`The observations are inconsistent because \(X\) is unaffordable in observation 1.`
      ],
      answer: 2,
      expl: R`Each chosen bundle costs 14 in its own budget and 13 in the other. In observation 1, \(Z\) costs only 13, so she could afford slightly more of both goods than \(Z\); that gives \(X\succ Z\). Observation 2 similarly implies \(Z\succ X\). These strict rankings contradict transitivity, and indifference cannot fix it.`
    },

    // ============================ BUDGET SETS ============================
    {
      id: 'q10', topic: 'budget', type: 'tf',
      q: R`Prices are \(p_a=3\), \(p_b=2\), and income is \(Y=30\). <strong>True or false?</strong>`,
      items: [
        { t: R`The budget set is \(\{(a,b)\ge0:\ 3a+2b\le30\}\).`, a: true },
        { t: R`The budget-line slope, with \(a\) on the horizontal axis, is \(-2/3\).`, a: false },
        { t: R`\((4,6)\) is affordable and leaves $6 unspent.`, a: true },
        { t: R`\((8,4)\) lies on the budget line.`, a: false }
      ],
      expl: R`Affordability means \(3a+2b\le30\). The slope is \(-p_a/p_b=-3/2\). \((4,6)\) costs \(12+12=24\), leaving 6. \((8,4)\) costs \(24+8=32>30\), so it is unaffordable.`
    },
    {
      id: 'q11', topic: 'budget', type: 'tf',
      q: R`Initially \(p_a=2\), \(p_b=4\) and \(Y=24\). Each change below starts separately from that original situation. <strong>True or false?</strong>`,
      items: [
        { t: R`If \(p_a\) rises to 4, the new intercepts are \(a=6\) and \(b=6\).`, a: true },
        { t: R`If \(Y\) rises to 48, the budget line shifts out in parallel, with intercepts \(a=24\), \(b=12\).`, a: true },
        { t: R`If \(p_b\) falls to 2, the \(a\)-intercept moves to 24.`, a: false },
        { t: R`If \(p_a\) rises to 4, the slope of the line is \(-1\).`, a: true }
      ],
      expl: R`The intercepts are \(Y/p_a\) and \(Y/p_b\). Original: \(12\) and \(6\). \(p_a\to4\): \(6\) and \(6\) (slope \(-4/4=-1\)). \(Y\to48\): \(24\) and \(12\), same slope \(-1/2\). \(p_b\to2\): the \(a\)-intercept stays \(12\) (it doesn't depend on \(p_b\)) and the \(b\)-intercept becomes \(12\).`
    },
    {
      id: 'q12', topic: 'budget', type: 'tf',
      q: R`<strong>True or false?</strong>`,
      items: [
        { t: R`Multiplying both prices and income by 4 leaves the budget set unchanged.`, a: true },
        { t: R`With unchanged preferences, multiplying both prices and income by 4 leaves the set of optimal bundles unchanged.`, a: true },
        { t: R`A shop charging $3 each for the first two units and $2 per additional unit satisfies the constant-unit-price assumption.`, a: false }
      ],
      expl: R`Dividing the scaled budget inequality by 4 recovers the original one, so the feasible set (and so the optimal bundles) is unchanged. A quantity discount changes the unit price with the amount purchased, which violates the constant (linear) price assumption.`
    },
    {
      id: 'q27', topic: 'budget', type: 'tf',
      q: R`Consider \(B_1=\{(a,b)\ge0: a+2b\le24\}\) and \(B_2=\{(a,b)\ge0: 2a+3b\le24\}\). Preferences remain unchanged. <strong>True or false?</strong>`,
      items: [
        { t: R`Every bundle in \(B_2\) is also in \(B_1\).`, a: true },
        { t: R`Every bundle in \(B_1\) is also in \(B_2\).`, a: false },
        { t: R`The highest attainable utility in \(B_2\) can exceed that in \(B_1\).`, a: false },
        { t: R`Rationality alone implies a strict preference for \(B_1\) over \(B_2\).`, a: false }
      ],
      expl: R`Since \(a+2b\le 2a+3b\) for nonnegative quantities, \(B_2\subseteq B_1\). The reverse fails: \((24,0)\in B_1\) but not \(B_2\). More available options cannot lower the maximum utility, so (c) is false. But rationality allows indifference, so strict improvement isn't guaranteed.`
    },

    // ============================ UTILITY & INDIFFERENCE CURVES ============================
    {
      id: 'q04', topic: 'utility', type: 'mc',
      q: R`Let \(u(a,b)=ab+a+2b\), with \(X=(4,0)\), \(Z=(0,2)\) and \(W=(1,2)\). Which ranking is correct?`,
      choices: [R`\(X\succ W\succ Z\)`, R`\(W\succ X\sim Z\)`, R`\(X\sim Z\succ W\)`, R`\(W\sim X\sim Z\)`],
      answer: 1,
      expl: R`\(u(X)=0+4+0=4\), \(u(Z)=0+0+4=4\) and \(u(W)=2+1+4=7\). So \(W\succ X\sim Z\).`
    },
    {
      id: 'q05', topic: 'utility', type: 'tf',
      q: R`Let \(u(a,b)=a^2b\). <strong>True or false?</strong>`,
      items: [
        { t: R`\(7u+2\) represents exactly the same preferences as \(u\).`, a: true },
        { t: R`\(u^2\) represents exactly the same preferences as \(u\).`, a: true },
        { t: R`\(-u\) represents exactly the same preferences as \(u\).`, a: false },
        { t: R`\(\ln u\) represents the same preferences as \(u\) on \(a,b>0\).`, a: true },
        { t: R`A utility difference of 3 means one bundle is worth exactly $3 more to the consumer.`, a: false }
      ],
      expl: R`A <em>positive monotonic (strictly increasing)</em> transformation preserves the ranking. \(7u+2\) and \(u^2\) (on \(u\ge0\)) are increasing; \(\ln u\) is increasing where defined; \(-u\) reverses the ranking. Utility is ordinal: differences have no dollar interpretation.`
    },
    {
      id: 'q06', topic: 'utility', type: 'mc',
      q: R`Let \(u(a,b)=\sqrt a+2\sqrt b\). Which equation and domain describe the indifference curve through \((4,1)\)?`,
      choices: [
        R`\(b=(4-\sqrt a)^2\), \(0\le a\le16\)`,
        R`\(b=(2-\sqrt a)^2/4\), \(0\le a\le4\)`,
        R`\(b=(4-\sqrt a)^2/4\), \(0\le a\le16\)`,
        R`\(b=(4-\sqrt a)^2/4\), \(0\le a<\infty\)`
      ],
      answer: 2,
      expl: R`At \((4,1)\), utility is \(\sqrt4+2\sqrt1=4\). Solving \(\sqrt a+2\sqrt b=4\) gives \(b=(4-\sqrt a)^2/4\), and we need \(4-\sqrt a\ge0\), i.e. \(0\le a\le16\).`
    },
    {
      id: 'q07', topic: 'utility', type: 'mc',
      q: R`For \(u(a,b)=3a^2b+ab^2\), which row gives the correct values at \((a,b)=(2,3)\)? Use the signed convention \(${MRS}=-MU_a/MU_b\).`,
      choices: [
        R`\(MU_a=24\), \(MU_b=45\), \(${MRS}=-8/15\)`,
        R`\(MU_a=45\), \(MU_b=24\), \(${MRS}=15/8\)`,
        R`\(MU_a=36\), \(MU_b=12\), \(${MRS}=-3\)`,
        R`\(MU_a=45\), \(MU_b=24\), \(${MRS}=-15/8\)`
      ],
      answer: 3,
      expl: R`\(MU_a=6ab+b^2\) and \(MU_b=3a^2+2ab\). At \((2,3)\): \(MU_a=36+9=45\) and \(MU_b=12+12=24\). So \(${MRS}=-45/24=-15/8\).`
    },
    {
      id: 'q08', topic: 'utility', type: 'tf',
      q: R`Let \(u(a,b)=a^2b\). Consider moving along the curve \(u=16\) from \(P=(2,4)\) to \(Q=(4,1)\). <strong>True or false?</strong>`,
      items: [
        { t: R`The magnitude \(|${MRS}|\) falls from 4 to \(1/2\).`, a: true },
        { t: R`The signed MRS becomes more negative as the consumer moves from \(P\) to \(Q\).`, a: false },
        { t: R`The indifference curve becomes flatter as \(a\) increases from 2 to 4.`, a: true }
      ],
      expl: R`Here \(${MRS}=-2b/a\): it is \(-4\) at \(P\) and \(-1/2\) at \(Q\). The magnitude falls (this is convexity: \(|MRS|\) decreasing in \(a\)); the signed MRS becomes <em>less</em> negative. The curve gets flatter.`
    },
    {
      id: 'q21', topic: 'utility', type: 'tf',
      q: R`Let \(u(a,b)=2a+5b\) and \(v(a,b)=6a+15b-7\). <strong>True or false?</strong>`,
      items: [
        { t: R`\((8,1)\sim(3,3)\) under \(u\).`, a: true },
        { t: R`At \(p_a=p_b=2\), there is an income for which \((3,3)\) is optimal under \(u\).`, a: false },
        { t: R`\(u\) and \(v\) represent the same preferences and have the same MRS.`, a: true },
        { t: R`\(u\) and \(v\) have the same marginal utility of \(a\).`, a: false }
      ],
      expl: R`Both \((8,1)\) and \((3,3)\) give \(u=21\). At equal prices, \((0,6)\) costs the same as \((3,3)\) but gives \(30\), so \((3,3)\) is never optimal. Since \(v=3u-7\), rankings and the MRS are unchanged, but marginal utilities are tripled.`
    },

    // ============================ OPTIMAL CHOICE ============================
    {
      id: 'q09', topic: 'optimal', type: 'mc',
      q: R`A consumer buys both goods and has \(|${MRS}|=3\). Prices are \(p_a=4\) and \(p_b=2\). How should she change her purchases to increase utility while keeping total spending the same?`,
      choices: [R`Buy less \(a\) and more \(b\).`, R`Buy more \(a\) and less \(b\).`, R`Buy more of both goods.`, R`Keep buying the same amounts.`],
      answer: 1,
      expl: R`She is willing to give up 3 units of \(b\) for one more unit of \(a\), while the market only charges \(p_a/p_b=2\) units of \(b\) per unit of \(a\). Buying a bit more \(a\) and less \(b\) increases utility at the same spending.`
    },
    {
      id: 'q13', topic: 'optimal', type: 'mc',
      q: R`Let \(u(a,b)=ab^2\), \(p_a=2\), \(p_b=1\) and \(Y=18\). Which bundle is optimal, and what fraction of income is spent on \(a\)?`,
      choices: [
        R`\((0,18)\); the share spent on \(a\) is 0.`,
        R`\((3,12)\); the share spent on \(a\) is \(1/3\).`,
        R`\((3,12)\); the share spent on \(a\) is \(2/3\).`,
        R`\((9,0)\); the share spent on \(a\) is 1.`
      ],
      answer: 1,
      expl: R`For \(u=ab^2\) the expenditure shares are \(1/3\) on \(a\) and \(2/3\) on \(b\). So \(a^*=(18/3)/2=3\) and \(b^*=(2\cdot18/3)/1=12\). Spending on \(a\) is \(6\), one third of income.`
    },
    {
      id: 'q14', topic: 'optimal', type: 'mc',
      q: R`A consumer has \(u(a,b)=a^\alpha b^2\) with \(\alpha>0\). At \(p_a=3\), \(p_b=2\), \(Y=90\), her optimum has \(a^*=10\). Which row gives \(\alpha\), her original \(b^*\), and her new \(a^*\) if \(p_a\) falls to \(1.5\) with \(p_b\) and \(Y\) unchanged?`,
      choices: [
        R`\(\alpha=2\), \(b^*=30\), new \(a^*=20\)`,
        R`\(\alpha=1\), \(b^*=15\), new \(a^*=20\)`,
        R`\(\alpha=1\), \(b^*=30\), new \(a^*=10\)`,
        R`\(\alpha=1\), \(b^*=30\), new \(a^*=20\)`
      ],
      answer: 3,
      expl: R`The budget gives \(b^*=(90-3\cdot10)/2=30\). Spending on \(a\) is \(30/90=1/3\) of income, so \(\alpha/(\alpha+2)=1/3\), hence \(\alpha=1\). Halving \(p_a\) doubles \(a^*\) (Cobb-Douglas demand is \(\propto 1/p_a\)): \(a^*=20\).`
    },
    {
      id: 'q15', topic: 'optimal', type: 'tf',
      q: R`Let \(u(a,b)=a^2b^3\), with strictly positive prices and \(Y\ge0\). <strong>True or false?</strong>`,
      items: [
        { t: R`If a utility-maximizing consumer chooses \(a^*=0\), then \(Y=0\).`, a: true },
        { t: R`Observing \(a=0\) implies \(Y=0\) even without assuming utility maximization.`, a: false },
        { t: R`When \(Y>0\), some affordable bundle gives strictly positive utility.`, a: true }
      ],
      expl: R`With positive income, an affordable bundle with both goods gives positive utility, while any bundle with \(a=0\) gives zero. So an <em>optimal</em> \(a^*=0\) requires \(Y=0\). Without maximization, observing \(a=0\) tells us nothing about income.`
    },
    {
      id: 'q16', topic: 'optimal', type: 'mc',
      q: R`Let \(u(a,b)=\min\{2a,3b\}\), \(p_a=3\), \(p_b=2\) and \(Y=26\). Which option gives the optimal bundle and the right optimality condition?`,
      choices: [
        R`\((6,4)\), using \(2a=3b\) and \(3a+2b=26\).`,
        R`\((6,4)\), using a differentiable tangency with \(|${MRS}|=3/2\) at the kink.`,
        R`\((3,2)\), using \(2a=3b\).`,
        R`\((26/3,0)\), because the consumer should buy only \(a\).`
      ],
      answer: 0,
      expl: R`For perfect complements the optimum sits at the kink \(2a=3b\), on the budget line \(3a+2b=26\). Substituting \(b=2a/3\): \(3a+4a/3=26\Rightarrow a=6\), \(b=4\), \(u^*=12\). At the kink the MRS is undefined, so the tangency condition does not apply.`
    },
    {
      id: 'q17', topic: 'optimal', type: 'mc',
      q: R`Each kit requires 3 units of \(a\) and 2 units of \(b\). Unmatched units give no extra benefit; quantities are divisible. At \(p_a=2\) and \(p_b=3\), a maximizing consumer buys \(a^*=9\). Which option correctly gives a utility function, \(b^*\), and income?`,
      choices: [
        R`\(u=\min\{3a,2b\}\), \(b^*=6\), \(Y=36\)`,
        R`\(u=a/3+b/2\), \(b^*=6\), \(Y=36\)`,
        R`\(u=\min\{a/3,b/2\}\), \(b^*=6\), \(Y=36\)`,
        R`\(u=\min\{a/3,b/2\}\), \(b^*=27/2\), \(Y=117/2\)`
      ],
      answer: 2,
      expl: R`The number of complete kits is \(\min\{a/3,\,b/2\}\). At the optimum \(a/3=b/2\), so \(a^*=9\) requires \(b^*=6\). Income is \(Y=2(9)+3(6)=36\).`
    },
    {
      id: 'q18', topic: 'optimal', type: 'mc',
      q: R`Three consumers face \(p_a=p_b=1\) and \(Y=12\). Their utilities are \(u_1=ab\), \(u_2=\min\{a,2b\}\), \(u_3=2a+b\). Which row gives their optimal bundles, in that order?`,
      choices: [
        R`\((6,6)\); \((4,8)\); \((12,0)\)`,
        R`\((6,6)\); \((8,4)\); \((0,12)\)`,
        R`\((4,8)\); \((8,4)\); \((12,0)\)`,
        R`\((6,6)\); \((8,4)\); \((12,0)\)`
      ],
      answer: 3,
      expl: R`\(ab\): equal expenditure shares give \((6,6)\). \(\min\{a,2b\}\): use \(a=2b\) and \(a+b=12\) to get \((8,4)\). \(2a+b\): good \(a\) gives more utility per dollar (2 vs 1), so \((12,0)\).`
    },
    {
      id: 'q19', topic: 'optimal', type: 'tf',
      q: R`Let \(u(a,b)=3a+2b\), \(p_b=3\) and \(Y=24\). <strong>True or false?</strong>`,
      items: [
        { t: R`At \(p_a=2\), the unique optimal bundle is \((12,0)\).`, a: true },
        { t: R`At \(p_a=9/2\), every nonnegative bundle on \((9/2)a+3b=24\) is optimal.`, a: true },
        { t: R`At \(p_a=6\), the unique optimal bundle is \((4,0)\).`, a: false },
        { t: R`At \(p_a=2\), the highest attainable indifference curve has slope \(-3/2\).`, a: true }
      ],
      expl: R`Compare utility per dollar: \(3/p_a\) for \(a\) versus \(2/3\) for \(b\). At \(p_a=2\), \(a\) wins: \((12,0)\). At \(p_a=9/2\) they tie, so every bundle on the budget line is optimal. At \(p_a=6\), \(3/6<2/3\), so only \(b\) is bought: \((0,8)\), not \((4,0)\). Every indifference curve has slope \(-3/2\) (\(|${MRS}|=3/2\)).`
    },
    {
      id: 'q20', topic: 'optimal', type: 'mc',
      q: R`A consumer with positive income has \(u(a,b)=4a+5b\) and faces \(p_a=8\). An optimal bundle has \(b^*>0\). Which statement must be true?`,
      choices: [
        R`\(p_b<10\); equality is impossible.`,
        R`\(p_b\ge10\).`,
        R`\(0&lt;p_b\le10\).`,
        R`\(p_b=10\).`
      ],
      answer: 2,
      expl: R`Buying some \(b\) requires \(5/p_b\ge 4/8=1/2\), i.e. \(p_b\le10\). Equality is allowed: at \(p_b=10\) the goods tie, and positive \(b\) is one of many optimal choices.`
    },

    // ============================ DEMAND ============================
    {
      id: 'q22', topic: 'demand', type: 'mc',
      q: R`A consumer has \(u(a,b)=a^2b^3\), income \(Y=100\) and \(p_b=5\). Which option gives the demand for \(a\) (for all \(p_a>0\)) and the optimal \(b\)?`,
      choices: [
        R`\(D_a(p_a)=40/p_a\) and \(b^*=12\)`,
        R`\(D_a(p_a)=60/p_a\) and \(b^*=8\)`,
        R`\(D_a(p_a)=50/p_a\) and \(b^*=10\)`,
        R`\(D_a(p_a)=40/(p_a+5)\) and \(b^*=12\)`
      ],
      answer: 0,
      expl: R`Expenditure shares are \(2/5\) and \(3/5\): spending is \(40\) on \(a\) and \(60\) on \(b\). Hence \(D_a(p_a)=40/p_a\) and \(b^*=60/5=12\) (it doesn't depend on \(p_a\)).`
    },
    {
      id: 'q23', topic: 'demand', type: 'mc',
      q: R`Let \(u(a,b)=\min\{a,4b\}\), \(Y=36\) and \(p_b=8\). Which pair of demand functions is correct for all \(p_a>0\)?`,
      choices: [
        R`\(a^*=36/(p_a+32)\) and \(b^*=144/(p_a+32)\)`,
        R`\(a^*=18/p_a\) and \(b^*=9/4\)`,
        R`\(a^*=36/(p_a+2)\) and \(b^*=144/(p_a+2)\)`,
        R`\(a^*=36/(p_a+2)\) and \(b^*=9/(p_a+2)\)`
      ],
      answer: 3,
      expl: R`At the kink \(a=4b\), so \(b=a/4\). The budget is \(p_a a+8(a/4)=36\), giving \(a^*=36/(p_a+2)\) and \(b^*=9/(p_a+2)\).`
    },
    {
      id: 'q24', topic: 'demand', type: 'mc',
      q: R`Let \(u(a,b)=2a+b\), \(p_b=3\) and \(Y=18\). At \(p_a=6\), what is the <em>full set</em> of optimal bundles?`,
      choices: [
        R`Only \((3,0)\).`,
        R`Every \((a,b)\) with \(0\le a\le3\) and \(b=6-2a\).`,
        R`Only \((0,6)\).`,
        R`Every nonnegative bundle with \(6a+3b\le18\).`
      ],
      answer: 1,
      expl: R`At \(p_a=6\), both goods yield \(1/3\) utility per dollar. Every bundle that spends the full budget is optimal: \(6a+3b=18\), i.e. \(b=6-2a\) with \(0\le a\le3\). On the demand graph this is the horizontal "tie segment". Bundles leaving income unspent are not optimal.`
    },
    {
      id: 'q25', topic: 'demand', type: 'mc',
      q: R`Nora has \(u_N(a,b)=ab\) and income 24. Eli has \(u_E(a,b)=\min\{a,2b\}\) and income 30. Both face \(p_b=2\) and the same \(p_a>0\). Which expression gives market demand for \(a\)?`,
      choices: [
        R`\(D(p_a)=24/p_a+30/(p_a+1)\)`,
        R`\(D(p_a)=12/p_a+30/(p_a+4)\)`,
        R`\(D(p_a)=12/p_a+30/(p_a+1)\)`,
        R`\(D(p_a)=42/(2p_a+1)\)`
      ],
      answer: 2,
      expl: R`Nora spends half her income on \(a\), so \(D_N=12/p_a\). Eli uses \(a=2b\), so his budget is \(p_a a+2(a/2)=(p_a+1)a=30\), giving \(D_E=30/(p_a+1)\). Market demand is the sum of quantities at each common price.`
    },
    {
      id: 'q26', topic: 'demand', type: 'mc',
      q: R`Individual demands are \(D_1(p_a)=\max\{24-2p_a,0\}\) and \(D_2(p_a)=\max\{6-p_a,0\}\). Which row correctly gives market quantities at prices 4, 8 and 13, followed by the kink of market demand in \((Q,p_a)\) coordinates?`,
      choices: [
        R`\(18,\ 8,\ 0\); kink at \((12,6)\)`,
        R`\(18,\ 6,\ -9\); kink at \((12,6)\)`,
        R`\(9,\ 4,\ 0\); kink at \((6,12)\)`,
        R`\(18,\ 8,\ 0\); kink at \((6,12)\)`
      ],
      answer: 0,
      expl: R`Add <em>quantities</em> at each price. \(D(4)=16+2=18\), \(D(8)=8+0=8\), \(D(13)=0\). Consumer 2 stops buying at \(p_a=6\), where the market quantity is \(D_1(6)=12\): the kink is \((Q,p_a)=(12,6)\). For \(p_a<6\): \(D=30-3p_a\); for \(6\le p_a<12\): \(D=24-2p_a\).`
    },

    // ============================ ELASTICITIES (Midterm 2) ============================
    {
      id: 'e01', topic: 'elasticity', type: 'tf',
      q: R`<strong>True or false?</strong> (Own-price elasticity \(\varepsilon=\frac{\%\Delta Q}{\%\Delta P}=\frac{dQ}{dP}\cdot\frac{P}{Q}\).)`,
      items: [
        { t: R`For a downward-sloping demand curve, \(\varepsilon<0\).`, a: true },
        { t: R`If \(|\varepsilon|<1\) (inelastic), a price increase raises total spending on the good.`, a: true },
        { t: R`If \(|\varepsilon|>1\) (elastic), a price increase raises total spending on the good.`, a: false },
        { t: R`Elasticity is the same thing as the slope of the demand curve.`, a: false }
      ],
      expl: R`Elasticity is a <em>percentage</em> response, so it is unit-free; slope depends on units, and elasticity changes along a straight-line demand curve even though the slope doesn't. When demand is inelastic, quantity falls proportionally less than price rises, so spending \(P\cdot Q\) rises. When elastic, quantity falls proportionally more, so spending falls.`
    },
    {
      id: 'e02', topic: 'elasticity', type: 'mc',
      q: R`Demand is \(Q=60-3P\). What is the own-price elasticity of demand at \(P=5\)?`,
      choices: [R`\(-1/3\)`, R`\(-1/4\)`, R`\(-3\)`, R`\(-1/9\)`],
      answer: 0,
      expl: R`At \(P=5\), \(Q=60-15=45\). The slope is \(-3\). So \(\varepsilon=-3\cdot\frac{5}{45}=-\frac13\). Demand is inelastic here. (Using \(Q=60\) instead of 45 gives the common wrong answer \(-1/4\); \(-3\) is just the slope.)`
    },
    {
      id: 'e03', topic: 'elasticity', type: 'mc',
      q: R`A consumer has \(u(a,b)=a^\alpha b^\beta\). Her demand for \(a\) is \(\frac{\alpha}{\alpha+\beta}\frac{Y}{p_a}\). Which row gives the own-price elasticity, the cross-price elasticity with respect to \(p_b\), and the income elasticity of demand for \(a\)?`,
      choices: [
        R`own \(=-1\), cross \(=0\), income \(=1\)`,
        R`own \(=-1\), cross \(=1\), income \(=1\)`,
        R`own \(=-\frac{\alpha}{\alpha+\beta}\), cross \(=0\), income \(=1\)`,
        R`own \(=-1\), cross \(=0\), income \(=\frac{\alpha}{\alpha+\beta}\)`
      ],
      answer: 0,
      expl: R`\(D=kY/p_a\) with \(k=\frac{\alpha}{\alpha+\beta}\). Own: \(\frac{dD}{dp_a}\frac{p_a}{D}=-\frac{kY}{p_a^2}\cdot\frac{p_a^2}{kY}=-1\). Cross: \(D\) doesn't depend on \(p_b\), so 0. Income: \(\frac{dD}{dY}\frac{Y}{D}=\frac{k}{p_a}\cdot\frac{p_a}{k}=1\). The share \(k\) cancels everywhere.`
    },
    {
      id: 'e04', topic: 'elasticity', type: 'tf',
      q: R`Let \(\varepsilon_{ab}\) be the cross-price elasticity of demand for \(a\) with respect to \(p_b\), and \(\eta\) the income elasticity of demand for \(a\). <strong>True or false?</strong>`,
      items: [
        { t: R`If \(\varepsilon_{ab}>0\), goods \(a\) and \(b\) are substitutes.`, a: true },
        { t: R`If \(\varepsilon_{ab}<0\), goods \(a\) and \(b\) are complements.`, a: true },
        { t: R`If \(0<\eta<1\), good \(a\) is a luxury.`, a: false },
        { t: R`If \(\eta<0\), good \(a\) is inferior.`, a: true }
      ],
      expl: R`Substitutes: a higher \(p_b\) pushes consumers toward \(a\) (\(\varepsilon_{ab}>0\)). Complements: a higher \(p_b\) lowers demand for \(a\) (\(\varepsilon_{ab}<0\)). Income: \(\eta<0\) inferior; \(0<\eta<1\) normal <em>necessity</em>; \(\eta>1\) normal <em>luxury</em>.`
    },
    {
      id: 'e05', topic: 'elasticity', type: 'mc',
      q: R`Demand for good \(a\) is \(Q_a=100-2p_a+3p_b+0.1Y\). At \(p_a=10\), \(p_b=5\), \(Y=200\), what is the cross-price elasticity with respect to \(p_b\), and what does it say?`,
      choices: [
        R`\(\approx0.13\): \(a\) and \(b\) are substitutes`,
        R`\(\approx0.13\): \(a\) and \(b\) are complements`,
        R`\(3\): \(a\) and \(b\) are substitutes`,
        R`\(\approx-0.13\): \(a\) and \(b\) are complements`
      ],
      answer: 0,
      expl: R`\(Q_a=100-20+15+20=115\). \(\varepsilon_{ab}=\frac{\partial Q_a}{\partial p_b}\frac{p_b}{Q_a}=3\cdot\frac{5}{115}\approx0.13>0\), so substitutes. The coefficient 3 is a slope, not an elasticity.`
    },
    {
      id: 'e06', topic: 'elasticity', type: 'mc',
      q: R`The price of a good rises by 10% and quantity demanded falls by 25%. What happens to total spending on the good?`,
      choices: [R`It falls (demand is elastic).`, R`It rises (demand is inelastic).`, R`It is unchanged.`, R`It cannot be determined.`],
      answer: 0,
      expl: R`\(\varepsilon\approx-25/10=-2.5\), so \(|\varepsilon|>1\): elastic. New spending relative to old is \(1.10\times0.75=0.825\): spending falls by about 17.5%.`
    },
    {
      id: 'e07', topic: 'elasticity', type: 'mc',
      q: R`When consumer income rises by 20%, the quantity demanded of good \(a\) rises by 10%. Which description is correct?`,
      choices: [R`Normal good, a necessity (\(\eta=0.5\))`, R`Normal good, a luxury (\(\eta=0.5\))`, R`Inferior good (\(\eta=0.5\))`, R`Normal good, a luxury (\(\eta=2\))`],
      answer: 0,
      expl: R`\(\eta=\frac{\%\Delta Q}{\%\Delta Y}=\frac{10}{20}=0.5\). Positive, so normal; below 1, so a necessity (spending on it grows more slowly than income).`
    },
    {
      id: 'e08', topic: 'elasticity', type: 'mc',
      q: R`A consumer has \(u(a,b)=\min\{a,b\}\), so her demand for \(a\) is \(\frac{Y}{p_a+p_b}\). What is the own-price elasticity of demand for \(a\) at \(p_a=p_b=2\)?`,
      choices: [R`\(-1/2\)`, R`\(-1\)`, R`\(-2\)`, R`\(-1/4\)`],
      answer: 0,
      expl: R`\(\frac{\partial D}{\partial p_a}=-\frac{Y}{(p_a+p_b)^2}\), so \(\varepsilon=-\frac{Y}{(p_a+p_b)^2}\cdot\frac{p_a}{Y/(p_a+p_b)}=-\frac{p_a}{p_a+p_b}=-\frac12\). The cross-price elasticity is \(-\frac{p_b}{p_a+p_b}=-\frac12\) too (complements), and the income elasticity is 1.`
    },
    {
      id: 'e09', topic: 'elasticity', type: 'mc',
      q: R`Demand for a good is \(Q=36/P\). Total spending when the price rises from $2 to $3 is…`,
      choices: [R`unchanged at $36`, R`up to $54`, R`down to $24`, R`down to $12`],
      answer: 0,
      expl: R`At \(P=2\), \(Q=18\), spending \(=36\). At \(P=3\), \(Q=12\), spending \(=36\). Demand of the form \(k/P\) is <em>unit elastic</em> (\(\varepsilon=-1\)) at every price, so spending never changes. This is exactly Cobb-Douglas demand.`
    },
    {
      id: 'e10', topic: 'elasticity', type: 'tf',
      q: R`Demand is \(Q=40-2P\). <strong>True or false?</strong>`,
      items: [
        { t: R`At \(P=5\) demand is inelastic.`, a: true },
        { t: R`At \(P=10\) demand is unit elastic.`, a: true },
        { t: R`At \(P=15\), raising the price increases total spending.`, a: false },
        { t: R`Total spending \(P\cdot Q\) is largest at \(P=10\).`, a: true }
      ],
      expl: R`\(\varepsilon=-2P/(40-2P)\). At \(P=5\): \(-10/30=-1/3\) (inelastic). At \(P=10\): \(-20/20=-1\) (unit elastic). At \(P=15\): \(-30/10=-3\) (elastic), so a price rise lowers spending. Spending \(P(40-2P)\) peaks at \(P=10\), exactly where \(|\varepsilon|=1\).`
    },

    // ============================ SUBSTITUTION & INCOME EFFECTS (Midterm 2) ============================
    {
      id: 'f01', topic: 'effects', type: 'tf',
      q: R`The price of good \(a\) changes. <strong>True or false?</strong>`,
      items: [
        { t: R`The substitution effect always moves the quantity of \(a\) in the direction <em>opposite</em> to the price change.`, a: true },
        { t: R`For a normal good whose price falls, the substitution and income effects both increase consumption.`, a: true },
        { t: R`For an inferior good whose price falls, the income effect reduces consumption.`, a: true },
        { t: R`With perfect complements there is no substitution effect: the whole change is an income effect.`, a: true },
        { t: R`The substitution effect is computed holding nominal income \(Y\) fixed.`, a: false }
      ],
      expl: R`The substitution effect isolates the change in <em>relative</em> prices while holding her utility fixed, not her nominal income. A price fall raises real income: normal goods rise (IE > 0), inferior goods fall (IE < 0). Perfect complements are always consumed in a fixed ratio, so relative prices don't change the mix.`
    },
    {
      id: 'f02', topic: 'effects', type: 'mc',
      q: R`A consumer has \(u(a,b)=ab\), \(Y=40\), \(p_b=2\). The price of \(a\) falls from 2 to 1. Holding her utility fixed to isolate the substitution effect, what are the substitution effect (SE) and income effect (IE) on \(a\)?`,
      choices: [R`SE \(\approx4.14\), IE \(\approx5.86\)`, R`SE \(=5\), IE \(=5\)`, R`SE \(\approx5.86\), IE \(\approx4.14\)`, R`SE \(\approx14.14\), IE \(\approx5.86\)`],
      answer: 0,
      expl: R`Original: \(a_0=\frac{40}{2\cdot2}=10\), \(b_0=\frac{40}{2\cdot2}=10\), so \(u_0=100\). At the new prices, \(|MRS|=b/a=p_a/p_b=1/2\), so \(b=a/2\) on the curve \(ab=100\): \(a^2/2=100\), giving \(a_B=\sqrt{200}\approx14.14\). SE \(\approx14.14-10=4.14\). Final: \(a_C=\frac{40}{2\cdot1}=20\), so IE \(\approx20-14.14=5.86\). Total \(=10\).`
    },
    {
      id: 'f03', topic: 'effects', type: 'mc',
      q: R`A consumer has \(u(a,b)=ab\), \(Y=48\), \(p_b=2\). The price of \(a\) falls from 4 to 1. What are the substitution effect (SE) and income effect (IE) on \(a\)?`,
      choices: [R`SE \(=6\), IE \(=12\)`, R`SE \(=9\), IE \(=9\)`, R`SE \(=12\), IE \(=6\)`, R`SE \(=18\), IE \(=0\)`],
      answer: 0,
      expl: R`Original: \(a_0=\frac{48}{2\cdot4}=6\), \(b_0=\frac{48}{2\cdot2}=12\), \(u_0=72\). New price ratio \(p_a/p_b=1/2\), so \(b=a/2\) and \(a\cdot\frac a2=72\), giving \(a_B=12\). SE \(=12-6=6\). Final \(a_C=\frac{48}{2\cdot1}=24\), so IE \(=24-12=12\). Total \(=18\).`
    },
    {
      id: 'f04', topic: 'effects', type: 'mc',
      q: R`A consumer has \(u(a,b)=\min\{a,b\}\), \(Y=12\), \(p_b=1\). The price of \(a\) falls from 2 to 1. What are SE and IE on \(a\)?`,
      choices: [R`SE \(=0\), IE \(=2\)`, R`SE \(=2\), IE \(=0\)`, R`SE \(=1\), IE \(=1\)`, R`SE \(=-2\), IE \(=4\)`],
      answer: 0,
      expl: R`\(a=b\) always, so \(a_0=\frac{12}{2+1}=4\) and \(a_1=\frac{12}{1+1}=6\): total \(+2\). Holding utility fixed, she still buys the same kink bundle \((4,4)\), so SE \(=0\). The entire change is the income effect.`
    },
    {
      id: 'f05', topic: 'effects', type: 'mc',
      q: R`The price of good \(a\) falls and the quantity demanded of \(a\) <em>falls</em>. What must be true?`,
      choices: [
        R`\(a\) is an inferior good, and its (negative) income effect outweighs the substitution effect.`,
        R`\(a\) is a normal good.`,
        R`The substitution effect is negative.`,
        R`\(a\) and \(b\) are perfect complements.`
      ],
      answer: 0,
      expl: R`The substitution effect of a price fall is never negative, so the fall in quantity must come from the income effect: real income rose and she buys <em>less</em> of \(a\), i.e. \(a\) is inferior, and the income effect is bigger than the substitution effect. Such a good is called a <b>Giffen good</b>.`
    },
    {
      id: 'f06', topic: 'effects', type: 'mc',
      q: R`The price of \(a\) rises and quantity demanded falls from 20 to 12. The substitution effect is \(-10\). What is the income effect, and what does it say about \(a\)?`,
      choices: [
        R`IE \(=+2\): \(a\) is inferior`,
        R`IE \(=-2\): \(a\) is inferior`,
        R`IE \(=+2\): \(a\) is normal`,
        R`IE \(=-18\): \(a\) is normal`
      ],
      answer: 0,
      expl: R`Total \(=12-20=-8=SE+IE=-10+IE\), so IE \(=+2\). The price rise lowers real income, and she buys <em>more</em> of \(a\) as a result, which is the behavior of an inferior good. (A normal good would show IE \(<0\) here.)`
    },
    {
      id: 'f07', topic: 'effects', type: 'mc',
      q: R`To find the substitution effect of a price change, we look for an intermediate (compensated) bundle \(B\). It is the bundle where…`,
      choices: [
        R`the original indifference curve is tangent to a line with the <em>new</em> price ratio.`,
        R`the new indifference curve is tangent to a line with the <em>old</em> price ratio.`,
        R`the original budget line is tangent to the new indifference curve.`,
        R`the new budget line passes through the original bundle.`
      ],
      answer: 0,
      expl: R`Keep utility at the original level \(u_0\), but face the new relative prices. The compensated budget line is parallel to the new budget line and just touches the original indifference curve. The tangency point is \(B\).`
    },
    {
      id: 'f08', topic: 'effects', type: 'tf',
      q: R`<strong>True or false?</strong> Consider the compensated bundle \(B\) and compensated budget line used to find the substitution effect of a price change.`,
      items: [
        { t: R`The compensated budget line is parallel to the <em>new</em> budget line.`, a: true },
        { t: R`The compensated budget line is parallel to the <em>old</em> budget line.`, a: false },
        { t: R`She is exactly as well off at \(B\) as at the original bundle \(A\).`, a: true },
        { t: R`The compensated budget line always passes through the original bundle \(A\).`, a: false }
      ],
      expl: R`The compensated line has the <em>new</em> price ratio and is shifted until it just touches the <em>original</em> indifference curve, so utility at \(B\) equals utility at \(A\). It passes through \(A\) only in special cases (for example, at the kink with perfect complements, where \(B=A\)).`
    },

    // ============================ READ-THE-GRAPH, WORK-BACKWARDS, CONCEPT (added after the F26 exam) ============================
    {
      id: 'g01', topic: 'optimal', type: 'tf', three: true,
      q: R`The figure shows a consumer's indifference curve and budget constraint. She is currently consuming at the intersection \(A\). TRUE, FALSE or UNCERTAIN?`,
      fig: { kind: 'cross', al: 1, be: 1, pa: 1, pb: 1, Y: 12, f: 0.8 },
      items: [
        { t: R`\(A\) is the optimal choice for the consumer.`, a: false },
        { t: R`\(|\mathrm{MRS}_{ab}|>\dfrac{p_a}{p_b}\) at \(A\).`, a: false },
        { t: R`She could raise her utility by buying more of \(b\) and less of \(a\).`, a: true }
      ],
      expl: R`At \(A\) the indifference curve is <em>flatter</em> than the budget line, so \(|\mathrm{MRS}_{ab}|&lt;p_a/p_b\): she values \(a\) less than the market does. Selling some \(a\) to buy \(b\) puts her on a higher indifference curve, so \(A\) is not optimal.`
    },
    {
      id: 'g02', topic: 'optimal', type: 'tf', three: true,
      q: R`The figure shows a consumer's indifference curve and budget constraint. She is currently consuming at the intersection \(A\). TRUE, FALSE or UNCERTAIN?`,
      fig: { kind: 'cross', al: 1, be: 2, pa: 2, pb: 1, Y: 12, f: 0.12 },
      items: [
        { t: R`\(A\) is the optimal choice for the consumer.`, a: false },
        { t: R`\(|\mathrm{MRS}_{ab}|>\dfrac{p_a}{p_b}\) at \(A\).`, a: true },
        { t: R`She could raise her utility by buying more of \(b\) and less of \(a\).`, a: false }
      ],
      expl: R`At \(A\) the indifference curve is <em>steeper</em> than the budget line, so \(|\mathrm{MRS}_{ab}|>p_a/p_b\): she values \(a\) more than the market charges. She should buy more \(a\) and less \(b\), not the reverse.`
    },
    {
      id: 'g03', topic: 'optimal', type: 'tf', three: true,
      q: R`The figure shows a consumer's budget constraint and the bundle \(A\) she is currently choosing. <strong>No indifference curve is drawn.</strong> TRUE, FALSE or UNCERTAIN?`,
      fig: { kind: 'cross', al: 1, be: 1, pa: 1, pb: 2, Y: 12, f: 0.35, show: 'budget' },
      items: [
        { t: R`\(A\) is the optimal choice for the consumer.`, a: 'U' },
        { t: R`\(|\mathrm{MRS}_{ab}|>\dfrac{p_a}{p_b}\) at \(A\).`, a: 'U' },
        { t: R`\(A\) is affordable.`, a: true }
      ],
      expl: R`Without an indifference curve we know nothing about her preferences, so we cannot compare \(|\mathrm{MRS}_{ab}|\) with \(p_a/p_b\): <b>uncertain</b>. But \(A\) is on the budget line, so it is affordable.`
    },
    {
      id: 'g04', topic: 'optimal', type: 'mc', fixed: true,
      q: 'The figure shows a consumer\'s budget constraint and the indifference curve through each of four bundles. Which bundle is her optimal choice?',
      fig: { kind: 'which', al: 1, be: 1, pa: 1, pb: 1, Y: 12, fS: 0.82, fI: 0.5, pts: [{ k: 'S', l: 'A' }, { k: 'T', l: 'B' }, { k: 'O', l: 'C' }, { k: 'I', l: 'D' }] },
      choices: ['Bundle A', 'Bundle B', 'Bundle C', 'Bundle D'], answer: 1,
      expl: R`Bundle B is on the budget line and its indifference curve just touches the line: the highest curve she can reach. A is affordable but a higher curve is available. C is on a higher curve but outside the budget set. D is inside the budget set (money left over, and more is better).`
    },
    {
      id: 'g05', topic: 'budget', type: 'mc',
      q: 'The dashed line is a consumer\'s original budget constraint (good \\(a\\) on the horizontal axis). The solid line is the new one. Exactly one thing changed. What was it?',
      fig: { kind: 'shift', from: { pa: 2, pb: 4, Y: 24 }, to: { pa: 2, pb: 2, Y: 24 } },
      choices: ['The price of \\(b\\) fell', 'The price of \\(a\\) fell', 'Income rose', 'The price of \\(b\\) rose'], answer: 0,
      expl: R`The horizontal intercept \(Y/p_a\) did not move, but the vertical intercept \(Y/p_b\) moved up: only \(p_b\) changed, and it fell. (If income had changed, both intercepts would have moved.)`
    },
    {
      id: 'g06', topic: 'utility', type: 'mc',
      q: 'The figure shows three indifference curves of one consumer. Which description fits her preferences?',
      fig: { kind: 'shape', type: 'pc', al: 1, be: 2 },
      choices: ['Cobb-Douglas (smooth curves bowed toward the origin)', 'Perfect substitutes (straight lines)', 'Perfect complements (L-shaped)', 'Not convex (bowed away from the origin)'], answer: 2,
      expl: R`L-shaped curves with a kink: she uses the two goods in a fixed ratio, and extra units of one good alone add nothing. The MRS is undefined at the kink. These are perfect complements, \(u=\min\{\alpha a,\beta b\}\).`
    },
    {
      id: 'g07', topic: 'preferences', type: 'pick',
      q: R`Yesterday \(p_a=4\), \(p_b=3\), income \(Y=40\), and the consumer chose \(A=(4,8)\). Today she has the same preferences and income, but \(p_a=2\) and \(p_b=4\). The dashed line is yesterday's budget line and the solid line is today's. <strong>Tap a bundle on today's budget line that could be her new optimal choice</strong>, then check.`,
      fig: { kind: 'pick', old: { pa: 4, pb: 3, Y: 40 }, nw: { pa: 2, pb: 4, Y: 40 }, A: [4, 8] },
      expl: R`At the new prices \(A\) costs \(2(4)+4(8)=40\): it is still affordable (it is on today's line). So her new choice must be at least as good as \(A\). A bundle on today's line with \(a<4\) (and so \(b>8\)) was affordable yesterday with money left over, for example \((2,9)\) costs \(4(2)+3(9)=35<40\), so yesterday she revealed that \(A\) is strictly better, and she wouldn't choose it now. What remains is \(a\ge4\), the thick segment.`
    },
    {
      id: 'c01', topic: 'preferences', type: 'mc', fixed: true,
      q: R`Suppose we observe a rational consumer make the following choices: \(C(a,b)=a\), \(C(a,c)=c\), \(C(c,d)=c\). What is \(C(a,b,c,d)\)?`,
      choices: [R`\(a\)`, R`\(b\)`, R`\(c\)`, R`\(d\)`], answer: 2,
      expl: R`The choices reveal \(a\succ b\), \(c\succ a\) and \(c\succ d\). By transitivity \(c\succ a\succ b\), and \(c\succ d\), so \(c\) beats everything else. A rational consumer picks her favorite available option: \(C(a,b,c,d)=c\).`
    },
    {
      id: 't01', topic: 'utility', type: 'tf', three: true,
      q: R`Consumer A has utility \(u(a,b)=2ab\) over positive quantities. For each function \(g\), decide: does \(v(a,b)=g(u(a,b))\) represent <b>exactly the same preferences</b> as \(u\) <b>and</b> have the same \(\mathrm{MRS}_{ab}\)? TRUE, FALSE or UNCERTAIN?`,
      items: [
        { t: R`\(g(x)=\tfrac12\sqrt{x}+3\)`, a: true },
        { t: R`\(g(x)=10-2x\)`, a: false },
        { t: R`\(g(x)=x^{2}\)`, a: true }
      ],
      expl: R`A function that is strictly <em>increasing</em> preserves the ranking of every pair of bundles, so the indifference curves, and with them the MRS, are unchanged. \(\tfrac12\sqrt{x}+3\) and \(x^2\) (for \(x>0\)) are increasing. \(10-2x\) is decreasing: it keeps the same indifference curves (so the same MRS) but <em>reverses</em> the ranking, so the preferences are different.`
    },
    {
      id: 'i01', topic: 'optimal', type: 'num',
      q: R`Consumer B has Cobb-Douglas utility \(u(a,b)=ab^3\), and the price of \(a\) is \(p_a=3\). At the optimal choice, \(a^*=2\) and \(\mathrm{MRS}_{ab}=-2\). Find \(p_b\), the consumer's income \(Y\), and \(b^*\).`,
      parts: [{ label: R`\(p_b\)`, answer: 1.5 }, { label: R`Income \(Y\)`, answer: 24 }, { label: R`\(b^*\)`, answer: 12 }],
      sol: R`<b>Price of \(b\):</b> at the optimum \(|\mathrm{MRS}|=p_a/p_b\), so \(p_b=3/2=1.5\).<br>
        <b>Quantity of \(b\):</b> for \(ab^3\), \(|\mathrm{MRS}|=\frac{b}{3a}\). Setting it equal to 2 at \(a^*=2\): \(b^*=3\cdot2\cdot2=12\).<br>
        <b>Income:</b> \(Y=p_a a^*+p_b b^*=3(2)+1.5(12)=24\). (Check: Cobb-Douglas spends \(\frac{3}{4}\) of income on \(b\): \(18/24\). ✓)`
    },
    {
      id: 'i02', topic: 'optimal', type: 'num',
      q: R`Consumer E has utility \(u(a,b)=\min\{2a,\ b\}\). Prices are \(p_a=3\), \(p_b=2\) and income is \(Y=35\). Find the optimal choice \((a^*,b^*)\). Then suppose income changes so that the new optimal choice has \(b^*=16\): find the new \(a^*\) and the new income.`,
      parts: [{ label: R`\(a^*\)`, answer: 5 }, { label: R`\(b^*\)`, answer: 10 }, { label: R`new \(a^*\)`, answer: 8 }, { label: R`new \(Y\)`, answer: 56 }],
      sol: R`Perfect complements sit at the kink \(2a=b\). <b>Original:</b> \(3a+2(2a)=35\Rightarrow a^*=5\), \(b^*=10\).<br>
        <b>New income:</b> with \(b^*=16\) the kink gives \(a^*=8\), so \(Y=3(8)+2(16)=56\).`
    },
    {
      id: 'i03', topic: 'optimal', type: 'num',
      q: R`Consumer F has utility \(u(a,b)=3a+2b\). Prices are \(p_a=2\), \(p_b=1\) and income is \(Y=20\). With \(a\) on the horizontal axis, find the slope of the budget constraint, the optimal choice \((a^*,b^*)\), and \(\mathrm{MRS}_{ab}\) at the optimum. (Enter signed numbers.)`,
      parts: [{ label: 'Budget slope', answer: -2 }, { label: R`\(a^*\)`, answer: 0 }, { label: R`\(b^*\)`, answer: 20 }, { label: R`\(\mathrm{MRS}_{ab}\)`, answer: -1.5 }],
      sol: R`<b>Slope:</b> \(-p_a/p_b=-2\). <b>Optimum:</b> utility per dollar is \(3/2=1.5\) for \(a\) and \(2/1=2\) for \(b\), so she spends everything on \(b\): \((0,20)\). <b>MRS:</b> constant, \(-3/2\). At this corner \(|\mathrm{MRS}|=1.5&lt;p_a/p_b=2\), so she values \(a\) less than the market does and buys none.`
    }
  ];
})();
