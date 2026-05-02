const BookmarkService = require("../services/BookmarkService");
const UserService = require("../services/UserService");
const {
  ErrorWithStatus,
  handleError,
  validateRequestBody,
  validateUserId,
  validateBookmarkId,
} = require("../utils/validators");

async function getAllBookmarks(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const userBookmarks = await BookmarkService.getBookmarksByUserId(userId);
    res.status(200).json({ data: userBookmarks });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function getBookmarkById(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const bookmark = await BookmarkService.getBookmarkById(bookmarkId);

    if (!bookmark || bookmark.userId !== userId) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    res.status(200).json({ data: bookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function createBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const body = validateRequestBody(req);
    const { url, title } = body;
    const bookmark = await BookmarkService.createBookmark({ url, title, userId });
    res.status(201).json({ data: bookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function updateBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const bookmark = await BookmarkService.getBookmarkById(bookmarkId);
    if (!bookmark || bookmark.userId !== userId) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    const body = validateRequestBody(req);
    const { url, title } = body;
    const updatedBookmark = await BookmarkService.updateBookmark(bookmarkId, { url, title, userId });
    if (!updatedBookmark) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    res.status(200).json({ data: updatedBookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function replaceBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const bookmark = await BookmarkService.getBookmarkById(bookmarkId);
    if (!bookmark || bookmark.userId !== userId) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    const body = validateRequestBody(req);
    const { url, title } = body;
    const updatedBookmark = await BookmarkService.replaceBookmark(bookmarkId, { url, title, userId });
    if (!updatedBookmark) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    res.status(200).json({ data: updatedBookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function deleteBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const deletedBookmark = await BookmarkService.deleteBookmark(bookmarkId);
    if (!deletedBookmark) {
      throw new ErrorWithStatus("Bookmark not found", 404);
    }
    res.status(204).send();
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

module.exports = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  replaceBookmark,
  deleteBookmark,
};
