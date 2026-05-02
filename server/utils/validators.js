const zod = require("zod");

class ErrorWithStatus extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function handleError(error) {
  let errorObj = new ErrorWithStatus("An error occurred", 400);
  if (error instanceof zod.ZodError) {
    errorObj = new ErrorWithStatus(error.issues.map((issue) => issue.message).join(", "), 400);
  } else if (error instanceof ErrorWithStatus) {
    errorObj = new ErrorWithStatus(error.message, error.status);
  } else {
    // Don't expose internal error details to the client, but log it for debugging
    console.error(error);
    errorObj = new ErrorWithStatus("An internal error occurred", 500);
  }
  return errorObj;
}

function validateUserId(req) {
  if (!req.params?.userId) {
    throw new ErrorWithStatus("User ID is required", 400);
  }
  return req.params.userId;
}

function validateBookmarkId(req) {
  if (!req.params?.bookmarkId) {
    throw new ErrorWithStatus("Bookmark ID is required", 400);
  }
  return req.params.bookmarkId;
}

function validateTagId(req) {
  if (!req.params?.tagId) {
    throw new ErrorWithStatus("Tag ID is required", 400);
  }
  return req.params.tagId;
}

function validateRequestBody(req) {
  if (!req.body) {
    throw new ErrorWithStatus("Request body is required", 400);
  }
  return req.body;
}

module.exports = {
  ErrorWithStatus,
  handleError,
  validateUserId,
  validateBookmarkId,
  validateTagId,
  validateRequestBody,
};
