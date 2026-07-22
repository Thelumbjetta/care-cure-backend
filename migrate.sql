-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  phone_number VARCHAR UNIQUE
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  department VARCHAR NOT NULL
);

-- Create appointments table with FOREIGN KEY constraints
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  appointment_time TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'booked',
  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
  CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  CONSTRAINT unique_doctor_time UNIQUE (doctor_id, appointment_time)
);
