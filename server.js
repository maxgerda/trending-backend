// Isi file server.js (Versi yang sudah dimodifikasi)

const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();
const PORT = 3001;

app.use(cors());

app.get('/api/get-trends', async (req, res) => {
  try {
    // 1. Tetap ambil semua data dari URL RSS harian
const feed = await parser.parseURL('https://trends.google.co.id/trends/trendingsearches/daily/rss?geo=ID', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  }
});
    
    // --- BAGIAN BARU DIMULAI DI SINI ---

    // 2. Tentukan waktu patokan: 4 jam yang lalu dari sekarang
    const fourHoursAgo = new Date(Date.now() - (4 * 60 * 60 * 1000));

    // 3. Saring (filter) data yang kita dapat
    const recentTrends = feed.items.filter(item => {
      // Ubah tanggal publikasi setiap item menjadi format tanggal
      const itemDate = new Date(item.pubDate); 
      // Kembalikan hanya item yang tanggalnya LEBIH BARU dari patokan 4 jam lalu
      return itemDate >= fourHoursAgo;
    });

    // --- BAGIAN BARU SELESAI DI SINI ---

    // 4. Olah data yang SUDAH DISARING menjadi format yang kita mau
    const trends = recentTrends.map(item => ({
        title: item.title,
        traffic: item.contentSnippet, 
    }));

    // 5. Kirim data yang sudah bersih dan terfilter
    res.json(trends);

  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ message: "Gagal mengambil data dari Google Trends" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});