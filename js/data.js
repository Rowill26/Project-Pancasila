/**
 * ==================================================================
 *  BABAD SURAKARTA: JEJAK YANG HILANG
 *  data.js — Arsip Situs (Langkah 2)
 * ------------------------------------------------------------------
 *  Berisi data situs heritage: koordinat, lore bernilai Pancasila,
 *  teka-teki observasi, petunjuk bertahap, dan Lencana Nilai.
 *
 *  Data sengaja dipisah dari logika (core.js) agar situs baru dapat
 *  ditambahkan cukup dengan menyalin satu objek di array ARSIP.
 *
 *  Urutan pemuatan di HTML:
 *    <script src="js/core.js"></script>
 *    <script src="js/data.js"></script>
 *
 *  ⚠ KOORDINAT adalah titik perkiraan (dummy). Sebelum uji lapangan,
 *    buka Google Maps → tekan lama titik yang tepat → salin angka
 *    "lat, lng" → tempel ke field `koordinat`.
 * ==================================================================
 */
(function (global) {
  'use strict';

  /* ----------------------------------------------------------------
   * SKEMA SATU SITUS
   * ----------------------------------------------------------------
   * {
   *   id            : string  unik, huruf kecil-berstrip (dipakai di URL & jurnal)
   *   urutan        : number  nomor lembar di jurnal
   *   nama          : string  judul situs
   *   kawasan       : string  keterangan lokasi singkat
   *   koordinat     : { lat, lng }  derajat desimal
   *   radius        : number  meter (opsional, default 100 dari core.js)
   *   sandiRelikui  : string  sandi fallback "Pindai Kode QR"
   *
   *   adab          : string  etika berkunjung (ditampilkan sebelum teka-teki)
   *
   *   lore          : { judul, paragraf: string[≤2] }   dibaca saat situs terbuka
   *
   *   relikui       : { src, alt, keterangan }          gambar untuk observasi
   *
   *   tekaTeki      : {
   *     pertanyaan  : string
   *     kataKunci   : string[]   sinonim yang diterima (lihat Babad.Teks.cocokkan)
   *     petunjuk    : { setelah: number, teks: string }[]
   *                   muncul setelah N jawaban belum tepat
   *     penyingkapan: string     refleksi penutup setelah terjawab
   *   }
   *
   *   lencana       : { id, nama, sila, silaTeks, makna, simbol }
   * }
   * ---------------------------------------------------------------- */

  const ARSIP = [
    /* ==============================================================
     * LEMBAR I — PURA MANGKUNEGARAN (Sila ke-1)
     * ============================================================== */
    {
      id: 'pura-mangkunegaran',
      urutan: 1,
      nama: 'Pendopo Ageng Pura Mangkunegaran',
      kawasan: 'Jl. Ronggowarsito, Keprabon, Banjarsari',
      koordinat: { lat: -7.566700, lng: 110.823300 }, // DUMMY — sesuaikan ke pendopo
      radius: 100,
      sandiRelikui: 'KUMUDAWATI',

      adab: 'Pendopo ini masih menjadi ruang upacara yang dihormati. Bertuturlah pelan, ikuti arahan abdi dalem, dan jangan menyentuh tiang maupun ornamen.',

      lore: {
        judul: 'Kanvas Kosmis di Atas Kepala',
        paragraf: [
          'Tengadahlah. Langit-langit Pendopo Ageng bukan sekadar penaung dari hujan, melainkan peta batin yang dilukis dalam warna. Di pusatnya mekar Kumudawati, sang teratai, dikelilingi delapan penjuru mata angin.',
          'Dalam ajaran Jawa, warna-warna yang mengitarinya adalah wajah nafsu manusia: amarah, keserakahan, dan hasrat duniawi. Namun teratai itu tidak dilukis tanpa pusat. Sesuatu dijaga di tengah, agar segala keputusan yang diambil di bawahnya tak tersesat.'
        ]
      },

      relikui: {
        src: 'assets/relikui/kumudawati.jpg',
        alt: 'Ornamen teratai Kumudawati pada langit-langit Pendopo Ageng Pura Mangkunegaran',
        keterangan: 'Relikui I · Ornamen Kumudawati, langit-langit Pendopo Ageng'
      },

      tekaTeki: {
        pertanyaan: 'Amatilah lingkaran warna di sekeliling teratai. Warna apakah yang bertakhta di pusatnya, seolah mengawasi seluruh nafsu di sekitarnya?',
        kataKunci: ['putih', 'mutmainah', 'mutmainnah', 'kesucian', 'suci'],
        petunjuk: [
          { setelah: 2, teks: 'Carilah warna yang paling tenang di antara semuanya; ia tidak menyala, ia menjernihkan.' },
          { setelah: 4, teks: 'Warna itu sama dengan busana rakyat yang datang memohon keadilan kepada raja.' }
        ],
        penyingkapan: 'Putih, mutmainah: kesucian batin. Nafsu tidak dihapus dari lukisan, sebab ia bagian dari manusia, tetapi ia ditempatkan di bawah pengawasan nurani. Di bawah atap inilah para penguasa diingatkan bahwa kekuasaan tanpa kendali diri adalah kegelapan, dan bahwa manusia senantiasa berada dalam pengawasan Yang Maha Kuasa.'
      },

      lencana: {
        id: 'lencana-kesucian-batin',
        nama: 'Lencana Kesucian Batin',
        sila: 'Sila ke-1',
        silaTeks: 'Ketuhanan Yang Maha Esa',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa pengendalian hawa nafsu berakar pada kesadaran akan Yang Maha Kuasa.',
        simbol: '❀'
      }
    },

    /* ==============================================================
     * LEMBAR II — ALUN-ALUN LOR KERATON KASUNANAN (Sila ke-4)
     * ============================================================== */
    {
      id: 'alun-alun-lor',
      urutan: 2,
      nama: 'Alun-Alun Lor & Waringin Kurung',
      kawasan: 'Utara Keraton Kasunanan Surakarta, Baluwarti',
      koordinat: { lat: -7.575500, lng: 110.827000 }, // DUMMY — sesuaikan ke tengah alun-alun
      radius: 100,
      sandiRelikui: 'DEWADARU',

      adab: 'Alun-alun adalah halaman keraton yang masih hidup dalam upacara. Jangan memanjat pagar Waringin Kurung, dan biarkan pohonnya tetap tenang.',

      lore: {
        judul: 'Ruang Sunyi untuk Suara yang Kecil',
        paragraf: [
          'Di tengah lapangan berdiri dua beringin kembar berpagar, Dewadaru dan Jayadaru. Keduanya melambangkan Manunggaling Kawula Gusti: bersatunya rakyat dengan pemimpinnya.',
          'Dahulu, rakyat jelata yang merasa diperlakukan tidak adil datang ke sini berbusana putih, lalu duduk diam berjemur di bawah terik matahari. Tanpa senjata, tanpa teriakan, mereka menunggu raja melihat mereka. Laku itu disebut pepe.'
        ]
      },

      relikui: {
        src: 'assets/relikui/waringin-kurung.jpg',
        alt: 'Dua pohon beringin berpagar di tengah Alun-Alun Lor Keraton Kasunanan Surakarta',
        keterangan: 'Relikui II · Waringin Kurung Dewadaru dan Jayadaru'
      },

      tekaTeki: {
        pertanyaan: 'Pandanglah ruang kosong di antara kedua beringin itu. Apa yang dicari rakyat kecil yang rela duduk berjemur di sana hingga raja berkenan memanggil mereka?',
        kataKunci: ['keadilan', 'adil', 'didengar', 'didengarkan', 'pengadilan', 'perlindungan'],
        petunjuk: [
          { setelah: 2, teks: 'Mereka tidak meminta harta. Mereka meminta sesuatu yang semestinya dimiliki setiap kawula.' },
          { setelah: 4, teks: 'Kata ini berdiri di dalam sila kelima, dan menjadi alasan sila keempat diwujudkan.' }
        ],
        penyingkapan: 'Keadilan. Jauh sebelum kotak suara dikenal, keraton telah menyediakan ruang fisik bagi rakyat kecil untuk menyampaikan suaranya secara damai kepada penguasa tertinggi. Kekuasaan yang luhur, sebagaimana sila keempat, adalah kekuasaan yang mau menunduk dan mendengar.'
      },

      lencana: {
        id: 'lencana-suara-rakyat',
        nama: 'Lencana Suara Rakyat',
        sila: 'Sila ke-4',
        silaTeks: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa pemimpin sejati menyediakan ruang bagi rakyat untuk didengar.',
        simbol: '♁'
      }
    }
  ];

  /* ----------------------------------------------------------------
   * UTILITAS ARSIP
   * ---------------------------------------------------------------- */

  /** Bekukan secara rekursif agar data tak berubah tanpa sengaja saat runtime. */
  function bekukan(obj) {
    Object.values(obj).forEach((v) => {
      if (v && typeof v === 'object' && !Object.isFrozen(v)) bekukan(v);
    });
    return Object.freeze(obj);
  }

  /**
   * Validasi arsip saat pengembangan. Menulis peringatan ke Console bila
   * ada field yang hilang, id ganda, atau koordinat tak masuk akal.
   * @returns {boolean} true bila semua situs sah.
   */
  function validasi(daftar) {
    const masalah = [];
    const idTerpakai = new Set();
    const idLencana = new Set();

    daftar.forEach((s, i) => {
      const label = s.id || `#${i}`;
      if (!s.id) masalah.push(`${label}: id kosong`);
      if (idTerpakai.has(s.id)) masalah.push(`${label}: id ganda`);
      idTerpakai.add(s.id);

      const { lat, lng } = s.koordinat || {};
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) masalah.push(`${label}: lat tidak valid`);
      if (!Number.isFinite(lng) || lng < -180 || lng > 180) masalah.push(`${label}: lng tidak valid`);

      if (!s.sandiRelikui) masalah.push(`${label}: sandiRelikui kosong`);
      if (!s.lore?.paragraf?.length) masalah.push(`${label}: lore kosong`);
      if (s.lore?.paragraf?.length > 2) masalah.push(`${label}: lore lebih dari 2 paragraf`);
      if (!s.tekaTeki?.kataKunci?.length) masalah.push(`${label}: kataKunci kosong`);

      if (!s.lencana?.id) masalah.push(`${label}: lencana tanpa id`);
      else if (idLencana.has(s.lencana.id)) masalah.push(`${label}: id lencana ganda`);
      idLencana.add(s.lencana?.id);
    });

    if (masalah.length) console.warn('[BabadArsip] Periksa arsip:\n- ' + masalah.join('\n- '));
    return masalah.length === 0;
  }

  validasi(ARSIP);
  const ARSIP_BEKU = bekukan(ARSIP.slice().sort((a, b) => a.urutan - b.urutan));

  global.BabadArsip = Object.freeze({
    /** Semua situs, terurut sesuai nomor lembar. */
    semua: () => ARSIP_BEKU,

    /** Cari satu situs berdasarkan id; null bila tidak ada. */
    cari: (id) => ARSIP_BEKU.find((s) => s.id === id) || null,

    /** Jumlah situs (untuk ringkasan sampul jurnal). */
    jumlah: () => ARSIP_BEKU.length,

    /**
     * Petunjuk yang sudah boleh ditampilkan, berdasarkan jumlah percobaan
     * yang dicatat oleh Babad.Jurnal.catatPercobaan().
     */
    petunjukTerbuka: (id, percobaan) => {
      const s = ARSIP_BEKU.find((x) => x.id === id);
      return s ? s.tekaTeki.petunjuk.filter((p) => percobaan >= p.setelah) : [];
    }
  });
})(window);
