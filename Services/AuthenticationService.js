const jwt = require("jsonwebtoken");
const User = require("../Models/User");

class AuthService {
  constructor(database) {
    this.database = database;
  }

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const users = await this.database.executeSql(
        `SELECT id, username, password, role FROM Users WHERE username = ?`,
        [username]
      );

      if (users.length === 0 || password !== users[0].password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = User.fromDatabaseRow(users[0]);
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async register(req, res) {
    const { username, password, role = "consumer" } = req.body;

    try {
      const existingUsers = await this.database.executeSql(
        `SELECT id FROM Users WHERE username = ?`,
        [username]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await this.database.executeSql(
        `INSERT INTO Users (username, password, role) VALUES (?, ?, ?)`,
        [username, password, role]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async createCreator(req, res) {
    const { username, password } = req.body;

    try {
      const existingUsers = await this.database.executeSql(
        `SELECT id FROM Users WHERE username = ?`,
        [username]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await this.database.executeSql(
        `INSERT INTO Users (username, password, role) VALUES (?, ?, 'creator')`,
        [username, password]
      );

      res.status(201).json({ message: "Creator account created successfully" });
    } catch (error) {
      console.error("Creator creation error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || "@dm1n4321", (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
}

module.exports = AuthService;
