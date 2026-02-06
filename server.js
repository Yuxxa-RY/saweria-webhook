const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Simpen donasi terbaru di memory (sementara)
let latestDonation = null;

// ===== ENDPOINT 1: Terima webhook dari Saweria =====
app.post('/webhook/saweria', (req, res) => {
    console.log('Donasi baru diterima!', req.body);
    
    latestDonation = {
        newDonation: true,
        donorName: req.body.donator || req.body.donor_name || req.body.name || 'Tidak Di Ketahui',
        amount: req.body.amount || req.body.total || 0,
        message: req.body.message || req.body.note || '',
        timestamp: Date.now()
    };
    
    res.status(200).json({ success: true });
});

// ===== ENDPOINT 2: Buat Roblox ambil data =====
app.get('/api/donations/latest', (req, res) => {
    if (latestDonation) {
        // Kirim data, terus reset (biar gak muncul lagi)
        const donation = latestDonation;
        latestDonation = null; // Reset setelah diambil
        res.json(donation);
    } else {
        res.json({ newDonation: false });
    }
});

// ===== ENDPOINT 3: Test endpoint (opsional) =====
app.get('/', (req, res) => {
    res.send('Server webhook Saweria aktif! ✅');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running di http://localhost:${PORT}`);
});