# kigali-talent-backend

A clean, scalable Node.js Express application built with a focus on best practices. This backend service provides RESTful API endpoints for managing users and products, with a layered architecture, centralized logging, and a SQLite database for persistence.

### Features

* **RESTful API:** Provides endpoints for managing users and other resources.

* **Layered Architecture:** Separates concerns with dedicated files for controllers, services, and repositories.

* **Persistent Data:** Uses a **SQLite** database with `better-sqlite3` for a lightweight and reliable data store.

* **Standardized API Responses:** Ensures every API call returns a consistent JSON object.

* **Modular Logging:** Integrates `log4js` for structured and configurable logging.

* **Email Service:** Includes functionality for sending emails via `nodemailer`.

* **Containerized Environment:** Fully containerized with Docker for consistent development and deployment.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v20 or higher)

* [npm](https://www.npmjs.com/)

* [Docker](https://www.docker.com/)

### Getting Started

Follow these steps to get a local copy of the project up and running.

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/mbonigabay/kigali-talent-backend.git](https://github.com/mbonigabay/kigali-talent-backend.git)
    cd kigali-talent-backend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the project root for your environment variables.

    ```env
    PORT=8000
    EMAIL_USERNAME=your_gmail_username@gmail.com
    EMAIL_PASSWORD=your_gmail_app_password
    ```

    * **Note:** If using Gmail, you must use an [App Password](https://support.google.com/accounts/answer/185833) for security.

4.  **Run the application locally**

    ```bash
    npm start
    ```

    The server will start at `http://localhost:8000`.

### Project Structure

```
kigali-talent-backend/
├── src/
│   ├── config/             # Log4js configuration
│   ├── controllers/        # Handles API requests and responses
│   ├── middleware/         # Custom Express middleware
│   ├── repository/       # Database access logic
│   ├── routes/             # Defines API endpoints
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── .dockerignore           # Specifies files to ignore in Docker image
├── Dockerfile              # Instructions for building the Docker image
├── docker-compose.yml      # Docker Compose setup
├── index.js                # Main application entry point
├── package.json
└── README.md
```

### API Endpoints

The base URL for all API endpoints is `http://localhost:8000`.

**Users**

* `GET /users`: Retrieves a list of all users.

* `POST /users`: Creates a new user.

    * **Body:** `{ "name": "New User" }`

### Docker

To run the application using Docker Compose, you can use the provided `docker-compose.yml` file.

1.  **Build and run the containers**

    ```bash
    docker compose up --build
    ```

    This command will build the image (if it doesn't exist) and start the container, mapping port `8000` to your host.

2.  **Run with a pre-built image**
    If you've already pushed the image to Docker Hub, you can run it without rebuilding.

    ```bash
    docker compose up
    