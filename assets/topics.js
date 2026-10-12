// Weekly update point #1: add a topic here and it appears in the nav and on the home page.
// status: 'live' | 'new' (shows a NEW badge) | 'soon' (greyed out)
window.TOPICS = [
  { id: 'preferences', exam: 1, week: 1, href: 'preferences.html', title: 'Preferences & choice',
    blurb: 'Rationality, more-is-better, convexity, and what choices reveal.', status: 'live' },
  { id: 'budget', exam: 1, week: 1, href: 'budget.html', title: 'Budget sets',
    blurb: 'Prices, income, and how the budget line moves.', status: 'live' },
  { id: 'utility', exam: 1, week: 2, href: 'utility.html', title: 'Utility & indifference curves',
    blurb: 'Utility functions, MRS, marginal utility, ordinal transformations.', status: 'live' },
  { id: 'optimal', exam: 1, week: 2, href: 'optimal.html', title: 'Optimal choice',
    blurb: 'Cobb-Douglas, perfect complements and substitutes. MRS = price ratio.', status: 'live' },
  { id: 'demand', exam: 1, week: 3, href: 'demand.html', title: 'Demand curves',
    blurb: 'Individual demand and adding up to market demand.', status: 'live' },

  // ---------- Midterm 2 ----------
  { id: 'elasticity', exam: 2, week: 4, href: 'elasticity.html', title: 'Elasticities', short: 'Elasticity',
    blurb: 'Own-price, cross-price and income elasticity. Substitutes, complements, normal and inferior goods.', status: 'new' },
  { id: 'effects', exam: 2, week: 5, href: 'effects.html', title: 'Substitution & income effects', short: 'Sub. & income',
    blurb: 'Split a price change into a substitution effect and an income effect.', status: 'new' }
];

// Weekly update point #3: shown on the home page.
window.SITE = { updated: 'October 12, 2026', note: 'Midterm 1 is complete. Midterm 2 has started: elasticities and substitution and income effects are up.' };
