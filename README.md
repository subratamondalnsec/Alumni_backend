# Alumni Connect Backend API

Backend API for the Alumni Connect application built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Signup/Login)
- JWT-based authorization
- Cloudinary integration for image uploads
- MongoDB database with Mongoose ODM
- Secure password hashing with bcrypt
- Input validation

#### Signup
```
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "accountType": "Student"
}

```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accountType": "Student",
    "image": "avatar_url"
  },
  "message": "student registered successfully"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accountType": "Student"
  },
  "message": "Student logged in successfully"
}
```


## Project Structure

```
Alumni-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   └── Auth.js            # Authentication controllers
│   ├── middlewares/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   └── StudentModel.js    # Student schema
│   ├── routes/
│   │   └── auth.js            # Authentication routes
│   ├── utils/
│   │   ├── imageUploader.js   # Cloudinary upload utility
│   │   └── tokenGenerator.js  # JWT token utilities
│   └── index.js               # Application entry point
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── package.json               # Project dependencies
```

