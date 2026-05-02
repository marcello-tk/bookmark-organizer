const TagService = require("../services/TagService");
const UserService = require("../services/UserService");
const {
  ErrorWithStatus,
  handleError,
  validateRequestBody,
  validateUserId,
  validateTagId,
  validateBookmarkId,
} = require("../utils/validators");

async function getAllTags(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const userTags = await TagService.getTagsByUserId(userId);
    res.status(200).json({ data: userTags });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function getTagById(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const tagId = validateTagId(req);
    const tag = await TagService.getTagById(tagId);
    if (!tag || tag.userId !== userId) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    res.status(200).json({ data: tag });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function createTag(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const body = validateRequestBody(req);
    const { name } = body;
    const tag = await TagService.createTag({ name, userId });
    res.status(201).json({ data: tag });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function updateTag(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const tagId = validateTagId(req);
    const tag = await TagService.getTagById(tagId);
    if (!tag || tag.userId !== userId) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    const body = validateRequestBody(req);
    const { name } = body;
    const updatedTag = await TagService.updateTag(tagId, { name });
    if (!updatedTag) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    res.status(200).json({ data: updatedTag });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function replaceTag(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const tagId = validateTagId(req);
    const tag = await TagService.getTagById(tagId);
    if (!tag || tag.userId !== userId) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    const body = validateRequestBody(req);
    const { name } = body;
    const updatedTag = await TagService.replaceTag(tagId, { name });
    if (!updatedTag) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    res.status(200).json({ data: updatedTag });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function deleteTag(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const tagId = validateTagId(req);
    const tag = await TagService.getTagById(tagId);
    if (!tag || tag.userId !== userId) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    const deletedTag = await TagService.deleteTag(tagId);
    if (!deletedTag) {
      throw new ErrorWithStatus("Tag not found", 404);
    }
    res.status(204).send();
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function getTagsForBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const tags = await TagService.getTagsForBookmark(bookmarkId);
    res.status(200).json({ data: tags });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function addTagToBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const tagId = validateTagId(req);
    const updatedBookmark = await TagService.addTagToBookmark(bookmarkId, tagId);
    res.status(200).json({ data: updatedBookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function removeTagFromBookmark(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const bookmarkId = validateBookmarkId(req);
    const tagId = validateTagId(req);
    const updatedBookmark = await TagService.removeTagFromBookmark(bookmarkId, tagId);
    res.status(200).json({ data: updatedBookmark });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  replaceTag,
  deleteTag,
  getTagsForBookmark,
  addTagToBookmark,
  removeTagFromBookmark,
};
