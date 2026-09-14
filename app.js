// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;
  const isValidChallenge = typeof challenge === 'string' && /^[A-Za-z0-9._:-]+$/.test(challenge);

  if (mode === 'subscribe' && verifyToken && token === verifyToken && isValidChallenge) {
    console.log('WEBHOOK VERIFIED');
    res.type('text/plain').status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(
    JSON.stringify(
      {
        object: req.body?.object,
        entryCount: Array.isArray(req.body?.entry) ? req.body.entry.length : 0,
      },
      null,
      2
    )
  );
  res.status(200).end();
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
  });
}

module.exports = app;
