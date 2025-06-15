const path = require('path');
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', async (req, res) => {
  const { text, source, target } = req.body;
  console.log(`📝 Richiesta traduzione: "${text}" from ${source} to ${target}`);
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const response = await fetch(url);
    console.log("🔗 Richiamo MyMemory, status:", response.status);

    const raw = await response.text();
    console.log("📥 Risposta raw:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("JSON non valido: " + e.message);
    }

    if (!data.responseData?.translatedText) {
      console.log("❌ responseData:", data);
      return res.status(500).json({ error: 'Risposta traduzione incompleta', rawData: data });
    }

    console.log("✅ Traduzione ricevuta:", data.responseData.translatedText);
    res.json({ translatedText: data.responseData.translatedText });

  } catch (error) {
    console.error("🔥 ERRORE nella traduzione:", error);
    res.status(500).json({ error: error.message || 'Errore generico backend' });
  }
});
