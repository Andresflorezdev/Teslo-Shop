<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo Shop - E-commerce API

> **Note**: This is a practice project built for learning purposes.

A robust RESTful API built with NestJS for managing an e-commerce platform. This project includes authentication, product management, file uploads, WebSocket real-time communication, and more.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Complete CRUD operations for products with images
- **File Upload**: Image upload and management system
- **WebSocket Integration**: Real-time communication using Socket.IO
- **Database**: PostgreSQL with TypeORM for data persistence
- **API Documentation**: Automatic documentation with Swagger/OpenAPI
- **Seed Data**: Pre-configured data seeding for development
- **Docker Support**: Easy deployment with Docker Compose
- **Validation**: Request validation using class-validator
- **Security**: Password hashing with bcrypt, JWT tokens

## 🛠️ Technologies

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **WebSockets**: Socket.IO
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **File Upload**: Multer
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Andresflorezdev/Teslo-Shop.git
cd Teslo-Shop
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment configuration**
```bash
# Copy the template file
cp .env.template .env

# Edit the .env file with your configuration
```

4. **Start the database**
```bash
docker compose up -d
```

5. **Run the application**
```bash
yarn start:dev
```

6. **Seed the database** (optional but recommended for development)
```bash
# Visit in your browser or use curl
http://localhost:3000/api/seed
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication module (login, register, JWT)
├── products/       # Product management module
├── files/          # File upload and management
├── messages-ws/    # WebSocket gateway for real-time communication
├── seed/           # Database seeding
├── common/         # Shared utilities, decorators, and DTOs
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/check-status` - Verify authentication status

### Products
- `GET /products` - Get all products (with pagination)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (authenticated)
- `PATCH /products/:id` - Update product (authenticated)
- `DELETE /products/:id` - Delete product (authenticated)

### Files
- `POST /files/product` - Upload product images
- `GET /files/product/:imageName` - Get product image

### Seed
- `GET /seed` - Populate database with sample data

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 🔒 Security

- Password encryption using bcrypt
- JWT token-based authentication
- Role-based access control (User, Admin)
- Request validation and sanitization
- Protected routes with guards

## 🐳 Docker

The project includes a `docker-compose.yaml` file for easy database setup:

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f
```

## 📜 Available Scripts

```bash
yarn start          # Start the application
yarn start:dev      # Start in development mode with watch
yarn start:prod     # Start in production mode
yarn build          # Build the project
yarn format         # Format code with Prettier
yarn lint           # Lint and fix code
yarn test           # Run unit tests
yarn test:e2e       # Run end-to-end tests
yarn test:cov       # Generate test coverage report
```

## 🌍 Environment Variables

Create a `.env` file based on `.env.template`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=teslo_shop
JWT_SECRET=your_jwt_secret
PORT=3000
HOST_API=http://localhost:3000/api
```
