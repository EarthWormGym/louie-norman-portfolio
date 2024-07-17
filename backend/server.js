const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const getImagesFromDir = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    return files.filter(file => /\.(jpg|jpeg|png|mp4)$/.test(file)).map(file => path.join(dir, file));
  } catch (err) {
    console.error(`Unable to scan directory: ${dir}`, err);
    throw new Error('Unable to scan assets directory');
  }
};

const generateUrls = (baseUrl, files, rootDir) => {
  return files.map(file => `${baseUrl}/${path.relative(rootDir, file).replace(/\\/g, '/')}`);
};

app.get('/api/portfolio/images', async (req, res) => {
  const assetsDir = path.join(__dirname, 'assets', 'portfolio');
  try {
    const folders = await fs.readdir(assetsDir);
    let allImages = [];
    for (const folder of folders) {
      const folderPath = path.join(assetsDir, folder);
      const images = await getImagesFromDir(folderPath);
      allImages = allImages.concat(images);
    }
    const imageUrls = generateUrls(`http://localhost:${port}`, allImages, __dirname);
    res.json(imageUrls);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/about/images', async (req, res) => {
  const assetsDir = path.join(__dirname, 'assets', 'about');
  try {
    const files = await getImagesFromDir(assetsDir);
    const imageUrls = generateUrls(`http://localhost:${port}`, files, __dirname);
    res.json(imageUrls);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
