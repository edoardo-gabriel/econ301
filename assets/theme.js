// Runs in <head> so the theme is set before first paint (no flash).
// The choice is stored in localStorage AND in window.name. Some browsers give every local
// file:// page its own isolated storage, but window.name survives navigation inside a tab,
// so the theme still carries over from page to page when the site is opened from a folder.
(function () {
  var KEY = 'e301-theme';
  var fromName = function () {
    var m = /(?:^|;)e301-theme=(dark|light)/.exec(window.name || '');
    return m ? m[1] : null;
  };
  window.saveTheme = function (t) {
    try { localStorage.setItem(KEY, t); } catch (e) { /* storage blocked */ }
    window.name = (window.name || '').replace(/(?:^|;)e301-theme=\w+/g, '') + ';e301-theme=' + t;
  };

  var t = null;
  try { t = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  if (t !== 'dark' && t !== 'light') t = fromName();
  if (t !== 'dark' && t !== 'light') {
    t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    window.saveTheme(t); // keep both stores in sync
  }
  document.documentElement.setAttribute('data-theme', t);
})();
