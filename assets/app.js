const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const KATEGORI = ['Politik', 'Ekonomi', 'Teknologi', 'Olahraga', 'Hiburan'];
const load = f => fetch(f).then(r => r.json()).then(d => d.items || []).catch(() => []);
const byDate = (a, b) => new Date(b.published_at) - new Date(a.published_at);
const waktu = iso => new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const tautan = slug => `artikel.html?slug=${encodeURIComponent(slug)}`;

if ($('#nav')) {
  const nav = $('#nav');
  ['Terkini', ...KATEGORI].forEach((k, i) => {
    const a = el('a', null, k);
    a.href = i ? `#kat-${k.toLowerCase()}` : '#terkini';
    nav.append(a);
  });
}

load('data/berita.json').then(items => {
  if ($('#terkini')) {
    const urut = [...items].sort(byDate);
    const brk = urut.find(i => i.breaking);
    if (brk) { $('#breaking').hidden = false; $('#breaking').href = tautan(brk.slug); $('#breaking-title').textContent = brk.title; }
    const ol = $('#terkini');
    urut.slice(0, 10).forEach(i => {
      const li = el('li'); const box = el('div');
      const a = el('a', null, i.title); a.href = tautan(i.slug);
      box.append(a, el('span', 'meta', `${i.category} · ${waktu(i.published_at)}`));
      li.append(box); ol.append(li);
    });
    const kat = $('#kategori');
    KATEGORI.forEach(k => {
      const card = el('div', 'cat'); card.id = `kat-${k.toLowerCase()}`;
      card.append(el('h3', null, k));
      urut.filter(i => i.category === k).slice(0, 2).forEach(i => {
        const a = el('a', null, i.title); a.href = tautan(i.slug); card.append(a);
      });
      if (!card.querySelector('a')) card.append(el('p', 'meta', 'Belum ada berita.'));
      kat.append(card);
    });
  }
  if ($('#artikel')) {
    const slug = new URLSearchParams(location.search).get('slug');
    const it = items.find(i => i.slug === slug);
    if (it) {
      document.title = `${it.title} · Haisumbar`;
      const m = $('#artikel'); m.textContent = '';
      m.append(el('span', 'meta', it.category), el('h1', null, it.title), el('span', 'meta', `${it.author} · ${waktu(it.published_at)}`));
      if (it.image) { const img = el('img'); img.src = it.image; img.alt = ''; m.append(img); }
      m.append(el('p', 'body', it.body));
    }
  }
});

load('data/opini.json').then(items => {
  const box = $('#opini'); if (!box) return;
  items.sort(byDate).slice(0, 4).forEach(o => {
    const d = el('div', 'op');
    d.append(el('span', 'by', o.author), el('h3', null, o.title), el('p', null, o.excerpt));
    box.append(d);
  });
});

load('data/iklan.json').then(items => {
  document.querySelectorAll('[data-slot]').forEach(slot => {
    const ad = items.find(i => i.active && i.slot === slot.dataset.slot);
    if (ad) slot.innerHTML = ad.code;
  });
});
