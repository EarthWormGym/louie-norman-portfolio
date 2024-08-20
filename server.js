const express = require('express');
const cors = require('cors');
const path = require('path');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/browser', 'index.html'));
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateUrls = async (bucketName, files, region) => {
  const signedUrls = await Promise.all(
    files.map(async file => {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: file,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
      return url;
    })
  );
  return signedUrls;
};

const listS3Objects = async (bucketName, prefix) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });
    const data = await s3Client.send(command);
    if (!data.Contents) {
      console.warn(`No contents found for bucket: ${bucketName}, prefix: ${prefix}`);
      return [];
    }
    const files = data.Contents.map(item => item.Key);
    return await generateUrls(bucketName, files, process.env.AWS_REGION);
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return [];
  }
};

app.get('/api/portfolio/images', async (req, res) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const prefix = 'assets/portfolio/';
  const urls = await listS3Objects(bucketName, prefix);
  res.json(urls);
});

app.get('/api/about/images', async (req, res) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const prefix = 'assets/about/';
  const urls = await listS3Objects(bucketName, prefix);
  res.json(urls);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});