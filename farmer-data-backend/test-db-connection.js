const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log('Connected to Supabase successfully!');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('Current time:', result.rows[0]);
    client.end();
  })
  .catch((err) => {
    console.error('Error connecting to Supabase:', err.stack);
    client.end();
  });