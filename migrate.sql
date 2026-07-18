-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  phone_number VARCHAR,
  is_walk_in BOOLEAN DEFAULT false
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  department VARCHAR NOT NULL
);

-- Create appointments table with UNIQUE constraint on doctor_id and appointment_time
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  appointment_time TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'scheduled',
  CONSTRAINT unique_doctor_time UNIQUE (doctor_id, appointment_time)
);
