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
  const assetsDir = path.join(__dirname, 'assets');
  fs.readdir(assetsDir, (err, folders) => {
    if (err) {
      return res.status(500).send('Unable to scan assets directory');
    }
    let images = [];
    let foldersProcessed = 0;
    folders.forEach(folder => {
      const folderPath = path.join(assetsDir, folder);
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.log(`Unable to scan directory: ${folderPath}`);
        } else {
          const folderImages = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)).map(file => path.join(folder, file));
          images = images.concat(folderImages);
        }
        foldersProcessed++;
        if (foldersProcessed === folders.length) {
          res.json(images);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});