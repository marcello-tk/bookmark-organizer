const express = require("express");
const { CreateUserSchema, zodError } = require("./schemas/user");
const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// --- User routes

const users = [];

class ErrorWithStatus extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  try {
    if (!req.body) {
      throw new ErrorWithStatus("Request body is required", 400);
    }
    const { name, email } = req.body;
    CreateUserSchema.parse({ name, email });

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
    };

    if (users.some((u) => u.email === email)) {
      throw new ErrorWithStatus("Email already exists", 400);
    }
    users.push(user);

    res.status(201).json({ data: user });
  } catch (error) {
    let errorObj = new ErrorWithStatus("An error occurred", 400);
    if (error instanceof zodError) {
      errorObj = new ErrorWithStatus(error.issues.map(issue => issue.message).join(", "), 400);
    } else if (error instanceof ErrorWithStatus) {
      errorObj = new ErrorWithStatus(error.message, error.status);
    } else {
      // Don't expose internal error details to the client, but log it for debugging
      console.error(error);
      errorObj = new ErrorWithStatus("An internal error occurred", 500);
    }
    res.status(errorObj.status).json({ error: errorObj.message });
  }
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

// ---

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
