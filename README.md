<div align="center">
  <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/house-medical.svg" width="80" height="80" alt="Clinic Logo"/>
  
  <h1>🏥 CareCure Family Clinic</h1>
  
  <p><strong>A comprehensive healthcare management and appointment booking system.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vanilla_CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📖 Overview

CareCure Family Clinic provides a seamless online experience for patients to book appointments, explore healthcare services, and manage their health journey. The platform features an integrated Express backend with a robust PostgreSQL database, powering core clinic operations from specialist management to real-time appointment scheduling.

## ✨ Key Features

- **👨‍⚕️ Specialist Directory:** Manage doctors across various specialties including Cardiology, Orthopaedics, Paediatrics, and more.
- **🏥 Patient Portal:** Seamless registration and management of patient profiles and contact information.
- **📅 Smart Appointment Scheduling:** Robust booking engine with conflict resolution to prevent double-booking of time slots.
- **🚦 Queue Management:** Real-time queue tracking for doctors to streamline patient visits and optimize clinic flow.
- **🔄 Status Tracking:** Keep track of the full appointment life cycle (`booked`, `checked_in`, `in_session`, `completed`, `cancelled`).
- **📱 Responsive UI:** A beautifully designed, accessible, and mobile-friendly frontend that provides a premium user experience.

## 🛠️ Tech Stack

| Area | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS (Modern Grid/Flexbox), JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (`pg` node-postgres) |
| **Environment** | `dotenv` for secure configuration management |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via a cloud provider)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/carecure-clinic.git
   cd carecure-clinic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory. You can use the existing `.env.example` if available, or create one with the following:
   ```env
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/carecure_db
   ```
   *(Note: Ensure your `DATABASE_URL` matches your local PostgreSQL setup)*

4. **Initialize the Database:**
   Run the migration script to set up your tables:
   ```bash
   node run-migration.js
   ```

5. **Start the Server:**
   ```bash
   npm start
   # or node server.js
   ```

6. **Open in Browser:**
   Navigate to `http://localhost:3000` to view the application.

## 🔌 API Reference

The backend provides a RESTful API for clinic operations. All requests that send data should use `Content-Type: application/json`.

### Doctors
- **`POST /doctors`** - Register a new doctor.
  - **Body:** `{ "name": "Dr. Priya Sharma", "department": "Cardiology" }`
  - **Returns:** The created doctor object (with UUID).

### Patients
- **`POST /patients`** - Register a new patient.
  - **Body:** `{ "first_name": "John", "last_name": "Doe", "phone_number": "1234567890" }`
  - **Returns:** The created patient object (with UUID).

### Appointments
- **`POST /appointments`** - Book an appointment.
  - **Body:** `{ "patient_id": "<uuid>", "doctor_id": "<uuid>", "appointment_time": "2023-10-15T10:00:00Z" }`
  - **Returns:** The created appointment object or a `409 Conflict` if the slot is booked.
- **`GET /queue/:doctor_id`** - Get the appointment queue for a specific doctor.
  - **Returns:** Array of appointments sorted by time.
- **`PATCH /appointments/:id/status`** - Update the status of an appointment.
  - **Body:** `{ "status": "checked_in" }` *(Allowed values: `booked`, `checked_in`, `in_session`, `completed`, `cancelled`)*
  - **Returns:** The updated appointment object.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](../../issues).

## 📝 License

This project is licensed under the [ISC License](LICENSE).
