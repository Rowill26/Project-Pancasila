/**
 * ==================================================================
 *  BABAD SURAKARTA: JEJAK YANG HILANG
 *  app.js — Perekat Antarmuka (Langkah 3)
 * ------------------------------------------------------------------
 *  Tugas berkas ini:
 *   - Router berbasis hash (#/daftar, #/situs/:id, #/lencana) —
 *     aman untuk GitHub Pages karena tidak memerlukan server.
 *   - Mengisi template HTML dari BabadArsip + Babad.Jurnal.
 *   - Menangani tombol GPS, sandi relikui, dan jawaban teka-teki.
 *
 *  Semua teks dari arsip diisi via textContent (bukan innerHTML).
 *  Transisi halaman & upacara lencana ditambahkan di Langkah 4 melalui
 *  event `lencana:dianugerahkan` dan fungsi `tampilkanView`.
 * ==================================================================
 */
(function (global) {
  'use strict';

  if (!global.Babad || !global.BabadArsip) {
    console.error('[Babad] core.js atau data.js belum dimuat sebelum app.js.');
    return;
  }

  const { Jurnal, Teks, Gerbang, Sandi, STATUS } = global.Babad;
  const Arsip = global.BabadArsip;

  /* ---------- Utilitas kecil ---------- */
  const $ = (sel, akar = document) => akar.querySelector(sel);
  const $$ = (sel, akar = document) => Array.from(akar.querySelectorAll(sel));

  const ROMAWI = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const romawi = (n) => ROMAWI[n] || String(n);

  const LABEL_STATUS = {
    [STATUS.TERKUNCI]: 'Tersegel',
    [STATUS.TERBUKA]: 'Terbuka',
    [STATUS.TERSINGKAP]: 'Tersingkap'
  };

  const formatTanggal = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  /** Tulis pesan bernada ('berhasil' | 'gagal' | 'netral') ke elemen status. */
  function tulisPesan(el, teks, nada = 'netral') {
    el.textContent = teks;
    el.dataset.nada = nada;
  }

  /** Tandai tombol sedang bekerja, simpan label aslinya. */
  function setSibuk(tombol, sibuk, labelSibuk = 'Menunggu…') {
    if (sibuk) {
      tombol.dataset.labelAsli = tombol.textContent;
      tombol.textContent = labelSibuk;
      tombol.disabled = true;
      tombol.setAttribute('aria-busy', 'true');
    } else {
      tombol.textContent = tombol.dataset.labelAsli || tombol.textContent;
      tombol.disabled = false;
      tombol.removeAttribute('aria-busy');
    }
  }

  /* ================================================================
   * ROUTER (hash)
   * ================================================================ */
  function uraiRute() {
    const jalur = global.location.hash.replace(/^#\/?/, '').split('?')[0];
    const bagian = jalur.split('/').filter(Boolean);

    if (bagian[0] === 'daftar') return { view: 'daftar' };
    if (bagian[0] === 'lencana') return { view: 'lencana' };
    if (bagian[0] === 'situs' && bagian[1]) return { view: 'situs', id: decodeURIComponent(bagian[1]) };
    return { view: 'sampul' };
  }

  /**
   * Ganti view yang tampil. Langkah 4 akan membungkus fungsi ini
   * dengan transisi lembar kertas.
   */
  function tampilkanView(nama) {
    $$('[data-view]').forEach((v) => { v.hidden = v.dataset.view !== nama; });
    $$('[data-nav]').forEach((a) => {
      if (a.dataset.nav === nama) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    const kontainer = document.getElementById('jurnal-kontainer');
    if (kontainer) {
      if (nama === 'sampul') {
        // Halaman pertama (Sampul) menggunakan fcover1.jpg
        kontainer.style.backgroundImage = "url('fcover2.jpg')";
        kontainer.style.backgroundSize = "cover";
        kontainer.style.backgroundPosition = "center";
      } else {
        // Halaman lainnya (daftar, situs, lencana) menggunakan 2cover.jpg
        kontainer.style.backgroundImage = "url('2cover.jpg')";
        kontainer.style.backgroundSize = "cover";
        kontainer.style.backgroundPosition = "center";
      }
    }

    global.scrollTo({ top: 0 });

    const judul = $(`[data-view="${nama}"] h1, [data-view="${nama}"] h2`);
    if (judul) { judul.tabIndex = -1; judul.focus({ preventScroll: true }); }
  }

  let idSitusAktif = null;
  const situsAktif = () => (idSitusAktif ? Arsip.cari(idSitusAktif) : null);

  /** Isi konten view sesuai state jurnal (tanpa memindah view/fokus). */
  function renderIsi(rute) {
    if (rute.view === 'daftar') renderDaftar();
    else if (rute.view === 'lencana') renderLencana();
    else if (rute.view === 'situs') {
      const s = Arsip.cari(rute.id);
      if (s) renderSitus(s);
    }
    perbaruiKepala();
  }

  let kunciLembarAktif = null; // "view:id" lembar yang sedang tampil

  /** Dipanggil setiap kali hash berubah. */
  function navigasi() {
    const rute = uraiRute();
    let situsBaru = false;

    if (rute.view === 'situs') {
      if (!Arsip.cari(rute.id)) { global.location.replace('#/daftar'); return; }
      situsBaru = rute.id !== idSitusAktif;
      idSitusAktif = rute.id;
    } else {
      idSitusAktif = null;
    }

    const gantiIsi = () => {
      if (situsBaru) aturUlangSitus();
      renderIsi(rute);
      tampilkanView(rute.view);
      if (rute.view === 'situs') cobaKodeDariURL(situsAktif());
    };

    // Langkah 4: balik lembar bila berpindah halaman (bukan pada muatan pertama).
    const kunci = `${rute.view}:${rute.id || ''}`;
    const efek = global.BabadEfek;
    if (efek && kunciLembarAktif !== null && kunci !== kunciLembarAktif) efek.balikLembar(gantiIsi);
    else gantiIsi();
    kunciLembarAktif = kunci;
  }

  /* ================================================================
   * RENDER: KEPALA
   * ================================================================ */
  function perbaruiKepala() {
    $('#hitung-lencana').textContent = Jurnal.daftarLencana().length;
  }

  /* ================================================================
   * RENDER: DAFTAR LEMBAR
   * ================================================================ */
  function renderDaftar() {
    const tpl = $('#tpl-kartu-situs');

    const kartu = Arsip.semua().map((s) => {
      const node = tpl.content.cloneNode(true);
      const ref = (n) => node.querySelector(`[data-ref="${n}"]`);
      const status = Jurnal.statusSitus(s.id);

      ref('tautan').href = `#/situs/${encodeURIComponent(s.id)}`;
      ref('nomor').textContent = `Lembar ${romawi(s.urutan)}`;
      ref('nama').textContent = s.nama;
      ref('kawasan').textContent = s.kawasan;
      ref('stempel').textContent = LABEL_STATUS[status];
      ref('stempel').dataset.status = status;
      ref('nilai').textContent = status === STATUS.TERSINGKAP
        ? `${s.lencana.nama} telah disematkan.`
        : `Menyimpan jejak ${s.lencana.sila}: ${s.lencana.silaTeks}.`;

      return node;
    });

    $('#daftar-situs').replaceChildren(...kartu);

    const r = Jurnal.ringkasan(Arsip.jumlah());
    $('#ringkasan-jurnal').textContent = r.tersingkap === r.totalSitus
      ? 'Seluruh lembar telah kembali bersuara.'
      : `${r.tersingkap} dari ${r.totalSitus} lembar telah tersingkap.`;

    $('#peringatan-penyimpanan').hidden = Jurnal.penyimpananPermanen();
  }

  /* ================================================================
   * RENDER: SITUS
   * ================================================================ */

  /** Bersihkan pesan & formulir saat berpindah ke situs lain. */
  function aturUlangSitus() {
    tulisPesan($('#pesan-gerbang'), '');
    tulisPesan($('#pesan-jawaban'), '');
    $('#form-sandi').hidden = true;
    $('#tombol-qr').setAttribute('aria-expanded', 'false');
    $('#masukan-sandi').value = '';
    $('#masukan-jawaban').value = '';
  }

  function renderSitus(s) {
    const status = Jurnal.statusSitus(s.id);
    const terkunci = status === STATUS.TERKUNCI;
    const terbuka = status === STATUS.TERBUKA;
    const tersingkap = status === STATUS.TERSINGKAP;

    // Kepala lembar
    $('#situs-nomor').textContent = `Lembar ${romawi(s.urutan)} · ${s.lencana.sila}`;
    $('#situs-nama').textContent = s.nama;
    $('#situs-kawasan').textContent = s.kawasan;
    $('#situs-adab').textContent = s.adab;
    $('#tautan-peta').href =
      `https://www.google.com/maps/dir/?api=1&destination=${s.koordinat.lat},${s.koordinat.lng}`;

    // Visibilitas blok sesuai status
    $('#blok-terkunci').hidden = !terkunci;
    $('#blok-lore').hidden = terkunci;
    $('#blok-relikui').hidden = terkunci;
    $('#blok-teka-teki').hidden = !terbuka;
    $('#blok-tersingkap').hidden = !tersingkap;

    if (terkunci) return;

    // Lore
    $('#lore-judul').textContent = s.lore.judul;
    $('#lore-isi').replaceChildren(...s.lore.paragraf.map((teks) => {
      const p = document.createElement('p');
      p.textContent = teks;
      return p;
    }));

    pasangRelikui(s.relikui);

    if (terbuka) {
      $('#teka-teki-pertanyaan').textContent = s.tekaTeki.pertanyaan;
      const percobaan = Jurnal.ambil().situs[s.id]?.percobaan ?? 0;
      renderPetunjuk(Arsip.petunjukTerbuka(s.id, percobaan));
    }

    if (tersingkap) {
      $('#penyingkapan-isi').textContent = s.tekaTeki.penyingkapan;
      $('#lencana-simbol').textContent = s.lencana.simbol;
      $('#lencana-nama').textContent = s.lencana.nama;
      $('#lencana-sila').textContent = `${s.lencana.sila} · ${s.lencana.silaTeks}`;
    }
  }

  function renderPetunjuk(daftar) {
    $('#daftar-petunjuk').replaceChildren(...daftar.map((p, i) => {
      const li = document.createElement('li');
      li.className = 'border-l-2 border-emas/70 pl-3 text-[15px] italic leading-relaxed text-tinta-pudar';
      const label = document.createElement('span');
      label.className = 'not-italic font-semibold text-sepia';
      label.textContent = `Catatan pinggir ${romawi(i + 1)}. `;
      li.append(label, document.createTextNode(p.teks));
      return li;
    }));
  }

  /* Gambar relikui dengan pengganti bila berkas belum ada */
  const gambar = $('#relikui-gambar');
  const pengganti = $('#relikui-pengganti');

  gambar.addEventListener('error', () => { gambar.hidden = true; pengganti.hidden = false; });
  gambar.addEventListener('load', () => { gambar.hidden = false; pengganti.hidden = true; });

  function pasangRelikui(r) {
    $('#relikui-keterangan').textContent = r.keterangan;
    if (gambar.dataset.src === r.src) return; // hindari memuat ulang
    gambar.dataset.src = r.src;
    gambar.alt = r.alt;
    gambar.hidden = false;
    pengganti.hidden = true;
    gambar.src = r.src;
  }

  /* ================================================================
   * RENDER: LEMARI LENCANA
   * ================================================================ */
  function renderLencana() {
    const dimiliki = new Map(Jurnal.daftarLencana().map((l) => [l.id, l]));
    const tpl = $('#tpl-kartu-lencana');

    const kartu = Arsip.semua().map((s) => {
      const node = tpl.content.cloneNode(true);
      const ref = (n) => node.querySelector(`[data-ref="${n}"]`);
      const milik = dimiliki.get(s.lencana.id);

      ref('kartu').dataset.diperoleh = String(Boolean(milik));
      ref('simbol').textContent = milik ? s.lencana.simbol : '?';
      ref('sila').textContent = `${s.lencana.sila} · ${s.lencana.silaTeks}`;

      if (milik) {
        ref('nama').textContent = s.lencana.nama;
        ref('makna').textContent = s.lencana.makna;
        ref('tanggal').textContent = `Disematkan pada ${formatTanggal(milik.diperolehPada)} · ${s.nama}`;
      } else {
        ref('nama').textContent = 'Lencana yang Tersembunyi';
        ref('makna').textContent = `Singkaplah Lembar ${romawi(s.urutan)} untuk menemukannya.`;
        ref('tanggal').textContent = '';
      }
      return node;
    });

    $('#daftar-lencana').replaceChildren(...kartu);
  }

  /* ================================================================
   * INTERAKSI: GERBANG KEHADIRAN
   * ================================================================ */
  function bukaFormSandi() {
    $('#form-sandi').hidden = false;
    $('#tombol-qr').setAttribute('aria-expanded', 'true');
    $('#masukan-sandi').focus();
  }

  $('#tombol-gps').addEventListener('click', async (e) => {
    const s = situsAktif();
    if (!s) return;
    const tombol = e.currentTarget;
    const pesan = $('#pesan-gerbang');

    setSibuk(tombol, true, 'Membaca jejak…');
    tulisPesan(pesan, 'Menunggu isyarat dari langit…');

    const hasil = await Gerbang.denganGPS(s);

    setSibuk(tombol, false);
    tulisPesan(pesan, hasil.pesan, hasil.berhasil ? 'berhasil' : 'gagal');

    // GPS benar-benar gagal (bukan sekadar jauh) → tawarkan sandi relikui.
    if (!hasil.berhasil && hasil.kodeGalat) bukaFormSandi();
  });

  $('#tombol-qr').addEventListener('click', () => {
    const form = $('#form-sandi');
    if (form.hidden) bukaFormSandi();
    else { form.hidden = true; $('#tombol-qr').setAttribute('aria-expanded', 'false'); }
  });

  $('#form-sandi').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = situsAktif();
    if (!s) return;
    const hasil = Gerbang.denganSandi(s, $('#masukan-sandi').value);
    tulisPesan($('#pesan-gerbang'), hasil.pesan, hasil.berhasil ? 'berhasil' : 'gagal');
    if (!hasil.berhasil) $('#masukan-sandi').select();
  });

  /** Bila halaman dibuka dari QR fisik (…#/situs/id?kode=XXX), buka segel otomatis. */
  function cobaKodeDariURL(s) {
    const kode = Sandi.dariURL('kode');
    if (!s || !kode || Jurnal.statusSitus(s.id) !== STATUS.TERKUNCI) return;
    const hasil = Gerbang.denganSandi(s, kode);
    tulisPesan($('#pesan-gerbang'), hasil.pesan, hasil.berhasil ? 'berhasil' : 'gagal');
    // Bersihkan kode dari URL agar tidak tersimpan di riwayat/berbagi tautan.
    global.history.replaceState(null, '', `#/situs/${encodeURIComponent(s.id)}`);
  }

  /* ================================================================
   * INTERAKSI: TEKA-TEKI
   * ================================================================ */
  const PESAN_BELUM_TEPAT = [
    'Catatan itu belum menyentuh inti. Amati relikui sekali lagi, perlahan.',
    'Belum. Terkadang jawaban bersembunyi pada hal yang paling tenang.',
    'Jurnal menunggu dengan sabar. Baca kembali lore di atas; sejarawan meninggalkan jejaknya di sana.'
  ];

  $('#form-jawaban').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = situsAktif();
    if (!s) return;

    const kolom = $('#masukan-jawaban');
    const pesan = $('#pesan-jawaban');

    if (!Teks.normalisasi(kolom.value)) {
      tulisPesan(pesan, 'Jurnal tak dapat mencatat lembar kosong. Tuliskan apa yang kamu amati.');
      kolom.focus();
      return;
    }

    if (Teks.cocokkan(kolom.value, s.tekaTeki.kataKunci)) {
      kolom.value = '';
      tulisPesan(pesan, '');
      Jurnal.selesaikanTekaTeki(s.id, s.lencana);

      // Kait untuk Langkah 4: upacara penganugerahan lencana.
      global.dispatchEvent(new CustomEvent('lencana:dianugerahkan', {
        detail: { situs: s, lencana: s.lencana }
      }));
      return;
    }

    const n = Jurnal.catatPercobaan(s.id);
    tulisPesan(pesan, PESAN_BELUM_TEPAT[(n - 1) % PESAN_BELUM_TEPAT.length], 'gagal');
  });

  /* ================================================================
   * INTERAKSI: MULAI ULANG
   * ================================================================ */
  $('#tombol-hapus-jurnal').addEventListener('click', () => {
    const yakin = global.confirm('Seluruh catatan dan lencana dalam jurnal ini akan dihapus. Lanjutkan?');
    if (!yakin) return;
    Jurnal.hapusSemua();
    global.location.hash = '#/';
  });

  /* ================================================================
   * INTERAKSI: SERET KE KIRI PADA SAMPUL (MEMBALIK BUKU)
   * ================================================================ */
  let titikAwalX = 0;
  const sampulEl = document.querySelector('[data-view="sampul"]');
  
  if (sampulEl) {
    // Dukungan layar sentuh (Mobile)
    sampulEl.addEventListener('touchstart', (e) => {
      titikAwalX = e.touches[0].clientX;
    }, { passive: true });

    sampulEl.addEventListener('touchend', (e) => {
      let selisihX = e.changedTouches[0].clientX - titikAwalX;
      // Jika diseret ke kiri lebih dari 50 piksel, buka halaman daftar
      if (selisihX < -50) {
        global.location.hash = '#/daftar';
      }
    }, { passive: true });

    // Dukungan tetikus (Desktop Mouse Drag)
    let isMouseDown = false;
    sampulEl.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      titikAwalX = e.clientX;
    });

    sampulEl.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      let selisihX = e.clientX - titikAwalX;
      if (selisihX < -50) {
        global.location.hash = '#/daftar';
      }
    });
  }

  /* ================================================================
   * INISIALISASI
   * ================================================================ */
  global.addEventListener('hashchange', navigasi);
  global.addEventListener('jurnal:berubah', () => renderIsi(uraiRute()));

  Jurnal.inisialisasi();
  navigasi();

  // Diekspos untuk Langkah 4 (transisi akan membungkus fungsi ini).
  global.BabadUI = { tampilkanView, navigasi, uraiRute };
})(window);
