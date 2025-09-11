const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the WEB_CK root directory
app.use(express.static(path.join(__dirname, '..')));

// Multer setup for file uploads
const upload = multer({ dest: path.join(__dirname, '../uploads') });

app.post('/upload', upload.single('image'), (req, res) => {
  // For demo, just return a local URL (in real use, upload to cloud storage)
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // You can change this to your actual image hosting logic
  res.json({ data: { secure_url: `/uploads/${req.file.filename}` } });
});

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});