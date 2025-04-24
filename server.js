const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes - redirect to index.html for client-side routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server running on http://3.12.1.104:${PORT}`);
});