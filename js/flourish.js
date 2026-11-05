/**
 * ==================================================================
 *  BABAD SURAKARTA: JEJAK YANG HILANG
 *  flourish.js — Sentuhan Akhir Antarmuka (Langkah 4)
 * ------------------------------------------------------------------
 *  Berkas ini MURNI dekoratif: bila dihapus, aplikasi tetap berjalan.
 *  Ia hanya mendengarkan event dari app.js dan core.js:
 *
 *   - BabadEfek.balikLembar(fn) : dipanggil app.js saat berpindah view
 *   - 'jurnal:berubah'          : segel dibuka / jawaban belum tepat
 *   - 'lencana:dianugerahkan'   : upacara penganugerahan lencana
 *
 *  Muat SETELAH app.js:
 *    <script src="js/flourish.js"></script>
 * ==================================================================
 */
(function (global) {
  'use strict';

  const doc = global.document;
  const $ = (sel, akar = doc) => akar.querySelector(sel);

  const kurangiGerak = () =>
    Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /**
   * Putar ulang animasi CSS pada sebuah elemen, lalu lepas kelasnya.
   * @param {Element} el
   * @param {string} kelas      kelas animasi di jurnal.css
   * @param {number} [tundaMs]  penundaan sebelum mulai
   */
  function putarAnimasi(el, kelas, tundaMs = 0) {
    if (!el || kurangiGerak()) return;
    el.classList.remove(kelas);
    void el.offsetWidth; // paksa reflow agar animasi bisa diputar ulang
    el.style.animationDelay = tundaMs ? `${tundaMs}ms` : '';
    el.classList.add(kelas);

    const selesai = (e) => {
      if (e.target !== el) return; // abaikan animasi milik elemen anak
      el.classList.remove(kelas);
      el.style.animationDelay = '';
      el.removeEventListener('animationend', selesai);
    };
    el.addEventListener('animationend', selesai);
  }

  /* ================================================================
   * 1. BALIK LEMBAR — transisi antar-view
   * ----------------------------------------------------------------
   * Memakai View Transitions API (Chrome/Edge Android, Safari 18+).
   * Peramban lain mendapat animasi .lembar-masuk sebagai cadangan.
   * ================================================================ */
  function balikLembar(gantiIsi) {
    if (kurangiGerak()) { gantiIsi(); return; }

    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(gantiIsi);
      return;
    }

    gantiIsi();
    putarAnimasi($('#panggung'), 'lembar-masuk');
  }

  /* ================================================================
   * 2. REAKSI TERHADAP PERUBAHAN JURNAL
   * ----------------------------------------------------------------
   * Listener app.js terdaftar lebih dulu, jadi DOM sudah diperbarui
   * ketika fungsi di bawah ini berjalan.
   * ================================================================ */

  /** Segel terbuka: lore, relikui, dan teka-teki meresap bergantian. */
  function rayakanSegelTerbuka() {
    ['#blok-lore', '#blok-relikui', '#blok-teka-teki'].forEach((sel, i) => {
      putarAnimasi($(sel), 'tinta-muncul', 150 + i * 260);
    });
  }

  /** Jawaban belum tepat: getar halus, dan petunjuk baru meresap. */
  function tanggapiPercobaan() {
    putarAnimasi($('#masukan-jawaban'), 'goyang');

    const daftar = $('#daftar-petunjuk');
    if (!daftar) return;
    const terlihat = Number(daftar.dataset.terlihat || 0);
    const jumlah = daftar.children.length;

    for (let i = terlihat; i < jumlah; i++) {
      putarAnimasi(daftar.children[i], 'tinta-muncul', 200);
    }
    daftar.dataset.terlihat = String(jumlah);
  }

  global.addEventListener('jurnal:berubah', (e) => {
    const alasan = e.detail && e.detail.alasan;
    if (alasan === 'situs-dibuka') rayakanSegelTerbuka();
    else if (alasan === 'percobaan') tanggapiPercobaan();
  });

  // Saat berpindah situs, hitungan petunjuk yang sudah tampil diatur ulang.
  global.addEventListener('hashchange', () => {
    const daftar = $('#daftar-petunjuk');
    if (daftar) daftar.dataset.terlihat = String(daftar.children.length);
  });

  /* ================================================================
   * 3. UPACARA PENGANUGERAHAN LENCANA
   * ----------------------------------------------------------------
   * Memakai <dialog> bawaan: fokus terkunci di dalam dialog, tombol
   * Esc menutup, dan fokus kembali ke tempat semula setelah ditutup.
   * ================================================================ */
  let dialog = null;

  /** Kerangka dialog berisi markup statis; data diisi via textContent. */
  function siapkanDialog() {
    if (dialog) return dialog;

    dialog = doc.createElement('dialog');
    dialog.className = 'upacara';
    dialog.setAttribute('aria-labelledby', 'upacara-nama');
    dialog.setAttribute('aria-describedby', 'upacara-makna');
    dialog.innerHTML = `
      <div class="upacara-kertas">
        <p class="upacara-tahap font-judul text-sm font-semibold uppercase tracking-[0.3em] text-sepia"
           style="--tunda:.05s">Lencana Nilai Disematkan</p>

        <div class="upacara-segel font-judul" aria-hidden="true"><span data-isi="simbol"></span></div>

        <h2 id="upacara-nama" data-isi="nama"
            class="upacara-tahap font-judul text-3xl font-semibold leading-tight"
            style="--tunda:.95s"></h2>
        <p data-isi="sila" class="upacara-tahap mt-1 text-sm italic text-tinta-pudar"
           style="--tunda:1.1s"></p>

        <div class="upacara-garis upacara-tahap" aria-hidden="true" style="--tunda:1.2s"></div>

        <p id="upacara-makna" data-isi="makna"
           class="upacara-tahap text-[16px] leading-relaxed text-tinta-pudar"
           style="--tunda:1.35s"></p>

        <div class="upacara-tahap mt-6 flex flex-col gap-3" style="--tunda:1.6s">
          <button type="button" data-aksi="tutup" class="tombol-utama w-full">Simpan dalam Jurnal</button>
          <a href="#/lencana" data-aksi="lemari"
             class="inline-flex min-h-[44px] items-center justify-center text-sm text-sepia underline decoration-dotted underline-offset-4">
            Buka Lemari Lencana
          </a>
        </div>
      </div>`;

    doc.body.append(dialog);

    dialog.querySelector('[data-aksi="tutup"]').addEventListener('click', tutupUpacara);
    dialog.querySelector('[data-aksi="lemari"]').addEventListener('click', tutupUpacara);

    // Ketuk area gelap di luar kertas untuk menutup.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) tutupUpacara(); });

    // Tombol Esc: tutup dengan animasi, bukan seketika.
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); tutupUpacara(); });

    return dialog;
  }

  function bukaUpacara(lencana) {
    const d = siapkanDialog();
    const isi = (nama) => d.querySelector(`[data-isi="${nama}"]`);

    isi('simbol').textContent = lencana.simbol || '✦';
    isi('nama').textContent = lencana.nama;
    isi('sila').textContent = [lencana.sila, lencana.silaTeks].filter(Boolean).join(' · ');
    isi('makna').textContent = lencana.makna || '';

    d.classList.remove('menutup');
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', ''); // peramban sangat lama

    // Getaran pendek seperti cap yang ditekan (bila didukung ponsel).
    if (!kurangiGerak() && typeof navigator.vibrate === 'function') {
      setTimeout(() => { try { navigator.vibrate([18, 50, 30]); } catch { /* abaikan */ } }, 550);
    }
  }

  function tutupUpacara() {
    if (!dialog || !dialog.open) return;

    const tutupSekarang = () => {
      dialog.classList.remove('menutup');
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    };

    if (kurangiGerak()) { tutupSekarang(); return; }

    dialog.classList.add('menutup');
    const selesai = (e) => {
      if (e.target !== dialog) return;
      dialog.removeEventListener('animationend', selesai);
      tutupSekarang();
    };
    dialog.addEventListener('animationend', selesai);
  }

  global.addEventListener('lencana:dianugerahkan', (e) => {
    const { lencana } = e.detail || {};
    if (!lencana) return;

    // Refleksi penutup meresap lebih dulu, baru upacara dimulai.
    putarAnimasi($('#blok-tersingkap'), 'tinta-muncul');
    putarAnimasi($('#hitung-lencana'), 'denyut', 300);

    setTimeout(() => bukaUpacara(lencana), kurangiGerak() ? 0 : 700);
  });

  /* ================================================================
   * EKSPOR
   * ================================================================ */
  global.BabadEfek = Object.freeze({ balikLembar, bukaUpacara, tutupUpacara, putarAnimasi });
})(window);
