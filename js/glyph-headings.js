/* Logo-lettering headings: swaps a heading's text for the sliced glyph images.
   Needs glyphs.js from slice_sheet.py loaded first (defines window.GLYPHS[name]).
   Markup:  <h2 data-glyphs="navy" data-glyph-path="fonts/glyphs-navy/">Since 1978</h2>
   The real text stays in the heading (visually hidden) for SEO and screen readers;
   characters without a glyph fall back to the live font, so nothing ever goes missing.
   Size with font-size as usual; --glyph-cap (default .72) = cap height as a fraction of the em. */
(function () {
  function build(h) {
    var set = window.GLYPHS && window.GLYPHS[h.getAttribute('data-glyphs')];
    if (!set || h.getAttribute('data-glyphs-done')) return;
    var path = h.getAttribute('data-glyph-path') || '';
    var lines = h.innerHTML.split(/<br\s*\/?>/i).map(function (s) {
      var t = document.createElement('textarea'); t.innerHTML = s.replace(/<[^>]+>/g, '');
      return t.value.replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
    var sr = document.createElement('span'); sr.className = 'glyph-sr'; sr.textContent = lines.join(' ');
    var vis = document.createElement('span'); vis.className = 'glyph-line'; vis.setAttribute('aria-hidden', 'true');
    var hEm = 'calc(var(--glyph-cap,.72) * ' + set.em_height + 'em)';
    var vEm = 'calc(var(--glyph-cap,.72) * ' + set.em_valign + 'em)';
    lines.forEach(function (line, li) {
      line.split(' ').forEach(function (word, wi, arr) {
        var w = document.createElement('span'); w.className = 'glyph-word';
        for (var i = 0; i < word.length; i++) {
          var ch = word[i] === '’' ? "'" : word[i];
          var g = set.glyphs[ch] || set.glyphs[ch.toUpperCase()];
          if (g) {
            var im = document.createElement('img');
            im.src = path + g.f + '.webp'; im.alt = ''; im.decoding = 'async';
            im.width = Math.round(g.w * set.height); im.height = set.height;
            im.style.height = hEm; im.style.verticalAlign = vEm;
            w.appendChild(im);
          } else {
            var s = document.createElement('span'); s.className = 'glyph-fallback'; s.textContent = ch; w.appendChild(s);
          }
        }
        vis.appendChild(w);
        if (wi < arr.length - 1) vis.appendChild(document.createTextNode(' '));
      });
      if (li < lines.length - 1) vis.appendChild(document.createElement('br'));
    });
    h.textContent = ''; h.appendChild(sr); h.appendChild(vis);
    h.setAttribute('data-glyphs-done', '1');
  }
  function run() { document.querySelectorAll('[data-glyphs]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
