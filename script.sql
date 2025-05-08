-- Create Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'creator', 'consumer') NOT NULL DEFAULT 'consumer',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Videos Table
CREATE TABLE Videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    producer VARCHAR(255),
    genre VARCHAR(255),
    ageRating VARCHAR(10),
    blobUrl TEXT NOT NULL,
    uploaderId INT NOT NULL,
    uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaderId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Comments Table
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    videoId INT NOT NULL,
    userId INT NOT NULL,
    comment TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (videoId) REFERENCES Videos(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Ratings Table
CREATE TABLE Ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    videoId INT NOT NULL,
    userId INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (videoId) REFERENCES Videos(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Add Indexes for Performance Optimization
CREATE INDEX idx_videos_uploaderId ON Videos (uploaderId);
CREATE INDEX idx_comments_videoId ON Comments (videoId);
CREATE INDEX idx_comments_userId ON Comments (userId);
CREATE INDEX idx_ratings_videoId ON Ratings (videoId);
CREATE INDEX idx_ratings_userId ON Ratings (userId);