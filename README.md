# Excellence Institute - Academic Management & Student Registration System

> **This project was developed as part of the curriculum at Boston City Campus. This is for portfolio demonstration purposes only.**

A full-stack web application designed for **The Excellence Institute** to streamline student admissions and academic record management. The system provides an administrative portal for staff to register students and manage academic records, as well as a student self-service portal for querying profiles and generating registration slips.

---

## Architecture & Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Vanilla CSS
- **Backend**: PHP (REST API, PDO for MySQL, session-based authentication)
- **Database**: MySQL / MariaDB
- **Hosting / Web Servers**: Apache (e.g., via XAMPP / WAMP) & Node.js (Vite Dev Server)

---

## Features

- **Admin Portal**:
  - Secure authentication and session management.
  - Student registration with automated unique Student ID generation (YY + Course Code + MMDD).
  - Search, filter, edit, and manage registered students.
  - Generate and view Profile Summary Reports and Registration Confirmation Slips.
- **Student Portal**:
  - Public search by unique Student ID.
  - View profile summaries and print/export registration confirmation slips.
- **Security**:
  - Environment-based configuration via `.env` (no hardcoded passwords).
  - Password hashing with PHP's `password_hash()` and `password_verify()`.
  - Prepared statements with PDO to protect against SQL Injection.
  - CORS whitelist and security headers (`X-Frame-Options`, `nosniff`, `CSP`).

---

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later) and `npm`
- [PHP](https://www.php.net/) (v7.4 or v8.x) with the `pdo_mysql` extension enabled
- [MySQL](https://www.mysql.com/) server (standalone or via [XAMPP](https://www.apachefriends.org/)/WAMP)
- Web Server: Apache (XAMPP/WAMP) or PHP's built-in CLI server

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd excellence-institute
```

---

### 2. Database Setup

1. Start your **MySQL** server (e.g. from the XAMPP Control Panel).
2. Open your database administration tool (such as **phpMyAdmin** or MySQL CLI).
3. Create a database named `excellence_institute`:
   ```sql
   CREATE DATABASE IF NOT EXISTS excellence_institute CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE excellence_institute;
   ```
4. Run the following SQL schema to create the required tables:

   ```sql
   -- Admin Users Table
   CREATE TABLE IF NOT EXISTS admin_users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL UNIQUE,
       email VARCHAR(100) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Students Table
   CREATE TABLE IF NOT EXISTS students (
       id INT AUTO_INCREMENT PRIMARY KEY,
       student_id VARCHAR(50) NOT NULL UNIQUE,
       full_name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       date_of_birth DATE NOT NULL,
       course_of_study VARCHAR(100) NOT NULL,
       enrollment_date DATE NOT NULL,
       status VARCHAR(20) DEFAULT 'Active',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

5. Seed an initial administrator account. You can generate a password hash or use the sample query below (creates user `admin` with password `AdminPassword123!`):

   ```sql
   INSERT INTO admin_users (username, email, password)
   VALUES ('admin', 'admin@excellence.edu', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeTmg2yHwEhy56s9eLw5wZ9d.K7KqvFme');
   ```

---

### 3. Environment Configuration

1. In the project root, create your local `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt: `copy .env.example .env`)*

2. Open `.env` and verify your database credentials and API URL:
   ```ini
   APP_ENV=development

   # Database Settings
   DB_HOST=localhost
   DB_NAME=excellence_institute
   DB_USER=root
   DB_PASS=

   # API URL & CORS Settings
   API_BASE_URL=http://localhost/excellence-institute/api/
   ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

> [!NOTE]
> `.env` is listed in `.gitignore` to prevent credentials from being committed to version control. Never commit `.env` to Git.

---

### 4. Running the Backend API

Depending on your local development setup, choose one of the following methods:

#### Method A: Using Apache / XAMPP (Recommended)
1. Ensure the project folder is placed or aliased inside your web server's root directory:
   - Example: `C:\xampp\htdocs\excellence-institute`
2. Start the **Apache** and **MySQL** modules from the XAMPP Control Panel.
3. Test that the API is reachable in your browser:
   ```
   http://localhost/excellence-institute/api/courses.php
   ```
   You should receive a JSON response listing available courses.

#### Method B: Using PHP's Built-in Server
If you prefer running without Apache, open a terminal in the project directory and run:
```bash
php -S localhost:8000
```
*(If using this method, update `API_BASE_URL` in `.env` and the proxy in `vite.config.js` to point to port `8000`)*.

---

### 5. Running the Frontend (React + Vite)

1. Open a terminal in the project root directory.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Available Scripts

In the project root, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on `http://localhost:5173` |
| `npm run build` | Compiles and bundles production-ready frontend assets into the `dist/` directory |
| `npm run preview` | Locally previews the production build created in `dist/` |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## API Endpoints Overview

All backend endpoints return responses in `application/json` format:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth.php` | Admin login | No |
| `GET` | `/api/auth.php` | Check session authentication status | No |
| `POST` | `/api/auth.php?action=logout` | Admin logout | Yes |
| `POST` | `/api/change_password.php` | Change admin password | Yes |
| `GET` | `/api/courses.php` | Get list of available courses | No |
| `POST` | `/api/register.php` | Register a new student | Yes (Admin) |
| `GET` | `/api/students.php` | List & filter registered students | Yes (Admin) |
| `GET` | `/api/student.php?id={id}` | Retrieve single student details | No (Student/Admin) |
| `PUT` | `/api/student.php?id={id}` | Update student records | Yes (Admin) |
| `GET` | `/api/reports.php?type={type}&student_id={id}` | Generate profile summary or confirmation slip | Yes (Admin) |

---

## Project Structure

```text
excellence-institute/
├── .env.example             # Safe template for environment variables
├── .gitignore               # Files ignored by Git (.env, node_modules, etc.)
├── index.html               # Main HTML entry point for Vite
├── package.json             # Frontend dependencies & npm scripts
├── vite.config.js           # Vite dev server and proxy configuration
├── api/                     # Backend PHP REST API
│   ├── config/
│   │   └── config.php       # Environment loader & application configuration
│   ├── includes/
│   │   ├── auth_middleware.php  # Session protection helper
│   │   └── database.php         # PDO database connection handler
│   ├── auth.php             # Authentication endpoints (login, logout, status)
│   ├── change_password.php  # Password update endpoint
│   ├── courses.php          # Available academic courses
│   ├── register.php         # Student registration & ID generation
│   ├── reports.php          # Profile and confirmation slip generator
│   ├── student.php          # Single student fetch & update
│   └── students.php         # Student search & directory
└── src/                     # React frontend source code
    ├── assets/              # Static images and icons
    ├── components/          # UI components (AdminLogin, Dashboard, StudentForm, etc.)
    ├── context/             # React context (AuthContext)
    ├── App.jsx              # Main React component & routes
    └── main.jsx             # React DOM entry point
```
