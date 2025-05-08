const { BlobServiceClient } = require("@azure/storage-blob");
const Media = require("../Models/Media");

class VideoService {
  constructor(database) {
    this.database = database;
  }

  async getAllVideos(req, res) {
    try {
      const videos = await this.database.executeSql(
        `
        SELECT v.*, u.username as uploaderName
        FROM Videos v
        JOIN Users u ON v.uploaderId = u.id
        ORDER BY v.uploadDate DESC
      `
      );

      const mediaList = videos.map(Media.fromDatabaseRow);
      res.json(mediaList);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getVideoById(req, res) {
    const videoId = req.params.id;

    try {
      const videos = await this.database.executeSql(
        `
        SELECT v.*, u.username as uploaderName
        FROM Videos v
        JOIN Users u ON v.uploaderId = u.id
        WHERE v.id = ?
      `,
        [videoId]
      );

      if (videos.length === 0) {
        return res.status(404).json({ message: "Video not found" });
      }

      const video = Media.fromDatabaseRow(videos[0]);

      const comments = await this.database.executeSql(
        `
        SELECT c.*, u.username
        FROM Comments c
        JOIN Users u ON c.userId = u.id
        WHERE c.videoId = ?
        ORDER BY c.createdAt DESC
      `,
        [videoId]
      );

      const ratings = await this.database.executeSql(
        `
        SELECT AVG(rating) as averageRating, COUNT(*) as ratingCount
        FROM Ratings
        WHERE videoId = ?
      `,
        [videoId]
      );

      video.comments = comments;
      video.averageRating = ratings[0].averageRating || 0;
      video.ratingCount = ratings[0].ratingCount || 0;

      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async uploadVideo(req, res) {
    /*if (req.user.role !== "creator" || req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message:
            "Only creators and admins can upload videos. Login as a creator to upload a video",
        });
    }*/

    try {
      const { title, publisher, producer, genre, ageRating } = req.body;

      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING
      );
      const containerClient = blobServiceClient.getContainerClient(
        process.env.STORAGE_CONTAINER
      );

      const filename = `${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);

      const blobUrl = blockBlobClient.url;

      await this.database.executeSql(
        `
        INSERT INTO Videos (title, publisher, producer, genre, ageRating, blobUrl, uploaderId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          title,
          publisher || "",
          producer || "",
          genre || "",
          ageRating || "",
          blobUrl,
          req.user.id,
        ]
      );

      res.status(201).json({ message: "Video uploaded successfully", blobUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async addComment(req, res) {
    const videoId = req.params.id;
    const { comment } = req.body;

    try {
      await this.database.executeSql(
        `
        INSERT INTO Comments (videoId, userId, comment)
        VALUES (?, ?, ?)
      `,
        [videoId, req.user.id, comment]
      );

      res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error("Comment error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async addRating(req, res) {
    const videoId = req.params.id;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    try {
      const existingRatings = await this.database.executeSql(
        `
        SELECT id FROM Ratings
        WHERE videoId = ? AND userId = ?
      `,
        [videoId, req.user.id]
      );

      if (existingRatings.length > 0) {
        await this.database.executeSql(
          `
          UPDATE Ratings
          SET rating = ?
          WHERE videoId = ? AND userId = ?
        `,
          [rating, videoId, req.user.id]
        );
      } else {
        await this.database.executeSql(
          `
          INSERT INTO Ratings (videoId, userId, rating)
          VALUES (?, ?, ?)
        `,
          [videoId, req.user.id, rating]
        );
      }

      res.status(201).json({ message: "Rating submitted successfully" });
    } catch (error) {
      console.error("Rating error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getVideosByGenre(req, res) {
    const genre = req.params.genre;

    try {
      // Log for debugging
      console.log(`Fetching videos for genre: ${genre}`);

      const videos = await this.database.executeSql(
        `
        SELECT v.*, u.username as uploaderName
        FROM Videos v
        JOIN Users u ON v.uploaderId = u.id
        WHERE v.genre LIKE ?
        ORDER BY v.uploadDate DESC
        `,
        [`%${genre}%`]
      );

      if (videos.length === 0) {
        return res
          .status(404)
          .json({ message: "No videos found for this genre" });
      }

      // Convert to Media objects
      const mediaList = videos.map(Media.fromDatabaseRow);
      res.json(mediaList);
    } catch (error) {
      console.error("Error fetching videos by genre:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async searchVideos(req, res) {
    const query = req.query.q || "";

    try {
      const videos = await this.database.executeSql(
        `
        SELECT v.*, u.username as uploaderName
        FROM Videos v
        JOIN Users u ON v.uploaderId = u.id
        WHERE v.title LIKE ?
        OR v.publisher LIKE ?
        OR v.producer LIKE ?
        OR v.genre LIKE ?
        ORDER BY v.uploadDate DESC
      `,
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
      );

      res.json(videos);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getComments(req, res) {
    const videoId = req.params.id;

    try {
      const comments = await this.database.executeSql(
        `
        SELECT c.id, c.comment, c.createdAt, u.id AS userId, u.username
        FROM Comments c
        JOIN Users u ON c.userId = u.id
        WHERE c.videoId = ?
        ORDER BY c.createdAt DESC
        `,
        [videoId]
      );

      if (comments.length === 0) {
        return res
          .status(404)
          .json({ message: "No comments found for this video" });
      }

      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getRatings(req, res) {
    const videoId = req.params.id;

    try {
      const ratings = await this.database.executeSql(
        `
        SELECT r.id, r.rating, r.createdAt, u.id AS userId, u.username
        FROM Ratings r
        JOIN Users u ON r.userId = u.id
        WHERE r.videoId = ?
        ORDER BY r.createdAt DESC
        `,
        [videoId]
      );

      if (ratings.length === 0) {
        return res
          .status(404)
          .json({ message: "No ratings found for this video" });
      }

      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = VideoService;
