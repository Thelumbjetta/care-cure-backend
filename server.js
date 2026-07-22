require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// JSON payload limit middleware
app.use(express.json({ limit: '10kb' }));

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

// Basic GET route
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// POST /doctors route
app.post('/doctors', async (req, res) => {
  // Input validation
  const { name, department } = req.body;
  
  if (!name || !department) {
    return res.status(400).json({ error: 'name and department are required' });
  }
  
  if (typeof name !== 'string' || typeof department !== 'string') {
    return res.status(400).json({ error: 'name and department must be strings' });
  }
  
  if (name.length > 100 || department.length > 100) {
    return res.status(400).json({ error: 'name and department must not exceed 100 characters' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO doctors (name, department) VALUES ($1, $2) RETURNING *',
      [name, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /patients route
app.post('/patients', async (req, res) => {
  // Input validation
  const { first_name, last_name, phone_number } = req.body;
  
  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: 'first_name, last_name, and phone_number are required' });
  }
  
  if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof phone_number !== 'string') {
    return res.status(400).json({ error: 'first_name, last_name, and phone_number must be strings' });
  }
  
  if (first_name.length > 100 || last_name.length > 100 || phone_number.length > 100) {
    return res.status(400).json({ error: 'fields must not exceed 100 characters' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO patients (first_name, last_name, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, phone_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /appointments route
app.post('/appointments', async (req, res) => {
  // Input validation
  const { patient_id, doctor_id, appointment_time } = req.body;
  
  if (!patient_id || !doctor_id || !appointment_time) {
    return res.status(400).json({ error: 'patient_id, doctor_id, and appointment_time are required' });
  }
  
  // Validate patient_id and doctor_id format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(patient_id)) {
    return res.status(400).json({ error: 'Invalid patient_id format' });
  }
  if (!uuidRegex.test(doctor_id)) {
    return res.status(400).json({ error: 'Invalid doctor_id format' });
  }
  
  // Validate appointment_time is a valid date string
  if (isNaN(Date.parse(appointment_time))) {
    return res.status(400).json({ error: 'appointment_time must be a valid date string' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES ($1, $2, $3) RETURNING *',
      [patient_id, doctor_id, appointment_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Check for unique constraint violation (PostgreSQL error code 23505)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Time slot already booked.' });
    }
    // Check for foreign key violation (PostgreSQL error code 23503)
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Invalid patient or doctor ID provided.' });
    }
    // Log other errors for internal debugging
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /queue/:doctor_id route
app.get('/queue/:doctor_id', async (req, res) => {
  const { doctor_id } = req.params;
  
  // Validate doctor_id format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(doctor_id)) {
    return res.status(404).json({ error: 'Invalid doctor_id format' });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE doctor_id = $1 ORDER BY appointment_time ASC',
      [doctor_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /appointments/:id/status route
app.patch('/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Validate status against allowed states
  const allowedStatuses = ['booked', 'checked_in', 'in_session', 'completed', 'cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be one of: booked, checked_in, in_session, completed, cancelled' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, pool };
