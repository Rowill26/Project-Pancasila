/**
 * ==================================================================
 *  BABAD SURAKARTA: JEJAK YANG HILANG
 *  core.js — Logika Inti (Langkah 1)
 * ------------------------------------------------------------------
 *  Isi modul:
 *   1. Penyimpanan : adaptor localStorage yang aman (dengan cadangan memori)
 *   2. Jurnal      : progres Peneliti (situs terbuka, tersingkap, lencana)
 *   3. Teks        : normalisasi & pencocokan jawaban reflektif
 *   4. Lokasi      : Geolocation API + formula Haversine (meter)
 *   5. Sandi       : fallback "Pindai Kode QR" (sandi relikui manual)
 *   6. Gerbang     : orkestrator pembukaan situs (GPS / sandi)
 *
 *  Pola: namespace global `window.Babad` (IIFE), BUKAN ES Modules.
 *  Alasannya: berkas tetap berjalan saat index.html dibuka langsung
 *  (file://) oleh dosen penguji, maupun di GitHub Pages — tanpa
 *  server, tanpa bundler, tanpa masalah CORS pada <script type=module>.
 *
 *  Pemakaian di HTML:
 *    <script src="js/core.js"></script>
 *    <script> Babad.Jurnal.inisialisasi(); </script>
 * ==================================================================
 */
