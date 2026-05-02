const UserService = require("../services/UserService");
const {
  handleError,
  ErrorWithStatus,
  validateRequestBody,
  validateUserId,
} = require("../utils/validators");

async function getAllUsers(req, res) {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function getUserById(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    res.status(200).json({ data: user });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function createUser(req, res) {
  try {
    const body = validateRequestBody(req);
    const { name, email } = body;
    const user = await UserService.createUser({ name, email });
    res.status(201).json({ data: user });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function updateUser(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const body = validateRequestBody(req);
    const { name, email } = body;
    const updatedUser = await UserService.updateUser(userId, { name, email });
    if (!updatedUser) {
      throw new ErrorWithStatus("User not found", 404);
    }
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function replaceUser(req, res) {
  try {
    const userId = validateUserId(req);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    const body = validateRequestBody(req);
    const { name, email } = body;
    const updatedUser = await UserService.replaceUser(userId, { name, email });
    if (!updatedUser) {
      throw new ErrorWithStatus("User not found", 404);
    }
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = validateUserId(req);
    const deletedUser = await UserService.deleteUser(userId);
    if (!deletedUser) {
      throw new ErrorWithStatus("User not found", 404);
    }
    res.status(204).send();
  } catch (error) {
    const errorObj = handleError(error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  replaceUser,
  deleteUser,
};
