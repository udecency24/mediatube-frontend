const mysql = require("mysql2/promise");

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.SQL_SERVER,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        // Enable SSL for secure connections
        rejectUnauthorized: true,
      },
    });
  }

  async executeSql(query, params = []) {
    try {
      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
}

module.exports = Database;