(function (global) {
  'use strict';

  /* ================================================================
   * 0. KONFIGURASI & KONSTANTA
   * ================================================================ */
  const KONFIG = Object.freeze({
    KUNCI_PENYIMPANAN: 'babad-surakarta:jurnal',
    VERSI_SKEMA: 1,

    RADIUS_DEFAULT_M: 100,          // jarak maksimum ke situs (meter)
    BATAS_TOLERANSI_AKURASI_M: 50,  // kelonggaran maks dari akurasi GPS
    BATAS_AKURASI_KABUR_M: 500,     // di atas ini, posisi dianggap terlalu samar

    GEO_OPSI: Object.freeze({
      enableHighAccuracy: true,     // minta GPS asli, bukan sekadar Wi-Fi/seluler
      timeout: 15000,               // 15 detik menunggu satelit
      maximumAge: 30000             // boleh pakai posisi cache ≤ 30 detik
    }),
    GEO_PENGAMAN_EKSTRA_MS: 10000   // pengaman jika peramban tak pernah merespons
  });

  /** Status setiap situs dalam jurnal. */
  const STATUS = Object.freeze({
    TERKUNCI: 'terkunci',     // belum dikunjungi
    TERBUKA: 'terbuka',       // Peneliti sudah tiba, teka-teki dapat dibaca
    TERSINGKAP: 'tersingkap'  // teka-teki terjawab, lencana dianugerahkan
  });

  /** Cara Peneliti membuka situs (dicatat untuk refleksi, bukan skor). */
  const METODE = Object.freeze({ GPS: 'gps', SANDI: 'sandi' });

  const sekarang = () => new Date().toISOString();

  /* ================================================================
   * 1. PENYIMPANAN — adaptor localStorage yang tahan galat
   * ----------------------------------------------------------------
   * Safari mode privat, kuota penuh, atau pengaturan ketat dapat
   * membuat localStorage melempar galat. Adaptor ini tidak pernah
   * membuat aplikasi mogok: bila gagal, data tetap hidup di memori
   * selama tab terbuka.
   * ================================================================ */
  const Penyimpanan = (() => {
    const memori = {};
    let tersedia = false;

    try {
      const uji = '__babad_uji__';
      global.localStorage.setItem(uji, uji);
      global.localStorage.removeItem(uji);
      tersedia = true;
    } catch (e) {
      console.warn('[Babad] localStorage tidak tersedia; progres hanya tersimpan sementara.', e);
    }

    return {
      tersedia: () => tersedia,

      baca(kunci) {
        if (!tersedia) return memori[kunci] ?? null;
        try { return global.localStorage.getItem(kunci); }
        catch { return memori[kunci] ?? null; }
      },

      tulis(kunci, nilai) {
        memori[kunci] = nilai;
        if (!tersedia) return false;
        try { global.localStorage.setItem(kunci, nilai); return true; }
        catch (e) { console.warn('[Babad] Gagal menulis jurnal ke penyimpanan.', e); return false; }
      },

      hapus(kunci) {
        delete memori[kunci];
        if (!tersedia) return;
        try { global.localStorage.removeItem(kunci); } catch { /* abaikan */ }
      }
    };
  })();

  /* ================================================================
   * 2. JURNAL — state progres Peneliti
   * ----------------------------------------------------------------
   * Skema (versi 1):
   * {
   *   versi: 1,
   *   dibuatPada: ISO-string,
   *   diperbaruiPada: ISO-string | null,
   *   situs: {
   *     [idSitus]: {
   *       status: 'terbuka' | 'tersingkap',
   *       metode: 'gps' | 'sandi',
   *       dibukaPada: ISO-string,
   *       disingkapPada: ISO-string | null,
   *       percobaan: number        // dipakai untuk memunculkan petunjuk
   *     }
   *   },
   *   lencana: [
   *     { id, nama, sila, dariSitus, diperolehPada }
   *   ]
   * }
   *
   * Setiap perubahan memancarkan event `jurnal:berubah` pada window,
   * sehingga UI (Langkah 3) cukup mendengarkan satu event saja.
   * ================================================================ */
  let cache = null;

  function jurnalBaru() {
    return {
      versi: KONFIG.VERSI_SKEMA,
      dibuatPada: sekarang(),
      diperbaruiPada: null,
      situs: {},
      lencana: []
    };
  }

  /** Validasi bentuk data hasil JSON.parse; kembalikan null bila rusak. */
  function sahkan(data) {
    if (!data || typeof data !== 'object') return null;
    if (!data.situs || typeof data.situs !== 'object' || Array.isArray(data.situs)) return null;
    if (!Array.isArray(data.lencana)) return null;
    return data;
  }

  /** Tempat menyesuaikan skema lama ke versi terbaru di masa depan. */
  function migrasi(data) {
    // Contoh pola: if (data.versi === 1) { ...ubah ke v2...; data.versi = 2; }
    data.versi = KONFIG.VERSI_SKEMA;
    return data;
  }

  /** Salinan dalam (deep copy) agar UI tidak mengubah state secara langsung. */
  const salin = (obj) => JSON.parse(JSON.stringify(obj));

  function umumkan(alasan) {
    global.dispatchEvent(new CustomEvent('jurnal:berubah', {
      detail: { alasan, jurnal: salin(cache) }
    }));
  }

  function muat() {
    if (cache) return cache;

    let data = null;
    const mentah = Penyimpanan.baca(KONFIG.KUNCI_PENYIMPANAN);
    if (mentah) {
      try { data = sahkan(JSON.parse(mentah)); }
      catch (e) { console.warn('[Babad] Jurnal rusak; membuka lembaran baru.', e); }
    }

    const perluDisimpan = !data || data.versi !== KONFIG.VERSI_SKEMA;
    cache = !data ? jurnalBaru()
          : data.versi !== KONFIG.VERSI_SKEMA ? migrasi(data)
          : data;

    if (perluDisimpan) simpan('inisialisasi');
    return cache;
  }

  function simpan(alasan) {
    cache.diperbaruiPada = sekarang();
    Penyimpanan.tulis(KONFIG.KUNCI_PENYIMPANAN, JSON.stringify(cache));
    umumkan(alasan);
  }

  // Sinkronisasi antar-tab: bila jurnal berubah di tab lain, muat ulang.
  global.addEventListener('storage', (e) => {
    if (e.key !== KONFIG.KUNCI_PENYIMPANAN) return;
    cache = null;
    muat();
    umumkan('sinkron-tab');
  });

  const Jurnal = {
    /** Panggil sekali saat aplikasi dimulai. Mengembalikan salinan jurnal. */
    inisialisasi() { return salin(muat()); },

    /** Salinan jurnal terkini (hanya-baca). */
    ambil() { return salin(muat()); },

    /** Status satu situs: 'terkunci' | 'terbuka' | 'tersingkap'. */
    statusSitus(idSitus) {
      return muat().situs[idSitus]?.status ?? STATUS.TERKUNCI;
    },

    /**
     * Tandai situs sebagai TERBUKA (Peneliti telah tiba).
     * @returns {boolean} true bila baru dibuka; false bila sudah terbuka sebelumnya.
     */
    bukaSitus(idSitus, metode = METODE.GPS) {
      const j = muat();
      if (j.situs[idSitus]) return false;
      j.situs[idSitus] = {
        status: STATUS.TERBUKA,
        metode,
        dibukaPada: sekarang(),
        disingkapPada: null,
        percobaan: 0
      };
      simpan('situs-dibuka');
      return true;
    },

    /** Catat satu jawaban yang belum tepat. Mengembalikan jumlah percobaan. */
    catatPercobaan(idSitus) {
      const rekam = muat().situs[idSitus];
      if (!rekam || rekam.status !== STATUS.TERBUKA) return 0;
      rekam.percobaan += 1;
      simpan('percobaan');
      return rekam.percobaan;
    },

    /**
     * Selesaikan teka-teki: situs menjadi TERSINGKAP dan lencana dianugerahkan
     * dalam SATU kali simpan (atomik), agar keduanya tak pernah terpisah.
     * @param {string} idSitus
     * @param {{id:string, nama:string, sila:string}} lencana
     * @returns {boolean} true bila berhasil; false bila situs belum terbuka / sudah tersingkap.
     */
    selesaikanTekaTeki(idSitus, lencana) {
      const j = muat();
      const rekam = j.situs[idSitus];
      if (!rekam || rekam.status !== STATUS.TERBUKA) return false;

      rekam.status = STATUS.TERSINGKAP;
      rekam.disingkapPada = sekarang();

      if (lencana && !j.lencana.some((l) => l.id === lencana.id)) {
        j.lencana.push({
          id: lencana.id,
          nama: lencana.nama,
          sila: lencana.sila,
          dariSitus: idSitus,
          diperolehPada: sekarang()
        });
      }
      simpan('teka-teki-tersingkap');
      return true;
    },

    punyaLencana(idLencana) {
      return muat().lencana.some((l) => l.id === idLencana);
    },

    daftarLencana() { return salin(muat().lencana); },

    /** Ringkasan untuk halaman sampul jurnal (bukan skor). */
    ringkasan(totalSitus = 0) {
      const j = muat();
      const nilai = Object.values(j.situs);
      return {
        dikunjungi: nilai.length,
        tersingkap: nilai.filter((s) => s.status === STATUS.TERSINGKAP).length,
        lencana: j.lencana.length,
        totalSitus
      };
    },

    /** Bakar jurnal dan mulai dari lembar kosong (untuk tombol "Mulai Ulang Penelusuran"). */
    hapusSemua() {
      Penyimpanan.hapus(KONFIG.KUNCI_PENYIMPANAN);
      cache = null;
      muat();
      umumkan('jurnal-dihapus');
    },

    penyimpananPermanen: () => Penyimpanan.tersedia()
  };

  /* ================================================================
   * 3. TEKS — normalisasi & pencocokan jawaban
   * ----------------------------------------------------------------
   * Jawaban reflektif sering ditulis sebagai kalimat utuh, misalnya
   * "warna putih di pusatnya". Fungsi `cocokkan` menerima jawaban
   * yang MENGANDUNG kata kunci (sebagai kata utuh), tidak peka huruf
   * besar/kecil, tanda baca, maupun diakritik.
   * ================================================================ */
  function normalisasi(teks) {
    return String(teks ?? '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // é → e
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')                     // buang tanda baca
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * @param {string} masukan          jawaban Peneliti
   * @param {string|string[]} kunci   satu atau beberapa kata kunci/sinonim
   */
  function cocokkan(masukan, kunci) {
    const m = normalisasi(masukan);
    if (!m) return false;
    const daftar = Array.isArray(kunci) ? kunci : [kunci];

    return daftar.some((k) => {
      const n = normalisasi(k);
      if (!n) return false;
      if (m === n) return true;
      // Kata kunci ≥ 4 huruf boleh muncul di dalam kalimat, sebagai kata utuh.
      return n.length >= 4 && ` ${m} `.includes(` ${n} `);
    });
  }

  /* ================================================================
   * 4. LOKASI — Geolocation API + Haversine
   * ================================================================ */
  const RADIUS_BUMI_M = 6371008.8; // radius rata-rata bumi (IUGG), meter

  /** Jarak lingkaran besar antara dua titik (derajat desimal) → meter. */
  function jarakHaversine(lat1, lon1, lat2, lon2) {
    const rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
            + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * RADIUS_BUMI_M * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  /** Galat lokasi dengan kode yang bisa dibaca UI. */
  class GalatLokasi extends Error {
    constructor(kode, pesan) {
      super(pesan);
      this.name = 'GalatLokasi';
      this.kode = kode;
    }
  }

  /** Pesan galat bernada jurnal — langsung bisa ditampilkan di UI. */
  const PESAN_GALAT = Object.freeze({
    TIDAK_DIDUKUNG: 'Peramban ini tak mengenal penunjuk arah. Gunakan sandi relikui yang terpahat di situs.',
    TIDAK_AMAN:     'Penunjuk arah hanya bekerja pada halaman yang aman (HTTPS). Gunakan sandi relikui.',
    DITOLAK:        'Izin lokasi tidak diberikan. Jejakmu tak dapat dibaca tanpa restu—gunakan sandi relikui.',
    TIDAK_TERSEDIA: 'Sinyal langit tak tertangkap. Melangkahlah ke ruang terbuka, atau gunakan sandi relikui.',
    WAKTU_HABIS:    'Penantian terlalu lama. Cobalah sekali lagi, atau gunakan sandi relikui.',
    AKURASI_RENDAH: 'Posisimu masih samar di peta. Berdiamlah sejenak di ruang terbuka, lalu coba lagi.',
    KOORDINAT_SALAH:'Koordinat situs dalam arsip tidak valid. Periksa data situs.'
  });

  /** Bungkus getCurrentPosition menjadi Promise, lengkap dengan pengaman waktu. */
  function ambilPosisi(opsiTambahan = {}) {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        return reject(new GalatLokasi('TIDAK_DIDUKUNG', PESAN_GALAT.TIDAK_DIDUKUNG));
      }
      if (global.isSecureContext === false) {
        return reject(new GalatLokasi('TIDAK_AMAN', PESAN_GALAT.TIDAK_AMAN));
      }

      const opsi = { ...KONFIG.GEO_OPSI, ...opsiTambahan };
      let selesai = false;

      // Sebagian peramban tidak memanggil callback sama sekali bila dialog
      // izin diabaikan (timeout bawaan tidak menghitung waktu dialog).
      const pengaman = setTimeout(() => {
        if (selesai) return;
        selesai = true;
        reject(new GalatLokasi('WAKTU_HABIS', PESAN_GALAT.WAKTU_HABIS));
      }, opsi.timeout + KONFIG.GEO_PENGAMAN_EKSTRA_MS);

      navigator.geolocation.getCurrentPosition(
        (posisi) => {
          if (selesai) return;
          selesai = true; clearTimeout(pengaman);
          resolve(posisi);
        },
        (err) => {
          if (selesai) return;
          selesai = true; clearTimeout(pengaman);
          const peta = { 1: 'DITOLAK', 2: 'TIDAK_TERSEDIA', 3: 'WAKTU_HABIS' };
          const kode = peta[err.code] || 'TIDAK_TERSEDIA';
          reject(new GalatLokasi(kode, PESAN_GALAT[kode]));
        },
        opsi
      );
    });
  }

  /**
   * Periksa apakah Peneliti berada dalam radius situs.
   *
   * Toleransi akurasi: GPS ponsel di kawasan padat atau di bawah atap
   * pendopo bisa meleset 20–50 m. Kita memberi kelonggaran sebesar
   * akurasi yang dilaporkan, dibatasi BATAS_TOLERANSI_AKURASI_M,
   * agar Peneliti yang benar-benar hadir tidak tertolak.
   *
   * @param {{lat:number, lng:number}} koordinat  titik situs
   * @param {number} [radius=100]                 meter
   * @returns {Promise<{dalamJangkauan:boolean, jarak:number, akurasi:number, radius:number, sisa:number}>}
   * @throws {GalatLokasi}
   */
  async function periksaKedekatan(koordinat, radius = KONFIG.RADIUS_DEFAULT_M) {
    const { lat, lng } = koordinat || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new GalatLokasi('KOORDINAT_SALAH', PESAN_GALAT.KOORDINAT_SALAH);
    }

    const posisi = await ambilPosisi();
    const { latitude, longitude, accuracy } = posisi.coords;
    const jarak = jarakHaversine(latitude, longitude, lat, lng);

    // Posisi sangat kabur DAN hasilnya ambigu → minta Peneliti mencoba lagi.
    // (Bila jelas-jelas jauh, tetap laporkan jaraknya.)
    if (accuracy > KONFIG.BATAS_AKURASI_KABUR_M && jarak - accuracy <= radius) {
      throw new GalatLokasi('AKURASI_RENDAH', PESAN_GALAT.AKURASI_RENDAH);
    }

    const toleransi = Math.min(accuracy, KONFIG.BATAS_TOLERANSI_AKURASI_M);
    return {
      dalamJangkauan: jarak <= radius + toleransi,
      jarak: Math.round(jarak),
      akurasi: Math.round(accuracy),
      radius,
      sisa: Math.max(0, Math.round(jarak - radius - toleransi))
    };
  }

  /** 85 → "85 meter", 1240 → "1,2 kilometer" (format Indonesia). */
  function formatJarak(meter) {
    if (meter < 1000) return `${Math.round(meter)} meter`;
    return `${(meter / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} kilometer`;
  }

  /* ================================================================
   * 5. SANDI — fallback "Pindai Kode QR"
   * ----------------------------------------------------------------
   * Untuk prototipe, tombol "Pindai Kode QR" cukup membuka kolom sandi.
   * Bonus: bila kelak Anda mencetak QR fisik yang berisi URL seperti
   *   https://<akun>.github.io/babad/#/situs/mangkunegaran?kode=KUMUDAWATI
   * maka kamera bawaan ponsel akan membuka URL itu, dan `dariURL()`
   * membaca kodenya — tanpa pustaka pemindai QR apa pun.
   * ================================================================ */
  const Sandi = {
    /** Bandingkan sandi tanpa peduli spasi, huruf besar/kecil, atau tanda baca. */
    verifikasi(masukan, sandiBenar) {
      const rapat = (t) => normalisasi(t).replace(/\s/g, '');
      return rapat(masukan) !== '' && rapat(masukan) === rapat(sandiBenar);
    },

    /** Ambil parameter `kode` dari query string ATAU dari bagian hash. */
    dariURL(namaParam = 'kode') {
      const dariSearch = new URLSearchParams(global.location.search).get(namaParam);
      if (dariSearch) return dariSearch;
      const hash = global.location.hash;
      const i = hash.indexOf('?');
      return i >= 0 ? new URLSearchParams(hash.slice(i + 1)).get(namaParam) : null;
    }
  };

  /* ================================================================
   * 6. GERBANG — orkestrator pembukaan situs
   * ----------------------------------------------------------------
   * Bentuk objek situs yang diharapkan (didefinisikan di Langkah 2):
   *   { id, koordinat: {lat, lng}, radius?, sandiRelikui, ... }
   * ================================================================ */
  const Gerbang = {
    /**
     * Coba buka situs berdasarkan GPS.
     * @returns {Promise<{berhasil:boolean, jarak?:number, sisa?:number, akurasi?:number,
     *                    kodeGalat?:string, pesan:string}>}
     *   Tidak pernah melempar galat; UI cukup membaca `berhasil` & `pesan`.
     */
    async denganGPS(situs) {
      if (Jurnal.statusSitus(situs.id) !== STATUS.TERKUNCI) {
        return { berhasil: true, pesan: 'Lembar situs ini telah terbuka dalam jurnalmu.' };
      }
      try {
        const hasil = await periksaKedekatan(situs.koordinat, situs.radius ?? KONFIG.RADIUS_DEFAULT_M);
        if (hasil.dalamJangkauan) {
          Jurnal.bukaSitus(situs.id, METODE.GPS);
          return { berhasil: true, ...hasil, pesan: 'Jejakmu telah sampai. Lembar baru terbuka dalam jurnal.' };
        }
        return {
          berhasil: false, ...hasil,
          pesan: `Situs masih berjarak sekitar ${formatJarak(hasil.sisa)} lagi. Mendekatlah.`
        };
      } catch (e) {
        const kode = e instanceof GalatLokasi ? e.kode : 'TIDAK_TERSEDIA';
        return { berhasil: false, kodeGalat: kode, pesan: e.message || PESAN_GALAT.TIDAK_TERSEDIA };
      }
    },

    /** Buka situs dengan sandi relikui (fallback QR / manual). */
    denganSandi(situs, masukan) {
      if (Jurnal.statusSitus(situs.id) !== STATUS.TERKUNCI) {
        return { berhasil: true, pesan: 'Lembar situs ini telah terbuka dalam jurnalmu.' };
      }
      if (!Sandi.verifikasi(masukan, situs.sandiRelikui)) {
        return { berhasil: false, pesan: 'Sandi itu tak dikenali arsip. Periksa kembali pahatan pada relikui.' };
      }
      Jurnal.bukaSitus(situs.id, METODE.SANDI);
      return { berhasil: true, pesan: 'Sandi diterima. Lembar baru terbuka dalam jurnal.' };
    }
  };

  /* ================================================================
   * EKSPOR KE NAMESPACE GLOBAL
   * ================================================================ */
  global.Babad = Object.freeze({
    KONFIG,
    STATUS,
    METODE,
    Jurnal,
    Teks: Object.freeze({ normalisasi, cocokkan }),
    Lokasi: Object.freeze({ jarakHaversine, ambilPosisi, periksaKedekatan, formatJarak, GalatLokasi, PESAN_GALAT }),
    Sandi,
    Gerbang
  });
})(window);
