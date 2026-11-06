/**
 * ==================================================================
 *  BABAD SURAKARTA: JEJAK YANG HILANG
 *  data.js — Arsip Situs
 * ------------------------------------------------------------------
 *  Berisi data situs heritage: koordinat, lore bernilai Pancasila,
 *  teka-teki observasi, petunjuk bertahap, dan Lencana Nilai.
 *
 *  Lima lembar, lima sila:
 *    I   Pura Mangkunegaran        → Sila ke-1  Lencana Kesucian Batin
 *    II  Alun-Alun Lor (Pepe)      → Sila ke-4  Lencana Suara Rakyat
 *    III Masjid Agung (Pagongan)   → Sila ke-3  Lencana Harmoni Budaya
 *    IV  Monumen Pers Nasional     → Sila ke-2  Lencana Kehormatan
 *    V   Taman Sriwedari           → Sila ke-5  Lencana Kesetaraan
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
     * LEMBAR II — ALUN-ALUN LOR & WARINGIN KURUNG (Sila ke-4)
     * ============================================================== */
    {
      id: 'alun-alun-lor',
      urutan: 2,
      nama: 'Alun-Alun Lor & Waringin Kurung',
      kawasan: 'Utara Keraton Kasunanan Surakarta, Baluwarti',
      koordinat: { lat: -7.575500, lng: 110.827000 }, // DUMMY — sesuaikan ke tengah alun-alun
      radius: 100,
      sandiRelikui: 'DEWADARU',

      adab: 'Alun-alun adalah halaman keraton yang masih hidup dalam upacara. Jangan memanjat pagar Waringin Kurung, dan biarkan kedua pohonnya tetap tenang.',

      lore: {
        judul: 'Ruang Sunyi untuk Suara yang Kecil',
        paragraf: [
          'Di jantung lapangan berdiri dua beringin kembar berpagar, Dewadaru dan Jayadaru. Keduanya melambangkan Manunggaling Kawula Gusti: bersatunya rakyat dengan pemimpinnya.',
          'Dahulu, rakyat jelata yang merasa diperlakukan tidak adil datang ke sini berbusana putih, lalu duduk diam berjemur di bawah terik matahari. Tanpa senjata dan tanpa teriakan, mereka menanti raja berkenan melihat. Jauh sebelum kata demokrasi dikenal, lapangan ini telah menjadi ruang bagi suara yang paling kecil.'
        ]
      },

      relikui: {
        src: 'assets/relikui/waringin-kurung.jpg',
        alt: 'Dua pohon beringin berpagar di tengah Alun-Alun Lor Keraton Kasunanan Surakarta',
        keterangan: 'Relikui II · Waringin Kurung Dewadaru dan Jayadaru'
      },

      tekaTeki: {
        pertanyaan: 'Pandanglah ruang terbuka di antara kedua beringin itu. Apa nama laku sunyi yang dahulu dijalankan rakyat di sana, atau apa yang sesungguhnya mereka cari dengan rela berjemur hingga raja memanggil?',
        kataKunci: ['pepe', 'tapa pepe', 'keadilan', 'adil', 'didengar', 'didengarkan', 'perlindungan'],
        petunjuk: [
          { setelah: 2, teks: 'Laku itu dinamai dari kata Jawa untuk berjemur. Pendek, hanya dua suku kata yang berulang.' },
          { setelah: 4, teks: 'Mereka tidak meminta harta. Mereka meminta sesuatu yang kelak berdiri di dalam sila kelima.' }
        ],
        penyingkapan: 'Pepe, laku berjemur demi keadilan. Keraton menyediakan ruang fisik bagi rakyat kecil untuk menyampaikan suaranya secara damai kepada penguasa tertinggi. Kekuasaan yang luhur, sebagaimana sila keempat, adalah kekuasaan yang mau menunduk dan mendengar.'
      },

      lencana: {
        id: 'lencana-suara-rakyat',
        nama: 'Lencana Suara Rakyat',
        sila: 'Sila ke-4',
        silaTeks: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa pemimpin sejati menyediakan ruang bagi rakyat untuk didengar.',
        simbol: '♁'
      }
    },

    /* ==============================================================
     * LEMBAR III — MASJID AGUNG SURAKARTA & BANGSAL PAGONGAN (Sila ke-3)
     * ============================================================== */
    {
      id: 'masjid-agung',
      urutan: 3,
      nama: 'Masjid Agung Surakarta & Bangsal Pagongan',
      kawasan: 'Barat Alun-Alun Lor, Kauman, Pasar Kliwon',
      koordinat: { lat: -7.574500, lng: 110.825500 }, // DUMMY — sesuaikan ke halaman masjid
      radius: 100,
      sandiRelikui: 'GUNTURMADU',

      adab: 'Masjid ini adalah rumah ibadah yang masih hidup. Berpakaianlah sopan, jangan berkunjung saat jamaah sedang salat, dan amati bangsal dari halaman tanpa mengganggu.',

      lore: {
        judul: 'Bunyi yang Memanggil Pulang',
        paragraf: [
          'Masjid ini didirikan pada masa Pakubuwono III. Atapnya bukan kubah, melainkan tajug bersusun tiga, serupa mahkota yang menunduk. Di halaman depannya berdiri dua bangsal kembar bernama Pagongan, tepat di ambang antara riuh pasar dan hening ruang ibadah.',
          'Setahun sekali, saat Sekaten tiba, gamelan pusaka keraton, Kyai Guntur Madu dan Kyai Guntur Sari, ditabuh di dalam bangsal itu. Rakyat berdatangan karena bunyinya, lalu diajak melangkah lebih jauh: menuju syahadat. Sebuah ajakan yang tidak merobohkan tradisi, melainkan menumpang di atasnya.'
        ]
      },

      relikui: {
        src: 'assets/relikui/pagongan.jpg',
        alt: 'Bangsal Pagongan di halaman depan Masjid Agung Surakarta',
        keterangan: 'Relikui III · Bangsal Pagongan, halaman Masjid Agung'
      },

      tekaTeki: {
        pertanyaan: 'Amati letak dua bangsal itu: tidak di dalam masjid, tidak pula di tengah pasar, melainkan di ambang keduanya. Bunyi apakah yang dahulu dipakai untuk memanggil rakyat melangkah dari keramaian menuju kesucian, dan apa nama kearifan yang memadukan dua dunia itu?',
        kataKunci: ['gamelan', 'akulturasi', 'sekaten', 'perpaduan budaya', 'perpaduan', 'pembauran'],
        petunjuk: [
          { setelah: 2, teks: 'Bangsal itu dinamai menurut gong yang disimpan di dalamnya. Dengarkan namanya baik-baik.' },
          { setelah: 4, teks: 'Ia adalah seperangkat bunyi warisan Hindu-Jawa, yang di sini justru menjadi pintu menuju Islam.' }
        ],
        penyingkapan: 'Gamelan, dan kearifan akulturasi. Para pendakwah tidak memaksa rakyat meninggalkan apa yang mereka cintai; mereka memakai seni yang sudah akrab sebagai jembatan menuju iman yang baru. Persatuan, sebagaimana sila ketiga, tidak lahir dari penyeragaman, melainkan dari kesediaan untuk saling menyapa dalam bahasa yang dipahami bersama.'
      },

      lencana: {
        id: 'lencana-harmoni-budaya',
        nama: 'Lencana Harmoni Budaya',
        sila: 'Sila ke-3',
        silaTeks: 'Persatuan Indonesia',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa perbedaan budaya dapat dirajut menjadi satu, tanpa satu pun harus dihapuskan.',
        simbol: '◉'
      }
    },

    /* ==============================================================
     * LEMBAR IV — MONUMEN PERS NASIONAL (Sila ke-2)
     * ============================================================== */
    {
      id: 'monumen-pers',
      urutan: 4,
      nama: 'Monumen Pers Nasional',
      kawasan: 'Jl. Gajah Mada, Kauman, Surakarta',
      koordinat: { lat: -7.566300, lng: 110.818138 }, // PERKIRAAN — sesuaikan ke pintu utama
      radius: 100,
      sandiRelikui: 'SASANASOEKA',

      adab: 'Museum ini menyimpan kertas rapuh berusia puluhan hingga ratusan tahun. Jangan menyentuh koleksi, matikan lampu kilat kamera, dan ikuti arahan petugas.',

      lore: {
        judul: 'Gedung yang Memberi Suara',
        paragraf: [
          'Gedung berpilar putih ini dibangun pada 1918 atas prakarsa Mangkunegara VII sebagai Societeit Sasana Soeka, tempat kaum terpelajar berkumpul. Puluhan tahun kemudian ruang yang sama menjadi saksi sejarah: pada 9 Februari 1946 para wartawan Indonesia berhimpun di sini dan mendirikan Persatuan Wartawan Indonesia (PWI).',
          'Di dalamnya tersimpan koran dan majalah dari berbagai zaman, juga kisah pers perjuangan seperti Medan Prijaji (1907). Tirto Adhi Soerjo menjadikannya tempat rakyat kecil mengadukan perlakuan sewenang-wenang. Kata-kata dipakai untuk membela martabat manusia ketika hukum kolonial memperlakukan sesama tidak setara.'
        ]
      },

      relikui: {
        src: 'assets/relikui/monumen-pers.jpg',
        alt: 'Gedung Monumen Pers Nasional di Surakarta',
        keterangan: 'Relikui IV · Gedung bekas Societeit Sasana Soeka'
      },

      tekaTeki: {
        pertanyaan: 'Telusuri ruang pamer koran lama dan baca kembali kisah di lembar ini. Apa nama surat kabar yang dipimpin Tirto Adhi Soerjo sebagai suara bagi rakyat yang diperlakukan tidak adil?',
        kataKunci: ['medan prijaji', 'prijaji', 'medan priyayi', 'medan priaji'],
        petunjuk: [
          { setelah: 2, teks: 'Kata pertamanya berarti lapangan atau arena tempat orang berkumpul dan bersuara.' },
          { setelah: 4, teks: 'Kata keduanya merujuk pada kaum priyayi, tetapi koran ini terbuka bagi seluruh bangsa yang terperintah.' }
        ],
        penyingkapan: 'Medan Prijaji. Pers yang jujur adalah bentuk keadaban: ia memberi suara kepada mereka yang tak didengar dan menolak memperlakukan manusia sebagai golongan rendah. Itulah napas sila kedua, kemanusiaan yang adil dan beradab.'
      },

      lencana: {
        id: 'lencana-kehormatan',
        nama: 'Lencana Kehormatan',
        sila: 'Sila ke-2',
        silaTeks: 'Kemanusiaan yang Adil dan Beradab',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa kata-kata yang jujur menjaga martabat setiap manusia.',
        simbol: '✎'
      }
    },
    
    /* ==============================================================
     * LEMBAR V — TAMAN SRIWEDARI (Sila ke-5)
     * ============================================================== */
    {
      id: 'taman-sriwedari',
      urutan: 5,
      nama: 'Taman Sriwedari',
      kawasan: 'Jl. Slamet Riyadi, Laweyan, Surakarta',
      koordinat: { lat: -7.568200, lng: 110.812808 }, // PERKIRAAN — sesuaikan ke gerbang taman
      radius: 120,
      sandiRelikui: 'SRIWEDARI',

      adab: 'Kawasan ini ramai dan dipakai bersama. Jaga kebersihan, beri jalan bagi penonton dan pengunjung lain, dan hormati para seniman yang sedang berlatih atau tampil.',

      lore: {
        judul: 'Taman Raja yang Dibagikan',
        paragraf: [
          'Pakubuwono X membangun taman ini sekitar 1899 hingga 1901. Namanya mengambil taman kahyangan dalam dunia pewayangan, tempat keindahan berkumpul. Pada mulanya ia adalah ruang rehat keluarga raja, lalu perlahan terbuka bagi masyarakat luas.',
          'Dari taman inilah kesenian keraton mengalir ke rakyat. Gedung wayang orangnya masih menjadi panggung bagi seniman dan penonton dari berbagai lapisan. Pada 1948, stadion di kawasan ini menjadi tuan rumah pesta olahraga nasional yang pertama, untuk mempertemukan atlet dari berbagai daerah.'
        ]
      },

      relikui: {
        src: 'assets/relikui/sriwedari.jpg',
        alt: 'Gerbang dan taman Sriwedari di Surakarta',
        keterangan: 'Relikui V · Kawasan Taman Sriwedari'
      },

      tekaTeki: {
        pertanyaan: 'Pada 1948 stadion di kawasan ini menjadi tuan rumah pesta olahraga pertama bangsa kita, yang mempertemukan atlet dari berbagai daerah. Apa nama ajang itu?',
        kataKunci: ['pon', 'pekan olahraga nasional', 'pekan olahraga', 'olahraga nasional'],
        petunjuk: [
          { setelah: 2, teks: 'Ajang ini diikuti atlet dari seluruh provinsi, bukan hanya dari kota raja.' },
          { setelah: 4, teks: 'Singkatannya tiga huruf, dan hingga kini digelar berkala setiap empat tahun.' }
        ],
        penyingkapan: 'Pekan Olahraga Nasional (PON). Taman yang mulanya milik raja kini menjadi milik bersama: seni, olahraga, dan hiburan dapat dinikmati banyak orang. Itulah keadilan sosial: keindahan dan kesempatan tidak berhenti di pagar segelintir orang.'
      },

      lencana: {
        id: 'lencana-kesetaraan',
        nama: 'Lencana Kesetaraan',
        sila: 'Sila ke-5',
        silaTeks: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa ruang, seni, dan kesempatan semestinya dapat dinikmati oleh semua.',
        simbol: '❦'
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