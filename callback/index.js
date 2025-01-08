const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Gantilah dengan ID aplikasi Facebook Anda
const FACEBOOK_APP_ID = '564471992863258'; 
// URL callback yang sudah Anda tentukan di Facebook Developer Console
const REDIRECT_URI = 'https://fankyxd.xyz/callback'; 

// 1. Endpoint untuk mengarahkan pengguna ke Facebook Login
app.get('/login', (req, res) => {
    const facebookLoginURL = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile&response_type=token`;
    res.redirect(facebookLoginURL); // Redirect pengguna ke halaman login Facebook
});

// 2. Endpoint untuk menangani callback setelah login Facebook
app.get('/callback', async (req, res) => {
    const { access_token, error } = req.query;

    // Menangani error jika ada
    if (error) {
        return res.status(400).send('Error occurred: ' + error);
    }

    // Menangani jika access token tidak ditemukan
    if (!access_token) {
        return res.status(400).send('Access token not found.');
    }

    try {
        // Memanggil Facebook Graph API untuk mendapatkan data pengguna
        const response = await axios.get(`https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,email`);
        const userData = response.data;

        // Menampilkan data pengguna di halaman
        res.send(`<h1>Welcome, ${userData.name}</h1><p>Your email: ${userData.email}</p>`);
    } catch (err) {
        console.error('Error fetching data from Facebook API', err);
        res.status(500).send('Error fetching data from Facebook API');
    }
});

// 3. Menjalankan server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
