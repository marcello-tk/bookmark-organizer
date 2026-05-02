const db = require("../db/in-memory");
const { CreateTagSchema, UpdateTagSchema, TagSchema } = require("../schemas/tag");

class TagService {
  /**
   * Creates a new tag with the provided data.
   * @param {CreateTagSchema} data The data for the new tag.
   * @returns {TagSchema} The newly created tag.
   */
  static async createTag(data) {
    const parsedData = CreateTagSchema.parse(data);
    const newTag = { id: crypto.randomUUID(), ...parsedData };
    db.tags.set(newTag.id, newTag);
    return newTag;
  }

  /**
   * Retrieves a tag by its ID.
   * @param {string} id The ID of the tag to retrieve.
   * @returns {TagSchema|null} The tag with the specified ID, or null if not found.
   */
  static async getTagById(id) {
    return db.tags.get(id);
  }

  /**
   * Retrieves all tags.
   * @returns {TagSchema[]} An array of all tags.
   */
  static async getAllTags() {
    return Array.from(db.tags.values());
  }

  /**
   * Retrieves all tags for a specific user.
   * @param {string} userId The ID of the user.
   * @returns {TagSchema[]} An array of tags for the specified user.
   */
  static async getTagsByUserId(userId) {
    return Array.from(db.tags.values()).filter((t) => t.userId === userId);
  }

  /**
   * Updates a tag with the provided data.
   * @param {string} id The ID of the tag to update.
   * @param {UpdateTagSchema} data The data to update the tag with.
   * @returns {TagSchema|null} The updated tag, or null if not found.
   */
  static async updateTag(id, data) {
    const existingTag = db.tags.get(id);
    if (!existingTag) {
      return null;
    }
    const parsedData = UpdateTagSchema.parse(data);
    const updatedTag = {
      ...existingTag,
      ...Object.fromEntries(Object.entries(parsedData).filter(([_, v]) => v !== undefined)),
    };
    db.tags.set(id, updatedTag);
    return updatedTag;
  }

  /**
   * Replaces a tag with the provided data.
   * @param {string} id The ID of the tag to replace.
   * @param {UpdateTagSchema} data The data to replace the tag with.
   * @returns {TagSchema|null} The replaced tag, or null if not found.
   */
  static async replaceTag(id, data) {
    const existingTag = db.tags.get(id);
    if (!existingTag) {
      return null;
    }
    const parsedData = UpdateTagSchema.parse(data);
    const updatedTag = { ...existingTag, ...parsedData };
    db.tags.set(id, updatedTag);
    return updatedTag;
  }

  /**
   * Deletes a tag by its ID.
   * @param {string} id The ID of the tag to delete.
   * @returns {TagSchema|null} The deleted tag, or null if not found.
   */
  static async deleteTag(id) {
    const existingTag = db.tags.get(id);
    if (!existingTag) {
      return null;
    }
    db.tags.delete(id);
    db.bookmarkTags.forEach((bookmarkTag) => {
      const tagId = bookmarkTag.split(":")[1];
      if (tagId === id) {
        db.bookmarkTags.delete(bookmarkTag);
      }
    });
    return existingTag;
  }

  /**
   * Retrieves all tags for a specific bookmark.
   * @param {string} bookmarkId The ID of the bookmark.
   * @returns {TagSchema[]} An array of tags for the specified bookmark.
   */
  static async getTagsForBookmark(bookmarkId) {
    const tagIds = Array.from(db.bookmarkTags)
      .filter((bt) => bt.startsWith(`${bookmarkId}:`))
      .map((bt) => bt.split(":")[1]);
    return tagIds.map((tagId) => db.tags.get(tagId)).filter(Boolean);
  }

  /**
   * Adds a tag to a specific bookmark.
   * @param {string} bookmarkId The ID of the bookmark.
   * @param {string} tagId The ID of the tag to add.
   * @returns {BookmarkSchema|null} The updated bookmark, or null if not found.
   */
  static async addTagToBookmark(bookmarkId, tagId) {
    const bookmarkTagKey = `${bookmarkId}:${tagId}`;
    db.bookmarkTags.add(bookmarkTagKey);
    return await db.bookmarks.get(bookmarkId);
  }

  /**
   * Removes a tag from a specific bookmark.
   * @param {string} bookmarkId The ID of the bookmark.
   * @param {string} tagId The ID of the tag to remove.
   * @returns {BookmarkSchema|null} The updated bookmark, or null if not found.
   */
  static async removeTagFromBookmark(bookmarkId, tagId) {
    const bookmarkTagKey = `${bookmarkId}:${tagId}`;
    db.bookmarkTags.delete(bookmarkTagKey);
    return await db.bookmarks.get(bookmarkId);
  }
}

module.exports = TagService;
