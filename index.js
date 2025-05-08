require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Database = require("./database");
const AuthService = require("./services/AuthenticationService");
const VideoService = require("./Services/MediaService");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Initialize Express app
class App {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.database = new Database();
    this.authService = new AuthService(this.database);
    this.videoService = new VideoService(this.database);
    this.configureRoutes();
  }

  configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    const storage = multer.memoryStorage();
    this.upload = multer({ storage: storage });
    //global error handler
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Internal Server Error" });
    });
  }

  configureRoutes() {
    // Auth routes
    this.app.post("/api/login", (req, res) => this.authService.login(req, res));
    this.app.post("/api/register", (req, res) =>
      this.authService.register(req, res)
    );
    this.app.post(
      "/api/create-creator",
      this.authService.authenticateToken,
      (req, res) => this.authService.createCreator(req, res)
    );

    // Video routes
    this.app.get("/api/videos", (req, res) =>
      this.videoService.getAllVideos(req, res)
    );
    this.app.get("/api/videos/:id", (req, res) =>
      this.videoService.getVideoById(req, res)
    );
    this.app.post(
      "/api/videos",
      this.authService.authenticateToken,
      this.upload.single("videoFile"),
      (req, res) => this.videoService.uploadVideo(req, res)
    );

    this.app.get("/api/videos/genre/:genre", (req, res) =>
      this.videoService.getVideosByGenre(req, res)
    );

    //comment routes
    this.app.get("/api/videos/:id/comments", (req, res) =>
      this.videoService.getComments(req, res)
    );
    this.app.post(
      "/api/videos/:id/comments",
      this.authService.authenticateToken,
      (req, res) => this.videoService.addComment(req, res)
    );

    // rating routes
    this.app.get("/api/videos/:id/ratings", (req, res) =>
      this.videoService.getRatings(req, res)
    );
    this.app.post(
      "/api/videos/:id/ratings",
      this.authService.authenticateToken,
      (req, res) => this.videoService.addRating(req, res)
    );
  }

  start() {
    console.log("Starting the server...");
    const PORT = process.env.PORT || 3001;
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

// Instantiate and start the app
const app = new App();
app.start();
