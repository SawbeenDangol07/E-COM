# E-Commerce Backend API

A robust, scalable RESTful API backend for an E-Commerce platform built with Node.js, Express 5, and MongoDB (Mongoose).

---

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules for Auth, User, Brand, Banner, etc.
- **Authentication & Security**: JWT-based authentication, password hashing with `bcryptjs`, security headers via `helmet`, and request rate limiting.
- **Data Validation**: Request payload validation using `Joi`.
- **Database & Storage**: MongoDB object modeling using `Mongoose` with public DNS fallback support, plus `Cloudinary` integration for media management.
- **Email Notifications**: Mail dispatch setup with `Nodemailer` (SMTP).
- **Payment Gateway Integration**: Prepared for `Khalti` payment gateway integration.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.x)
- **Database**: MongoDB (via Mongoose v9)
- **Package Manager**: pnpm
- **Key Libraries**:
  - `jsonwebtoken` — JWT Authentication
  - `bcryptjs` — Secure password hashing
  - `joi` — Schema validation
  - `cloudinary` & `multer` — Media upload handling
  - `nodemailer` — Email notifications
  - `helmet` & `express-rate-limit` — API security & rate limiting
  - `dotenv` — Environment configuration
  - `nodemon` — Development auto-reload

---

## 📁 Project Structure

```text
Backend/
├── index.js                  # Application entry point & HTTP server
├── package.json              # Project dependencies & scripts
├── pnpm-lock.yaml            # pnpm lockfile
├── .env                      # Environment variables (git-ignored)
└── src/
    ├── config/
    │   ├── app.config.js     # Centralized environment variable exports
    │   ├── constant.js       # App constants & enums
    │   ├── express.config.js  # Express app setup & global middlewares
    │   ├── mongodb.config.js  # MongoDB database connection & DNS configuration
    │   └── router.config.js   # Main API router (/api/v1)
    ├── middlewares/          # Custom Express middlewares
    └── modules/              # Feature modules
        ├── auth/             # Authentication (router, controller, service, validator)
        ├── banner/           # Banner management module
        ├── brand/            # Brand management module
        └── user/             # User data model & management
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Environment
ENVIROMENT=local
APP_URL=http://localhost:9005
FRONTEND_URL=http://localhost:5173

# Database Configurations
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=api-55
PG_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRETE=your_api_secret

# SMTP Email Configuration
SMTP_PROVIDER=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com

# Payment Gateway (Khalti)
KHALTI_API_KEY=your_khalti_api_key
KHALTI_URL=https://dev.khalti.com/api/v2/
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) package manager
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB server

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure Environment**:
   Create a `.env` file based on the environment variables guide above.

### Running the Application

- **Development Mode** (with auto-restart via `nodemon`):

  ```bash
  pnpm run dev
  ```

- **Production Mode**:
  ```bash
  pnpm start
  ```

The server will start on port `9005` by default (`http://localhost:9005`).

---

## 🔗 Base API Endpoints

All API endpoints are prefixed with `/api/v1`:

- **Auth**: `/api/v1/auth`
- **Health Check / Not Found**: Handles unmapped routes with a standard JSON response.

---

## 📜 License

This project is licensed under the **ISC License**.
