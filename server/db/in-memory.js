/**
 * In-memory "database" using Maps for efficient lookups and Sets for relationships.
 * In a real application, this would be replaced with a proper database.
 */
const db = {
  users: new Map(),
  bookmarks: new Map(),
  tags: new Map(),
  bookmarkTags: new Set(), // `${bookmarkId}:${tagId}`
};

db.users.set("1", { id: "1", name: "Alice", email: "alice@example.com" });
db.bookmarks.set("1", { id: "1", userId: "1", url: "https://example.com", title: "Example" });
db.tags.set("1", { id: "1", userId: "1", name: "Tech" });
db.bookmarkTags.add("1:1"); // Bookmark 1 has Tag 1

module.exports = db;
