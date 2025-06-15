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
  const { q, source, target } = req.body;
  
  if (!q || !source || !target) {
    return res.status(400).json({ error: 'Testo, lingua sorgente e lingua destinazione sono obbligatori' });
  }

  const langpair = `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${langpair}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Errore da MyMemory: ${response.statusText}` });
    }

    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      res.json({ translatedText: data.responseData.translatedText });
    } else {
      res.status(500).json({ error: 'Nessuna traduzione ricevuta da MyMemory', data });
    }
  } catch (error) {
    console.error('Errore interno:', error);
    res.status(500).json({ error: 'Errore interno server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server proxy in ascolto su http://localhost:${PORT}`);
});
