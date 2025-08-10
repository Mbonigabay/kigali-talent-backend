# kigali-talent-backend

A clean, scalable Node.js Express application for a job board. This backend service provides RESTful API endpoints for managing jobs, applicants, and users, with a layered architecture, centralized logging, and a SQLite database for persistence.

### Features

* **RESTful API:** Provides endpoints for managing jobs, applications, and users.

* **Layered Architecture:** Separates concerns with dedicated files for controllers, services, and repositories.

* **Persistent Data:** Uses a **SQLite** database with `better-sqlite3` for a lightweight and reliable data store.

* **Authentication & Authorization:** Implements user registration, login, and JWT-based authentication with role-based access control (`ROLE_ADMIN`, `ROLE_APPLICANT`).

* **State Machines:** Enforces business logic and prevents invalid status transitions for both jobs and job applications.

* **Modular Logging:** Integrates `log4js` for structured and configurable logging.

* **Email Service:** Includes functionality for sending emails via `nodemailer` for features like account verification.

* **Containerized Environment:** Fully containerized with Docker for consistent development and deployment.

* **Database Seeding:** Automatically populates the database with test data on startup for easy development.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v20 or higher)

* [npm](https://www.npmjs.com/)

* [Docker](https://www.docker.com/)

### Getting Started

Follow these steps to get a local copy of the project up and running.

1. **Clone the repository**

   ```bash
   git clone [https://github.com/mbonigabay/kigali-talent-backend.git](https://github.com/mbonigabay/kigali-talent-backend.git)
   cd kigali-talent-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root for your environment variables.

   ```env
   PORT=8000
   # Ethereal.email is for testing only. Replace with your credentials for a real email service.
   EMAIL_USERNAME=your_ethereal_email@ethereal.email
   EMAIL_PASSWORD=your_ethereal_app_password
   JWT_SECRET=a-super-secret-key-at-least-256-bits-long
   ```

   * **Ethereal.email:** This is a testing service. After running your application, check the console for a URL to view the emails sent to this address.

   * **Real Email:** If using a service like Gmail, you must use an [App Password](https://support.google.com/accounts/answer/185833) for security.

4. **Run the application locally**

   ```bash
   npm start
   ```

   The server will start at `http://localhost:8000`.

### Project Structure

```
kigali-talent-backend/
├── src/
│   ├── config/             # Log4js and other configurations
│   ├── controller/        # Handles API requests and responses
│   ├── middleware/         # Custom Express middleware
│   ├── repository/       # Database access logic (Auth, Applicant, Job, etc.)
│   ├── route/             # Defines API endpoints
│   ├── service/           # Business logic and state machines
│   └── util/              # Helper functions (date, response format)
├── .dockerignore           # Specifies files to ignore in Docker image
├── Dockerfile              # Instructions for building the Docker image
├── docker-compose.yml      # Docker Compose setup
├── index.js                # Main application entry point
├── package.json
└── README.md
```

### API Endpoints

The base URL for all API endpoints is `http://localhost:8000/api`.

**Authentication**

* `POST /auth/register`: Register a new user.

* `POST /auth/login`: Log in and get a JWT.

* `POST /auth/verify-account-request`: Request an OTP to verify a user's account.

* `POST /auth/verify-account`: Verify the OTP to activate an account.

* `POST /auth/password-reset-request`: Request a password reset link.

* `POST /auth/password-reset`: Reset a user's password with a token.

**Companies (Admin Only)**

* `POST /companies`: Create a new company.

* `GET /companies`: Retrieve all companies.

* `GET /companies/:id`: Get a single company by ID.

* `PUT /companies/:id`: Update a company.

* `DELETE /companies/:id`: Delete a company.

**Jobs**

* `GET /jobs`: Retrieve all **published** jobs (public).

* `GET /jobs/all`: Retrieve all jobs (admin only).

* `GET /jobs/:slug`: Retrieve a single job by its slug (public).

* `POST /jobs`: Create a new job listing (admin only).

* `PUT /jobs/update-job/status`: Update a job's status (admin only).

**Applicants (Applicant Only)**

* `POST /applicants/profile`: Create an applicant profile for the authenticated user.

**Job Applications**

* `POST /job-applications/:jobId/apply`: Submit an application for a job (applicant only).

* `GET /job-applications/jobs/:jobId`: Retrieve all applications for a specific job (admin only).

* `PUT /job-applications/:id/status`: Update a job application's status (admin only).

### Docker

To run the application using Docker Compose, you can use the provided `docker-compose.yml` file.

1. **Build and run the containers**

   ```bash
   docker compose up --build
   ```

   This command will build the image (if it doesn't exist) and start the container, mapping port `8000` to your host.

2. **Run with a pre-built image**
   If you've already pushed the image to Docker Hub, you can run it without rebuilding.

   ```bash
   docker compose up
   