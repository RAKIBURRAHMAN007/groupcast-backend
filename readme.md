````markdown
# Ride Sharing Backend API

## Project Overview

This project is a backend API for a ride-sharing platform, enabling users to register, login, request rides, and drivers to manage ride requests. It supports role-based access control with different roles such as Rider, Driver, and Admin.

Key features include:

- **Geolocation-based driver matching:** Finds the nearest available drivers to the rider’s pickup location using geospatial queries.
- **Fare calculation:** Calculates ride fare dynamically based on the distance between pickup and destination locations.
- User authentication and authorization with JWT tokens (access and refresh tokens).
- User management (create, update, block, unblock, delete).
- Driver registration, approval, suspension, and location updates.
- Ride lifecycle management: request, accept, reject, pick up, transit, complete, cancel.
- Real-time driver availability and earnings tracking.
- Role-based access control enforced via middleware.
- Data validation using schemas.

---

## Setup & Environment Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RAKIBURRAHMAN007/ride-sharing-backEnd
   cd ride-sharing-backend
   ```
````

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   BCRYPT_SALT_ROUND=10
   ```

4. **Run the server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The API will be available at `http://localhost:5000`.

---

## API Endpoints Summary

### Authentication (`/auth`)

| Method | Endpoint          | Description                                | Roles Allowed             | Request Body                   |
| ------ | ----------------- | ------------------------------------------ | ------------------------- | ------------------------------ |
| POST   | `/login`          | User login with email and password         | Public                    | `{ email, password }`          |
| POST   | `/refresh-token`  | Get a new access token using refresh token | Public                    | `{ refreshToken }`             |
| POST   | `/logout`         | Logout user (invalidate tokens)            | Public                    | -                              |
| POST   | `/reset-password` | Reset password                             | Authenticated (all roles) | `{ oldPassword, newPassword }` |

---

### User Management (`/user`)

| Method | Endpoint       | Description         | Roles Allowed        | Request Body / Params                            |
| ------ | -------------- | ------------------- | -------------------- | ------------------------------------------------ |
| POST   | `/register`    | Register new user   | Public               | User details (validated)                         |
| GET    | `/`            | Get all users       | Admin                | -                                                |
| DELETE | `/delete/:id`  | Soft delete a user  | Admin                | URL param: User ID                               |
| PATCH  | `/:id`         | Update user profile | Admin, Driver, Rider | Partial user fields (except email/password/role) |
| PATCH  | `/block/:id`   | Block a user        | Admin                | URL param: User ID                               |
| PATCH  | `/unBlock/:id` | Unblock a user      | Admin                | URL param: User ID                               |

---

### Driver Management (`/driver`)

| Method | Endpoint             | Description                   | Roles Allowed | Request Body / Params                           |
| ------ | -------------------- | ----------------------------- | ------------- | ----------------------------------------------- |
| POST   | `/register`          | Request driver registration   | Rider         | Driver registration info (license, vehicleInfo) |
| PATCH  | `/approve/:id`       | Approve a driver registration | Admin         | URL param: Driver ID                            |
| PATCH  | `/suspend/:id`       | Suspend a driver              | Admin         | URL param: Driver ID                            |
| POST   | `/get-all-driver`    | Get all approved drivers      | Admin         | -                                               |
| PATCH  | `/location`          | Update driver location        | Driver        | `{ latitude, longitude }`                       |
| PATCH  | `/set-ability-true`  | Set driver online             | Driver        | -                                               |
| PATCH  | `/set-ability-false` | Set driver offline            | Driver        | -                                               |
| GET    | `/earningHistory`    | Get driver earnings history   | Driver        | -                                               |

---

### Ride Management (`/ride`)

| Method | Endpoint           | Description             | Roles Allowed | Request Body / Params                                     |
| ------ | ------------------ | ----------------------- | ------------- | --------------------------------------------------------- |
| POST   | `/request-ride`    | Request a ride          | Rider         | `{ pickupLocation: {lat, lng}, destination: {lat, lng} }` |
| POST   | `/accept-ride/:id` | Accept a ride request   | Driver        | URL param: Ride ID                                        |
| POST   | `/reject-ride/:id` | Reject a ride request   | Driver        | URL param: Ride ID                                        |
| PATCH  | `/picked-up/:id`   | Mark ride as picked up  | Driver        | URL param: Ride ID                                        |
| PATCH  | `/in-transit/:id`  | Mark ride as in transit | Driver        | URL param: Ride ID                                        |
| PATCH  | `/completed/:id`   | Mark ride as completed  | Driver        | URL param: Ride ID                                        |
| GET    | `/rideHistory`     | Get ride history        | Rider         | -                                                         |
| PATCH  | `/cancel/:id`      | Cancel a ride           | Rider         | URL param: Ride ID                                        |
| GET    | `/get-all-ride`    | Get all rides           | Admin         | -                                                         |

---

## Notes

- All routes requiring authentication use JWT tokens and role checks via `checkAuth` middleware.
- Passwords are hashed using bcrypt with configurable salt rounds.
- Drivers must be approved by an admin before they can accept rides.
- Ride fares and distances are calculated server-side based on coordinates.
- Proper error handling with HTTP status codes and messages is implemented throughout.

---

## Technologies Used

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Zod for request validation
- HTTP status codes package for standardized responses
