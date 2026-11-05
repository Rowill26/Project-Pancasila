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
 *    IV  Benteng Vastenburg        → Sila ke-2  Lencana Kewaspadaan
 *    V   Pasar Gede Hardjonagoro   → Sila ke-5  Lencana Kesetaraan
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
     * LEMBAR IV — BENTENG VASTENBURG (Sila ke-2)
     * ============================================================== */
    {
      id: 'benteng-vastenburg',
      urutan: 4,
      nama: 'Benteng Vastenburg',
      kawasan: 'Jl. Jenderal Sudirman, Kedung Lumbu, Pasar Kliwon',
      koordinat: { lat: -7.570300, lng: 110.829000 }, // DUMMY — sesuaikan ke gerbang benteng
      radius: 100,
      sandiRelikui: 'VASTENBURG',

      adab: 'Benteng ini adalah cagar budaya yang menyimpan luka sejarah. Jangan memanjat dinding atau masuk ke area yang ditutup, dan biarkan batanya bercerita apa adanya.',

      lore: {
        judul: 'Mata yang Tak Pernah Terpejam',
        paragraf: [
          'Benteng ini didirikan pada 1745 atas perintah Gubernur Jenderal Baron van Imhoff. Nama aslinya De Grootmoedigheid, Kemurahan Hati. Sebuah nama yang manis, terlalu manis untuk dinding tebal yang dikelilingi parit pertahanan.',
          'Lihatlah ke mana benteng ini menghadap. Bukan ke arah musuh dari luar kota, melainkan lurus ke jantung Keraton Kasunanan. Dari balik dinding ini, garnisun Belanda dapat membaca setiap gerak di istana: siapa yang datang, siapa yang berkumpul, dan siapa yang mulai berani bermimpi tentang kebebasan.'
        ]
      },

      relikui: {
        src: 'assets/relikui/peta-vastenburg.jpg',
        alt: 'Peta lama kota Surakarta yang memperlihatkan Benteng Vastenburg berhadapan dengan Keraton Kasunanan',
        keterangan: 'Relikui IV · Peta letak Benteng Vastenburg dan Keraton Kasunanan'
      },

      tekaTeki: {
        pertanyaan: 'Bentangkan peta itu dan tarik garis dari benteng menuju selatan. Garis itu jatuh tepat di keraton. Bila benteng ini tak pernah dibangun untuk menahan musuh dari luar, untuk apakah sesungguhnya ia didirikan?',
        kataKunci: ['pengawasan', 'mengawasi', 'diawasi', 'mata mata', 'memata matai', 'kontrol', 'mengontrol', 'intimidasi', 'mengintimidasi'],
        petunjuk: [
          { setelah: 2, teks: 'Sebuah benteng tidak selalu melindungi. Terkadang ia hanya menatap, dan tatapan itu sudah cukup untuk membuat orang takut.' },
          { setelah: 4, teks: 'Pikirkan seorang penjaga yang tak pernah tidur, matanya tertuju pada satu rumah saja.' }
        ],
        penyingkapan: 'Pengawasan. Kemurahan Hati hanyalah topeng bahasa bagi sebuah menara pengintai. Kekuasaan yang terus mengawasi dan menekan merampas martabat manusia yang diawasinya. Sila kedua mengajarkan kebalikannya: kemanusiaan yang adil dan beradab, serta kewaspadaan agar kata-kata indah tidak lagi menyamarkan penindasan.'
      },

      lencana: {
        id: 'lencana-kewaspadaan',
        nama: 'Lencana Kewaspadaan',
        sila: 'Sila ke-2',
        silaTeks: 'Kemanusiaan yang Adil dan Beradab',
        makna: 'Dianugerahkan kepada Peneliti yang mampu membaca kuasa di balik nama yang manis, dan menjaga martabat manusia dari pengawasan yang menindas.',
        simbol: '⌖'
      }
    },

    /* ==============================================================
     * LEMBAR V — PASAR GEDE HARDJONAGORO (Sila ke-5)
     * ============================================================== */
    {
      id: 'pasar-gede',
      urutan: 5,
      nama: 'Pasar Gede Hardjonagoro',
      kawasan: 'Jl. Urip Sumoharjo, Sudiroprajan, Jebres',
      koordinat: { lat: -7.568700, lng: 110.831200 }, // DUMMY — sesuaikan ke gerbang utama
      radius: 100,
      sandiRelikui: 'KARSTEN',

      adab: 'Pasar ini masih menjadi nadi kehidupan warga. Jangan menghalangi lalu lintas pedagang dan pembeli, dan mintalah izin sebelum memotret siapa pun.',

      lore: {
        judul: 'Satu Atap untuk Semua',
        paragraf: [
          'Pasar ini rampung pada 1930, dirancang oleh arsitek Belanda Herman Thomas Karsten. Atapnya meminjam bentuk rumah Jawa dengan tritisan lebar untuk menahan hujan deras, sementara tata ruangnya simetris dan tegas khas Eropa. Ia berdiri di simpul kota, menyambungkan kawasan pecinan Balong dengan lingkungan keraton.',
          'Di zaman ketika Hindia Belanda memilah manusia menurut ras dan kelas, di sini pribumi, Tionghoa, dan Eropa berdiri di lantai yang sama, menawar di lapak yang sama, dan berteduh di bawah atap yang sama.'
        ]
      },

      relikui: {
        src: 'assets/relikui/gerbang-pasar-gede.jpg',
        alt: 'Gerbang utama Pasar Gede Hardjonagoro dengan tulisan aksara Jawa dan huruf Latin',
        keterangan: 'Relikui V · Gerbang utama Pasar Gede Hardjonagoro'
      },

      tekaTeki: {
        pertanyaan: 'Amati gerbang utamanya: aksara Jawa dan huruf Latin berdiri dalam satu bingkai simetris. Di masa ketika manusia dipisah-pisahkan menurut ras dan kelas, apa yang hendak dibangun Karsten di bawah satu atap ini?',
        kataKunci: ['persatuan', 'kesetaraan', 'setara', 'bersatu', 'pembauran', 'peleburan', 'kesamaan'],
        petunjuk: [
          { setelah: 2, teks: 'Perhatikan bahwa tak satu pun tulisan di gerbang itu diletakkan lebih tinggi daripada yang lain.' },
          { setelah: 4, teks: 'Di dalam pasar, tidak ada kursi khusus bagi tuan, dan tidak ada lorong khusus bagi hamba.' }
        ],
        penyingkapan: 'Kesetaraan, dan persatuan yang lahir darinya. Karsten tidak sekadar membangun tempat berjual beli, melainkan ruang yang diam-diam menghapus sekat kelas sosial. Keadilan sosial, sebagaimana sila kelima, bermula dari hal sederhana: semua orang berhak berdiri di lantai yang sama.'
      },

      lencana: {
        id: 'lencana-kesetaraan',
        nama: 'Lencana Kesetaraan',
        sila: 'Sila ke-5',
        silaTeks: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
        makna: 'Dianugerahkan kepada Peneliti yang memahami bahwa keadilan sosial dimulai ketika tidak ada lagi manusia yang ditempatkan lebih rendah daripada yang lain.',
        simbol: '❂'
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
