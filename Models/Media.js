class Media {
  constructor(
    id,
    title,
    publisher,
    producer,
    genre,
    ageRating,
    blobUrl,
    uploaderId,
    uploadDate
  ) {
    this.id = id;
    this.title = title;
    this.publisher = publisher;
    this.producer = producer;
    this.genre = genre;
    this.ageRating = ageRating;
    this.blobUrl = blobUrl;
    this.uploaderId = uploaderId;
    this.uploadDate = uploadDate;
  }

  static fromDatabaseRow(row) {
    return new Media(
      row.id,
      row.title,
      row.publisher,
      row.producer,
      row.genre,
      row.ageRating,
      row.blobUrl,
      row.uploaderId,
      row.uploadDate
    );
  }
}

module.exports = Media;
