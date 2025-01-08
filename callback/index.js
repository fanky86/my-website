const express = require('express');
const axios = require('axios');
const app = express();

const FACEBOOK_APP_ID = '564471992863258'; 
const FACEBOOK_APP_SECRET = '18365c22f39da44c9733def5b17e6554'; // Gunakan variabel lingkungan
const REDIRECT_URI = 'https://fankyxd.xyz/callback'; // Ganti dengan Redirect URI Anda

// Menangani permintaan ke root '/'
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Facebook Login App</h1>');
});

// 1. Endpoint untuk mengarahkan pengguna ke Facebook Login
app.get('/login', (req, res) => {
    const facebookLoginURL = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile&response_type=code`;
    res.redirect(facebookLoginURL); // Redirect pengguna ke halaman login Facebook
});

// 2. Endpoint untuk menangani callback setelah login Facebook
app.get('/callback', async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).send(`Error occurred: ${error}`);
    }

    if (!code) {
        return res.status(400).send('Authorization code not found.');
    }

    try {
        const tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
            params: {
                client_id: FACEBOOK_APP_ID,
                redirect_uri: REDIRECT_URI,
                client_secret: FACEBOOK_APP_SECRET,
                code: code
            }
        });

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                access_token: access_token,
                fields: 'id,name,email'
            }
        });

        const userData = userResponse.data;

        res.send(`
            <h1>Welcome, ${userData.name}</h1>
            <p>Your email: ${userData.email}</p>
            <p>Your Facebook ID: ${userData.id}</p>
        `);
    } catch (err) {
        console.error('Error fetching data from Facebook API:', err.message);
        res.status(500).send('Error fetching data from Facebook API');
    }
});

// Exporting the serverless function for Vercel
module.exports = app;
