const db = require("../db/in-memory");
const {
  CreateBookmarkSchema,
  UpdateBookmarkSchema,
  BookmarkSchema,
} = require("../schemas/bookmark");

class BookmarkService {
  /**
   * Creates a new bookmark with the provided data.
   * @param {CreateBookmarkSchema} data The data for the new bookmark.
   * @returns {BookmarkSchema} The newly created bookmark.
   */
  static async createBookmark(data) {
    const parsedData = CreateBookmarkSchema.parse(data);
    const newBookmark = { id: crypto.randomUUID(), ...parsedData };
    db.bookmarks.set(newBookmark.id, newBookmark);
    return newBookmark;
  }

  /**
   * Retrieves a bookmark by its ID.
   * @param {string} id The ID of the bookmark to retrieve.
   * @returns {BookmarkSchema|null} The bookmark with the specified ID, or null if not found.
   */
  static async getBookmarkById(id) {
    return db.bookmarks.get(id);
  }

  /**
   * Retrieves all bookmarks.
   * @returns {BookmarkSchema[]} An array of all bookmarks.
   */
  static async getAllBookmarks() {
    return Array.from(db.bookmarks.values());
  }

  /**
   * Retrieves all bookmarks for a specific user.
   * @param {string} userId The ID of the user.
   * @returns {BookmarkSchema[]} An array of bookmarks for the specified user.
   */
  static async getBookmarksByUserId(userId) {
    return Array.from(db.bookmarks.values()).filter((b) => b.userId === userId);
  }

  /**
   * Updates a bookmark with the provided data (PATCH - partial update).
   * @param {string} id The ID of the bookmark to update.
   * @param {UpdateBookmarkSchema} data The data to update the bookmark with.
   * @returns {BookmarkSchema|null} The updated bookmark, or null if not found.
   */
  static async updateBookmark(id, data) {
    const existingBookmark = db.bookmarks.get(id);
    if (!existingBookmark) {
      return null;
    }
    const parsedData = UpdateBookmarkSchema.parse(data);
    const updatedBookmark = {
      ...existingBookmark,
      ...Object.fromEntries(Object.entries(parsedData).filter(([_, v]) => v !== undefined)),
    };
    db.bookmarks.set(id, updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Replaces a bookmark with the provided data (PUT - full replacement).
   * @param {string} id The ID of the bookmark to replace.
   * @param {UpdateBookmarkSchema} data The data to replace the bookmark with.
   * @returns {BookmarkSchema|null} The replaced bookmark, or null if not found.
   */
  static async replaceBookmark(id, data) {
    const existingBookmark = db.bookmarks.get(id);
    if (!existingBookmark) {
      return null;
    }
    const parsedData = UpdateBookmarkSchema.parse(data);
    const updatedBookmark = { ...existingBookmark, ...parsedData };
    db.bookmarks.set(id, updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Deletes a bookmark by its ID.
   * @param {string} id The ID of the bookmark to delete.
   * @returns {BookmarkSchema|null} The deleted bookmark, or null if not found.
   */
  static async deleteBookmark(id) {
    const existingBookmark = db.bookmarks.get(id);
    if (!existingBookmark) {
      return null;
    }
    db.bookmarks.delete(id);
    db.bookmarkTags.forEach((bookmarkTag) => {
      const bookmarkId = bookmarkTag.split(":")[0];
      if (bookmarkId === id) {
        db.bookmarkTags.delete(bookmarkTag);
      }
    });
    return existingBookmark;
  }
}

module.exports = BookmarkService;
