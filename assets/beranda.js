// Beranda Haisumbar.com — mengisi desain statis dari data/berita.json (diubah lewat CMS /admin)
(function () {
  var WARNA = {
    'Politik': '#7C242C', 'Berita Kota': '#7C242C', 'Hiburan': '#7C242C',
    'Lingkungan': '#047857', 'Olahraga': '#047857',
    'Nasional': '#5E1A21',
    'Bisnis': '#CC9C44', 'Ekonomi': '#CC9C44',
    'Teknologi': '#242424'
  };
  function warna(cat) { return WARNA[cat] || '#7C242C'; }
  function teksWarna(cat) { var w = warna(cat); return (w === '#CC9C44') ? '#242424' : '#FFFFFF'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function tautan(it) { return 'artikel.html?slug=' + encodeURIComponent(it.slug || ''); }
  function kutipan(it, n) {
    var b = String(it.body || '').replace(/\s+/g, ' ').trim();
    return b.length > n ? b.slice(0, n).replace(/\s+\S*$/, '') + '…' : b;
  }
  function menitBaca(it) {
    var kata = String(it.body || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(kata / 200));
  }
  function relWaktu(iso) {
    var t = new Date(iso).getTime();
    if (isNaN(t)) return '';
    var d = Date.now() - t, m = Math.floor(d / 60000);
    if (m < 1) return 'baru saja';
    if (m < 60) return m + ' menit lalu';
    var j = Math.floor(m / 60);
    if (j < 24) return j + ' jam lalu';
    var h = Math.floor(j / 24);
    if (h < 30) return h + ' hari lalu';
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function foto(it, gaya, label) {
    if (it.image) return '<img src="' + esc(it.image) + '" alt="" style="' + gaya + ';object-fit:cover;width:100%">';
    return '<div class="ph" style="' + gaya + '">' + label + '</div>';
  }
  function badge(it, gaya) {
    return '<span style="display:inline-block;background:' + warna(it.category) + ';color:' + teksWarna(it.category) + ';font-weight:600;' + gaya + '">' + esc(String(it.category || '').toUpperCase()) + '</span>';
  }

  function slideMobile(it, i) {
    return '<div class="sl k' + (i + 1) + '"><a href="' + tautan(it) + '">' + foto(it, 'aspect-ratio:3/2', '[Foto 3:2]') + '</a>' +
      badge(it, 'margin-top:12px;font-size:11px;padding:3px 8px') +
      '<h1 style="font-size:26px;line-height:1.2;margin-top:8px"><a href="' + tautan(it) + '">' + esc(it.title) + '</a></h1>' +
      '<p style="font-size:14px;line-height:1.6;margin:8px 0 0">' + esc(kutipan(it, 150)) + '</p>' +
      '<p style="font-size:12px;color:#5C5C5C;margin:8px 0 0">' + esc(it.author || 'Redaksi') + ' · ' + menitBaca(it) + ' menit baca</p></div>';
  }
  function slideDesktop(it, i) {
    return '<div class="sl k' + (i + 1) + '"><a href="' + tautan(it) + '">' + foto(it, 'aspect-ratio:16/9', '[Foto jurnalistik 16:9]') + '</a>' +
      badge(it, 'margin-top:16px;font-size:12px;padding:3px 10px') +
      '<h1 style="font-size:40px;line-height:1.15;margin-top:12px"><a href="' + tautan(it) + '">' + esc(it.title) + '</a></h1>' +
      '<p style="font-size:17px;line-height:1.6;margin:12px 0 0">' + esc(kutipan(it, 190)) + '</p>' +
      '<p style="font-size:13px;color:#5C5C5C;margin:14px 0 0">' + esc(it.author || 'Redaksi') + ' · ' + menitBaca(it) + ' menit baca</p></div>';
  }
  function titik(n) {
    var s = '';
    for (var i = 1; i <= n; i++) s += '<span class="dt k' + i + '"></span>';
    return s;
  }
  function barisMobile(it, i, terakhir) {
    return '<div class="row"' + (terakhir ? ' style="border-bottom:0"' : '') + '><b style="font-family:Newsreader,serif;font-size:22px;color:#7C242C">' + (i + 1) + '</b>' +
      '<a href="' + tautan(it) + '">' + foto(it, 'height:72px', '[Thumb]') + '</a>' +
      '<div>' + badge(it, 'font-size:10px;padding:2px 6px') +
      '<h3 style="font-size:16px;margin-top:4px;line-height:1.3"><a href="' + tautan(it) + '">' + esc(it.title) + '</a></h3>' +
      '<p style="font-size:12px;color:#5C5C5C;margin:4px 0 0">' + relWaktu(it.published_at) + '</p></div></div>';
  }
  function barisDesktop(it, i, terakhir) {
    return '<li style="display:grid;grid-template-columns:40px 180px 1fr auto;gap:16px;padding:14px 0;' + (terakhir ? '' : 'border-bottom:1px solid #E5E3DE;') + 'align-items:center">' +
      '<b style="font-family:Newsreader,serif;font-size:28px;color:#7C242C">' + (i + 1) + '</b>' +
      '<a href="' + tautan(it) + '">' + foto(it, 'height:110px', '[Thumbnail]') + '</a>' +
      '<div>' + badge(it, 'font-size:11px;padding:2px 6px') +
      '<h3 style="font-size:19px;margin-top:6px"><a href="' + tautan(it) + '">' + esc(it.title) + '</a></h3>' +
      '<p style="font-size:14px;margin:4px 0 0;color:#5C5C5C">' + esc(kutipan(it, 130)) + '</p></div>' +
      '<span style="font-size:12px;color:#5C5C5C">' + relWaktu(it.published_at) + '</span></li>';
  }
  function kartuRubrik(it, desktop) {
    var isi = '<a href="' + tautan(it) + '">' + foto(it, 'height:' + (desktop ? '150px' : '140px'), '[Foto liputan]') + '</a>' +
      '<div style="padding:' + (desktop ? '16px' : '12px') + '"><span style="font-size:11px;color:' + warna(it.category) + ';font-weight:600">' + esc(String(it.category || '').toUpperCase()) + '</span>' +
      '<h3 style="font-size:' + (desktop ? '19px' : '18px') + ';margin-top:' + (desktop ? '6px' : '4px') + '"><a href="' + tautan(it) + '">' + esc(it.title) + '</a></h3>' +
      '<p style="font-size:13px;margin:' + (desktop ? '10px' : '6px') + ' 0 0;line-height:1.5">' + esc(kutipan(it, 110)) + '</p></div>';
    return desktop
      ? '<div class="card" style="color:#242424;padding:0">' + isi + '</div>'
      : '<div class="card">' + isi + '</div>';
  }

  function isi(items) {
    var urut = items.slice().sort(function (a, b) { return new Date(b.published_at) - new Date(a.published_at); });
    if (!urut.length) return;

    // Ticker LIVE: berita breaking terbaru, kalau tidak ada pakai berita terbaru
    var live = urut.find(function (i) { return i.breaking; }) || urut[0];
    document.querySelectorAll('.live-title').forEach(function (a) {
      a.textContent = live.title; a.href = tautan(live);
    });

    // Hero carousel (maks 5)
    var hero = urut.slice(0, 5);
    var hm = document.querySelector('[data-hero-m]');
    if (hm) { hm.innerHTML = hero.map(slideMobile).join(''); document.querySelector('[data-titik-m]').innerHTML = titik(hero.length); }
    var hd = document.querySelector('[data-hero-d]');
    if (hd) { hd.innerHTML = hero.map(slideDesktop).join(''); document.querySelector('[data-titik-d]').innerHTML = titik(hero.length); }

    // 10 Berita Utama: daftar terbaru (maks 10)
    var utama = urut.slice(0, 10);
    var um = document.querySelector('[data-utama-m]');
    if (um) um.innerHTML = utama.map(function (it, i) { return barisMobile(it, i, i === utama.length - 1); }).join('');
    var ud = document.querySelector('[data-utama-d]');
    if (ud) ud.innerHTML = utama.map(function (it, i) { return barisDesktop(it, i, i === utama.length - 1); }).join('');

    // Rubrik Khusus: berita berikutnya (maks 4); sembunyikan seksi bila kosong
    var rubrik = urut.slice(10, 14);
    document.querySelectorAll('[data-rubrik-sec]').forEach(function (sec) {
      if (!rubrik.length) { sec.style.display = 'none'; return; }
      var box = sec.querySelector('[data-rubrik]');
      if (box) box.innerHTML = rubrik.map(function (it) { return kartuRubrik(it, box.hasAttribute('data-desktop')); }).join('');
    });

    // Paling Populer (aside desktop): 5 judul terbaru
    var pop = document.querySelector('[data-populer]');
    if (pop) {
      pop.innerHTML = urut.slice(0, 5).map(function (it, i, arr) {
        return '<li style="display:flex;gap:12px;padding:10px 0;' + (i < arr.length - 1 ? 'border-bottom:1px solid #E5E3DE' : '') + '"><b style="font-size:24px;color:#CC9C44;font-family:Newsreader,serif">' + (i + 1) + '</b><a href="' + tautan(it) + '">' + esc(it.title) + '</a></li>';
      }).join('');
    }
  }

  // Tanggal hari ini pada bilah atas desktop
  document.querySelectorAll('.tgl-sekarang').forEach(function (s) {
    s.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  });

  fetch('data/berita.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { isi(d.items || []); })
    .catch(function () { /* biarkan tampilan bawaan bila data gagal dimuat */ });
})();
