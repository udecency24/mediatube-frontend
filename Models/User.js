class User {
  constructor(id, username, role) {
    this.id = id;
    this.username = username;
    this.role = role;
  }

  static fromDatabaseRow(row) {
    return new User(row.id, row.username, row.role);
  }

  isCreator() {
    return this.role === "creator";
  }

  isAdmin() {
    return this.role === "admin";
  }
}

module.exports = User;
