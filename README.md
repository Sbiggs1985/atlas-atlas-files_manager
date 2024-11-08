# File Upload API - Back-End Project

This project builds a back-end API for file management using **NodeJS**, **MongoDB**, **Redis**, and background processing with **Bull**. The project includes authentication, file upload, metadata handling, and background processing for generating image thumbnails.

## Table of Contents

1. [Redis Client Setup](#redis-client-setup)
2. [MongoDB Client Setup](#mongodb-client-setup)
3. [First API Setup](#first-api-setup)
4. [User Creation API](#user-creation-api)
5. [User Authentication](#user-authentication)
6. [File Upload API](#file-upload-api)
7. [Get and List Files](#get-and-list-files)
8. [File Publish/Unpublish](#file-publishunpublish)
9. [File Data](#file-data)
10. [Image Thumbnails](#image-thumbnails)
11. [Files Structure](#files-structure)
12. [Requirements](#requirements)

---

## Redis Client Setup

- **Task**: Create a Redis client to store temporary data like authentication tokens.
- **Functions**: `isAlive()`, `get()`, `set()`, `del()`.
- **File**: `utils/redis.js`.

---

## MongoDB Client Setup

- **Task**: Set up a MongoDB client to interact with the database.
- **Functions**: `isAlive()`, `nbUsers()`, `nbFiles()`.
- **File**: `utils/db.js`.

---

## First API Setup

- **Task**: Set up Express and basic API routes for status and stats.
- **Endpoints**:
  - `GET /status`: Check Redis and MongoDB status.
  - `GET /stats`: Get user and file counts.
- **Files**: `server.js`, `routes/index.js`, `controllers/AppController.js`.

---

## User Creation API

- **Task**: Create a user with validation for email/password.
- **Endpoint**: `POST /users`.
- **Features**:
  - Validate email/password.
  - Hash password using SHA1.
  - Return user info with email and ID.
- **Files**: `routes/index.js`, `controllers/UsersController.js`.

---

## User Authentication

- **Task**: Implement user login, logout, and token-based authentication.
- **Endpoints**:
  - `GET /connect`: Login and generate token.
  - `GET /disconnect`: Logout and delete token.
  - `GET /users/me`: Retrieve user info based on token.
- **Files**: `routes/index.js`, `controllers/AuthController.js`, `controllers/UsersController.js`.

---

## File Upload API

- **Task**: Implement file upload with metadata and content storage.
- **Endpoint**: `POST /files`.
- **Features**:
  - Validate file metadata (name, type, etc.).
  - Save file locally and store details in MongoDB.
- **Files**: `routes/index.js`, `controllers/FilesController.js`.

---

## Get and List Files

- **Task**: Add endpoints to retrieve and list user files with pagination.
- **Endpoints**:
  - `GET /files/:id`: Retrieve a file by ID.
  - `GET /files`: List user files with pagination.
- **Features**:
  - Supports pagination with 20 items per page.
  - Requires user authentication based on token.
- **Files**: `routes/index.js`, `controllers/FilesController.js`.

---

## File Publish/Unpublish

- **Task**: Implement functionality to publish/unpublish files.
- **Endpoints**:
  - `PUT /files/:id/publish`: Set a file to public.
  - `PUT /files/:id/unpublish`: Set a file to private.
- **Features**:
  - Check user authentication and file existence.
  - Update the `isPublic` field in the database.
- **Files**: `routes/index.js`, `controllers/FilesController.js`.

---

## File Data

- **Task**: Add endpoint to retrieve the content of a file.
- **Endpoint**: `GET /files/:id/data`.
- **Features**:
  - Check for file availability and user permissions.
  - Support for MIME type based on file extension.
  - Return the file content or error if not found.
- **Files**: `routes/index.js`, `controllers/FilesController.js`.

---

## Image Thumbnails

- **Task**: Generate image thumbnails asynchronously using a background job.
- **Features**:
  - Use **Bull** to handle background processing.
  - Generate thumbnails at three sizes (500px, 250px, 100px) for image files.
  - Update the `/files` endpoint to start a background job when an image is uploaded.
  - Add size query parameter to the `/files/:id/data` endpoint to serve specific thumbnail sizes.
- **Files**: `routes/index.js`, `controllers/FilesController.js`, `worker.js`.

---

## Files Structure

```
/project-root
│
├── server.js               # Starts Express server
├── package.json            # Dependencies and scripts
├── .eslintrc.js            # ESLint configuration
├── babel.config.js         # Babel configuration
│
├── /controllers
│   ├── AppController.js    # Status and stats endpoints
│   ├── UsersController.js  # User management
│   ├── AuthController.js   # Authentication logic
│   └── FilesController.js  # File upload, list, and metadata
│
├── /utils
│   ├── redis.js            # Redis client
│   └── db.js               # MongoDB client
│
├── /routes
│   └── index.js            # API routes
│
└── worker.js               # Background job processor for image thumbnails
```

---

## Requirements

- **Editors**: vi, vim, emacs, VS Code.
- **Node.js version**: 12.x.x.
- **OS**: Ubuntu 18.04 LTS.
- **Code style**: Must pass ESLint checks.
- **Dependencies**: `npm install` to set up.

### Authors
[Stephaine Biggs](https://github.com/Sbiggs1985)

[Jesse Brumley](https://github.com/jessebrumley)