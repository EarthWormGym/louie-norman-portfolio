const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'assets/from-stone-to-stone');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    res.json(images);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
