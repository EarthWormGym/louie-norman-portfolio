const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Set up CORS configuration
app.use(cors({
  origin: 'https://www.louienorman.com', // Allow only your domain
  optionsSuccessStatus: 200
}));

// Use Helmet to set various HTTP headers, including HSTS
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
  preload: true
}));

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'public/browser')));

// Set up the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to generate signed URLs for S3 objects
const generateUrls = async (bucketName, files) => {
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

// Helper function to list objects in an S3 bucket
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
    return await generateUrls(bucketName, files);
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return [];
  }
};

// Define API routes BEFORE the catch-all route
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

// Catch-all route to serve the Angular app's index.html file
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/browser/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
