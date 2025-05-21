const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

// GCP Metadata URL
const METADATA_URL = 'http://metadata.google.internal/computeMetadata/v1';

const getMetadata = async (path) => {
  const res = await axios.get(`${METADATA_URL}/${path}`, {
    headers: { 'Metadata-Flavor': 'Google' }
  });
  return res.data;
};

app.get('/', async (req, res) => {
  try {
    const instanceId = await getMetadata('instance/id');
    const zone = await getMetadata('instance/zone');
    res.json({
      instanceId,
      zone: zone.split('/').pop()
    });
  } catch (err) {
    res.status(500).send('Error retrieving metadata');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
