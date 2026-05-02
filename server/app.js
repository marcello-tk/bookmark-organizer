const express = require("express");
const cors = require("cors");

const { CreateBookmarkSchema, UpdateBookmarkSchema } = require("./schemas/bookmark");
const { CreateTagSchema, UpdateTagSchema } = require("./schemas/tag");
const {
  getAllUsers,
  getUserById,
  updateUser,
  replaceUser,
  deleteUser,
  createUser,
} = require("./routes/UserRoutes");
const {
  getAllBookmarks,
  createBookmark,
  getBookmarkById,
  updateBookmark,
  replaceBookmark,
  deleteBookmark,
} = require("./routes/BookmarkRoutes");
const {
  getAllTags,
  createTag,
  getTagById,
  replaceTag,
  updateTag,
  deleteTag,
  getTagsForBookmark,
  addTagToBookmark,
  removeTagFromBookmark,
} = require("./routes/TagRoutes");

const app = express();
const port = process.env.PORT || 3001;

// Default config:
/*
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
*/
app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// --- User routes

app.get("/users", getAllUsers);
app.get("/users/:userId", getUserById);
app.post("/users", createUser);
app.put("/users/:userId", replaceUser);
app.patch("/users/:userId", updateUser);
app.delete("/users/:userId", deleteUser);

// --- Bookmark routes

app.get("/users/:userId/bookmarks", getAllBookmarks);
app.post("/users/:userId/bookmarks", createBookmark);
app.get("/users/:userId/bookmarks/:bookmarkId", getBookmarkById);
app.put("/users/:userId/bookmarks/:bookmarkId", replaceBookmark);
app.patch("/users/:userId/bookmarks/:bookmarkId", updateBookmark);
app.delete("/users/:userId/bookmarks/:bookmarkId", deleteBookmark);

// --- Tag routes

app.get("/users/:userId/tags", getAllTags);
app.post("/users/:userId/tags", createTag);
app.get("/users/:userId/tags/:tagId", getTagById);
app.put("/users/:userId/tags/:tagId", replaceTag);
app.patch("/users/:userId/tags/:tagId", updateTag);
app.delete("/users/:userId/tags/:tagId", deleteTag);

// --- Tags and bookmarks association routes

app.get("/users/:userId/bookmarks/:bookmarkId/tags", getTagsForBookmark);
app.post("/users/:userId/bookmarks/:bookmarkId/tags/:tagId", addTagToBookmark);
app.delete("/users/:userId/bookmarks/:bookmarkId/tags/:tagId", removeTagFromBookmark);

// ---

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
