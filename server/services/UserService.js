const db = require("../db/in-memory");
const { CreateUserSchema, UpdateUserSchema, UserSchema } = require("../schemas/user");
const { ErrorWithStatus } = require("../utils/validators");

class UserService {
  /**
   * Creates a new user with the provided data.
   * @param {CreateUserSchema} data The data for the new user.
   * @returns {UserSchema} The newly created user.
   */
  static async createUser(data) {
    const parsedData = CreateUserSchema.parse(data);
    const newUser = { id: crypto.randomUUID(), ...parsedData };
    if (Array.from(db.users.values()).some((u) => u.email === newUser.email)) {
      throw new ErrorWithStatus("Email already exists", 400);
    }
    db.users.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Retrieves a user by their ID.
   * @param {string} id The ID of the user to retrieve.
   * @returns {UserSchema|null} The user with the specified ID, or null if not found.
   */
  static async getUserById(id) {
    return db.users.get(id);
  }

  /**
   * Retrieves all users.
   * @returns {UserSchema[]} An array of all users.
   */
  static async getAllUsers() {
    return Array.from(db.users.values());
  }

  /**
   * Updates a user with the provided data.
   * @param {string} id The ID of the user to update.
   * @param {UpdateUserSchema} data The data to update the user with.
   * @returns {UserSchema|null} The updated user, or null if not found.
   */
  static async updateUser(id, data) {
    const existingUser = db.users.get(id);
    if (!existingUser) {
      return null;
    }
    const parsedData = UpdateUserSchema.parse(data);
    const updatedUser = {
      ...existingUser,
      ...Object.fromEntries(Object.entries(parsedData).filter(([_, v]) => v !== undefined)),
    };
    db.users.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Replaces a user with the provided data.
   * @param {string} id The ID of the user to replace.
   * @param {UpdateUserSchema} data The data to replace the user with.
   * @returns {UserSchema|null} The replaced user, or null if not found.
   */
  static async replaceUser(id, data) {
    const existingUser = db.users.get(id);
    if (!existingUser) {
      return null;
    }
    const parsedData = UpdateUserSchema.parse(data);
    const updatedUser = { ...existingUser, ...parsedData };
    db.users.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id The ID of the user to delete.
   * @returns {UserSchema|null} The deleted user, or null if not found.
   */
  static async deleteUser(id) {
    const existingUser = db.users.get(id);
    if (!existingUser) {
      return null;
    }
    db.users.delete(id);
    db.bookmarks.forEach((bookmark, bookmarkId) => {
      if (bookmark.userId === id) {
        db.bookmarks.delete(bookmarkId);
      }
    });
    db.tags.forEach((tag, tagId) => {
      if (tag.userId === id) {
        db.tags.delete(tagId);
      }
    });
    return existingUser;
  }
}

module.exports = UserService;
