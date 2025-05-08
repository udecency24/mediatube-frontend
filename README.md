````markdown
# MediaShareHub API

MediaShareHub API is a scalable backend system for managing media sharing. It provides endpoints for user authentication, video uploads, comments, ratings, and more. The API is built using Node.js, Express, MySQL, and Azure Blob Storage.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Videos](#videos)
  - [Comments](#comments)
  - [Ratings](#ratings)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (login, registration, and creator account creation)
- Video upload and management
- Commenting on videos
- Rating videos
- Search functionality for videos
- Secure password storage using bcrypt
- JWT-based authentication
- Azure Blob Storage integration for video uploads

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Storage**: Azure Blob Storage
- **Authentication**: JWT (JSON Web Tokens)
- **ORM/Database Library**: `mysql2`
- **Other Libraries**: `dotenv`, `bcryptjs`, `multer`

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mediasharehub-api.git
   cd mediasharehub-api
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables (see [Environment Variables](#environment-variables)).

4. Run the MySQL database script to create the necessary tables:

   ```bash
   mysql -u <username> -p < database_name < script.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
SQL_SERVER=your-mysql-host
SQL_DATABASE=your-database-name
SQL_USER=your-database-username
SQL_PASSWORD=your-database-password
STORAGE_CONNECTION_STRING=your-azure-blob-storage-connection-string
STORAGE_CONTAINER=your-container-name
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=2h
```

---

## Database Schema

The database schema is defined in the `script.sql` file. Below is an overview of the tables:

### Users Table

| Column      | Type         | Description                           |
| ----------- | ------------ | ------------------------------------- |
| `id`        | INT          | Primary key                           |
| `username`  | VARCHAR(255) | Unique username                       |
| `password`  | VARCHAR(255) | Hashed password                       |
| `role`      | ENUM         | Role (`admin`, `creator`, `consumer`) |
| `createdAt` | TIMESTAMP    | Timestamp of creation                 |
| `updatedAt` | TIMESTAMP    | Timestamp of last update              |

### Videos Table

| Column       | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `id`         | INT          | Primary key                     |
| `title`      | VARCHAR(255) | Video title                     |
| `publisher`  | VARCHAR(255) | Publisher name                  |
| `producer`   | VARCHAR(255) | Producer name                   |
| `genre`      | VARCHAR(255) | Video genre                     |
| `ageRating`  | VARCHAR(10)  | Age rating                      |
| `blobUrl`    | TEXT         | Azure Blob Storage URL          |
| `uploaderId` | INT          | Foreign key referencing `Users` |
| `uploadDate` | TIMESTAMP    | Timestamp of upload             |

### Comments Table

| Column      | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| `id`        | INT       | Primary key                      |
| `videoId`   | INT       | Foreign key referencing `Videos` |
| `userId`    | INT       | Foreign key referencing `Users`  |
| `comment`   | TEXT      | Comment text                     |
| `createdAt` | TIMESTAMP | Timestamp of creation            |

### Ratings Table

| Column      | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| `id`        | INT       | Primary key                      |
| `videoId`   | INT       | Foreign key referencing `Videos` |
| `userId`    | INT       | Foreign key referencing `Users`  |
| `rating`    | TINYINT   | Rating (1-5)                     |
| `createdAt` | TIMESTAMP | Timestamp of creation            |

---

## API Endpoints

### Authentication

#### Login

- **POST** `/api/login`
- **Request Body**:
  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "username": "example",
      "role": "consumer"
    }
  }
  ```

#### Register

- **POST** `/api/register`
- **Request Body**:
  ```json
  {
    "username": "example",
    "password": "password123",
    "role": "consumer"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### Create Creator

- **POST** `/api/create-creator`
- **Request Body**:
  ```json
  {
    "username": "creator",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Creator account created successfully"
  }
  ```

---

### Videos

#### Get All Videos

- **GET** `/api/videos`
- **Query Parameters**:
  - `limit` (optional): Number of videos to return.
  - `offset` (optional): Offset for pagination.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Video Title",
      "publisher": "Publisher Name",
      "producer": "Producer Name",
      "genre": "Genre",
      "ageRating": "PG-13",
      "blobUrl": "https://example.com/video.mp4",
      "uploaderId": 1,
      "uploaderName": "creator",
      "uploadDate": "2025-05-07T12:00:00Z"
    }
  ]
  ```

#### Get Video by ID

- **GET** `/api/videos/:id`
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Video Title",
    "comments": [
      {
        "id": 1,
        "userId": 2,
        "username": "user",
        "comment": "Great video!",
        "createdAt": "2025-05-07T12:00:00Z"
      }
    ],
    "averageRating": 4.5,
    "ratingCount": 10
  }
  ```

#### Upload Video

- **POST** `/api/videos`
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Request Body** (form-data):
  - `videoFile`: Video file to upload.
  - `title`, `publisher`, `producer`, `genre`, `ageRating`: Metadata.
- **Response**:
  ```json
  {
    "message": "Video uploaded successfully",
    "blobUrl": "https://example.com/video.mp4"
  }
  ```

#### Get Videos by Genre

- **GET** `/api/videos/genre/:genre`
- **Description**: Retrieves all videos matching a specific genre.
- **Example**: `/api/videos/genre/action`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Action Movie",
      "publisher": "Publisher Name",
      "producer": "Producer Name",
      "genre": "action",
      "ageRating": "PG-13",
      "blobUrl": "https://example.com/video.mp4",
      "uploaderId": 1,
      "uploaderName": "creator",
      "uploadDate": "2025-05-07T12:00:00Z"
    },
    {
      "id": 3,
      "title": "Another Action Movie",
      "publisher": "Publisher Name",
      "producer": "Producer Name",
      "genre": "action/adventure",
      "ageRating": "PG-13",
      "blobUrl": "https://example.com/video2.mp4",
      "uploaderId": 1,
      "uploaderName": "creator",
      "uploadDate": "2025-05-08T12:00:00Z"
    }
  ]
  ```

---

### Comments

#### Get Comments for a Video

- **GET** `/api/videos/:id/comments`
- **Description**: Retrieves all comments for a specific video.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "comment": "Great video!",
      "createdAt": "2025-05-07T12:00:00Z",
      "userId": 2,
      "username": "user1"
    },
    {
      "id": 2,
      "comment": "Very informative!",
      "createdAt": "2025-05-07T13:00:00Z",
      "userId": 3,
      "username": "user2"
    }
  ]
  ```

#### Add Comment

- **POST** `/api/videos/:id/comments`
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Request Body**:
  ```json
  {
    "comment": "Great video!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Comment added successfully"
  }
  ```

---

### Ratings

GET /api/videos/:id/ratings
Description: Retrieves all ratings for a specific video.

````json
[
  {
    "id": 1,
    "rating": 5,
    "createdAt": "2025-05-07T12:00:00Z",
    "userId": 2,
    "username": "user1"
  },
  {
    "id": 2,
    "rating": 4,
    "createdAt": "2025-05-07T13:00:00Z",
    "userId": 3,
    "username": "user2"
  }
]

#### Add Rating

- **POST** `/api/videos/:id/ratings`
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Request Body**:
  ```json
  {
    "rating": 5
  }
````

- **Response**:
  ```json
  {
    "message": "Rating submitted successfully"
  }
  ```

---

## Error Handling

- **500 Internal Server Error**: Returned for unexpected server errors.
- **401 Unauthorized**: Returned when authentication fails.
- **403 Forbidden**: Returned when the user does not have permission to perform an action.
- **404 Not Found**: Returned when a resource is not found.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```

```
