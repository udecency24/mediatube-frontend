# MediaTube - A YouTube-Like Video Sharing Platform

![MediaTube Logo](https://via.placeholder.com/800x200?text=MediaTube)

## Overview

MediaTube is a modern video sharing platform built with React. The application allows users to browse videos, watch content, upload their own videos (for creators), engage with content through ratings and comments, and manage their uploaded videos through a creator dashboard.

## Table of Contents

- Features
- Tech Stack
- Project Structure
- Installation
- Configuration
- API Integration
- Authentication
- Usage
- Component Documentation
- Styling
- Mock Data
- Contributing
- License

## Features

### User-Facing Features

- **Video Browsing**: Explore videos through the homepage feed
- **Video Categories**: Filter videos by categories (Trending, Music, Movies, etc.)
- **Video Search**: Search for videos by keywords
- **Video Playback**: Watch videos with a responsive video player
- **User Authentication**: Register and login functionality with role-based access
- **Comments**: View and add comments to videos
- **Ratings**: Rate videos with a 5-star system

### Creator-Specific Features

- **Video Upload**: Upload videos with detailed metadata
- **Creator Dashboard**: Analytics and management for uploaded videos
- **Performance Tracking**: View metrics like views, ratings, and comments

### UI/UX Features

- **Responsive Design**: Works across mobile, tablet, and desktop
- **YouTube-like UI**: Familiar interface inspired by YouTube
- **Light/Dark Modes**: Toggle between viewing preferences
- **Loading States**: Visual feedback during data fetching operations

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Video Player**: React Player
- **UI Icons**: React Icons
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App

## Project Structure

```
mediatube/
├── public/               # Public assets and HTML template
├── src/                  # Source code
│   ├── api/              # API integration modules
│   │   ├── auth.js       # Authentication API calls
│   │   ├── comments.js   # Comments API calls
│   │   ├── index.js      # Axios configuration
│   │   ├── ratings.js    # Ratings API calls
│   │   └── videos.js     # Videos API calls
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── video/        # Video-related components
│   ├── context/          # React context providers
│   │   ├── AuthContext.js    # Authentication state
│   │   └── ThemeContext.js   # Theme preferences
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js    # Authentication hook
│   │   └── useVideo.js   # Video data fetching hook
│   ├── pages/            # Page components
│   │   ├── CreatorDashboard.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── NotFoundPage.js
│   │   ├── RegisterPage.js
│   │   ├── UploadPage.js
│   │   └── VideoPage.js
│   ├── styles/           # CSS and styling
│   │   ├── index.css     # Main stylesheet
│   │   └── variables.css # CSS variables
│   ├── utils/            # Utility functions
│   │   ├── formatDate.js     # Date formatting
│   │   ├── formatView.js     # View count formatting
│   │   └── validateForm.js   # Form validation
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── README.md             # Project documentation
└── tailwind.config.js    # Tailwind CSS configuration
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mediatube.git
   cd mediatube
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://your-api-url/api
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be adjusted in tailwind.config.js:

## API Integration

MediaTube connects to a backend API for data operations. The API integration is centralized in the api directory.

### Base API Configuration

The index.js file configures Axios with interceptors for adding authentication tokens and handling common responses:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Modules

The API functionality is organized into focused modules:

- auth.js: Authentication operations (login, register)
- videos.js: Video operations (get videos, upload video)
- comments.js: Comment operations
- ratings.js: Rating operations

## Authentication

Authentication is managed through React Context via AuthContext.js:

### User Roles

The system supports two user roles:

- **Consumer** - Regular users who can watch videos and leave comments
- **Creator** - Users who can upload videos and access the creator dashboard

### Authentication Flow

1. Users register with username, password, and selected role
2. Login provides a JWT token stored in localStorage
3. Protected routes check authentication state via the `useAuth` hook
4. Role-based UI components conditionally render based on user role

## Usage

### Homepage

The homepage displays a grid of videos that can be filtered by category:

### Video Playback

The VideoPage component handles video playback, comments, and related videos:

### Video Upload

Creators can upload videos with metadata:

## Component Documentation

### Core Components

#### Video Components

- **VideoList**: Renders a grid of VideoCard components with loading and pagination
- **VideoCard**: Displays video thumbnail and metadata
- **VideoPlayer**: Provides playback functionality with React Player
- **VideoUpload**: Form for uploading new videos with preview
- **CommentSection**: Displays and manages video comments

#### Authentication Components

- **LoginForm**: Handles user login
- **RegisterForm**: Handles new user registration

#### Layout Components

- **Header**: Main navigation with search, user menu
- **Sidebar**: Category navigation
- **Footer**: Site links and info

#### Common UI Components

- **Button**: Reusable button with variants
- **Input**: Form input with validation
- **Modal**: Dialog component
- **Loader**: Loading spinner

### Custom Hooks

- **useAuth**: Access authentication context
- **useVideo**: Fetch and manage video data
- **useTheme**: Manage theme preferences

## Styling

The project uses Tailwind CSS for styling with custom utility classes defined in index.css:

## Mock Data

The application uses mock data for development when API is not available:

## Contributing

Contributions to MediaTube are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the existing style conventions and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 MediaTube. All rights reserved.
