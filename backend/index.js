const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// KONEKSI DATABASE
(async () => {
    db = await open({
        filename: './moodworker.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jawabanTeks TEXT,
            skor INTEGER,
            status TEXT,
            warna TEXT,
            tips TEXT,
            tanggal TEXT
        )
    `);
    console.log("Database SQLite Ready!");
})();

// API: AMBIL SEMUA DATA
app.get('/api/moods', async (req, res) => {
    try {
        const rows = await db.all(`SELECT * FROM moods ORDER BY id DESC`);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: "Gagal ambil data" });
    }
});

// API: SIMPAN DATA BARU
app.post('/api/moods', async (req, res) => {
    const { jawabanTeks } = req.body;
    const skor = Math.floor(Math.random() * 101); 
    
    let status, warna, tips;
    if (skor >= 80) {
        status = "Stress Tinggi"; warna = "#ef4444";
        tips = "Kondisi kritis. Segera ambil waktu istirahat total.";
    } else if (skor >= 50) {
        status = "Stress Sedang"; warna = "#f59e0b";
        tips = "Beban kerja mulai terasa. Coba stretching sejenak.";
    } else if (skor >= 20) {
        status = "Stress Rendah"; warna = "#3b82f6";
        tips = "Kondisi cukup aman. Jaga ritme kerjamu.";
    } else {
        status = "Sangat Bahagia"; warna = "#10b981";
        tips = "Luar biasa! Pertahankan energi positif ini.";
    }

    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    try {
        await db.run(
            `INSERT INTO moods (jawabanTeks, skor, status, warna, tips, tanggal) VALUES (?, ?, ?, ?, ?, ?)`,
            [JSON.stringify(jawabanTeks), skor, status, warna, tips, tanggal]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Gagal simpan data" });
    }
});

// API: HAPUS DATA (FITUR BARU)
app.delete('/api/moods/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run(`DELETE FROM moods WHERE id = ?`, [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Gagal hapus data" });
    }
});

app.listen(3000, () => console.log("Server jalan di port 3000"));