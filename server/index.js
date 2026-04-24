const express = require("express");
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// --- User routes

app.get("/users", (req, res) => {
  res.send({ message: "Get all users endpoint" });
});

app.post("/users", (req, res) => {
  res.send({ message: "Create user endpoint" });
});

app.get("/users/:userId", (req, res) => {
  res.send({ message: `Get user with id ${req.params.userId}` });
});

app.put("/users/:userId", (req, res) => {
  res.send({ message: `Update user with id ${req.params.userId}` });
});

app.delete("/users/:userId", (req, res) => {
  res.send({ message: `Delete user with id ${req.params.userId}` });
});

// --- Bookmark routes

app.get("/users/:userId/bookmarks", (req, res) => {
  res.send({ message: `Get all bookmarks for user ${req.params.userId}` });
});

app.post("/users/:userId/bookmarks", (req, res) => {
  res.send({ message: `Create bookmark for user ${req.params.userId}` });
});

app.get("/users/:userId/bookmarks/:bookmarkId", (req, res) => {
  res.send({ message: `Get bookmark with id ${req.params.bookmarkId} for user ${req.params.userId}` });
});

app.put("/users/:userId/bookmarks/:bookmarkId", (req, res) => {
  res.send({ message: `Update bookmark with id ${req.params.bookmarkId} for user ${req.params.userId}` });
});

app.delete("/users/:userId/bookmarks/:bookmarkId", (req, res) => {
  res.send({ message: `Delete bookmark with id ${req.params.bookmarkId} for user ${req.params.userId}` });
});

// --- Tag routes

app.get("/users/:userId/tags", (req, res) => {
  res.send({ message: `Get all tags for user ${req.params.userId}` });
});

app.post("/users/:userId/tags", (req, res) => {
  res.send({ message: `Create tag for user ${req.params.userId}` });
});

app.get("/users/:userId/tags/:tagId", (req, res) => {
  res.send({ message: `Get tag with id ${req.params.tagId} for user ${req.params.userId}` });
});

app.put("/users/:userId/tags/:tagId", (req, res) => {
  res.send({ message: `Update tag with id ${req.params.tagId} for user ${req.params.userId}` });
});

app.delete("/users/:userId/tags/:tagId", (req, res) => {
  res.send({ message: `Delete tag with id ${req.params.tagId} for user ${req.params.userId}` });
});

app.get("/users/:userId/bookmarks/:bookmarkId/tags", (req, res) => {
  res.send({ message: `Get all tags for bookmark ${req.params.bookmarkId} of user ${req.params.userId}` });
});

app.post("/users/:userId/bookmarks/:bookmarkId/tags", (req, res) => {
  res.send({ message: `Create tag for bookmark ${req.params.bookmarkId} of user ${req.params.userId}` });
});

app.delete("/users/:userId/bookmarks/:bookmarkId/tags/:tagId", (req, res) => {
  res.send({ message: `Delete tag with id ${req.params.tagId} from bookmark ${req.params.bookmarkId} of user ${req.params.userId}` });
});
