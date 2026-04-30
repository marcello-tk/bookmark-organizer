const express = require("express");
const { CreateUserSchema, zodError, UpdateUserSchema } = require("./schemas/user");
const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// --- User routes

function handleError(res, error) {
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
  return errorObj;
}

const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
];

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
    const errorObj = handleError(res, error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
});

app.get("/users/:userId", (req, res) => {
  try {
    if (!req.params?.userId) {
      throw new ErrorWithStatus("User ID is required", 400);
    }
    const user = users.find(u => u.id === req.params.userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    res.status(200).json({ data: user });
  } catch (error) {
    const errorObj = handleError(res, error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
});

app.put("/users/:userId", (req, res) => {
  try {
    if (!req.params?.userId) {
      throw new ErrorWithStatus("User ID is required", 400);
    }
    const userIndex = users.findIndex(u => u.id === req.params.userId);
    if (userIndex === -1) {
      throw new ErrorWithStatus("User not found", 404);
    }
    if (!req.body) {
      throw new ErrorWithStatus("Request body is required", 400);
    }
    const { name, email } = req.body;
    UpdateUserSchema.parse({ name, email });

    users[userIndex] = {
      ...users[userIndex],
      name: name ?? users[userIndex].name,
      email: email ?? users[userIndex].email,
    };
    res.status(200).json({ data: users[userIndex] });
  } catch (error) {
    const errorObj = handleError(res, error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
});

app.delete("/users/:userId", (req, res) => {
  try {
    if (!req.params?.userId) {
      throw new ErrorWithStatus("User ID is required", 400);
    }
    const userIndex = users.findIndex(u => u.id === req.params.userId);
    if (userIndex === -1) {
      throw new ErrorWithStatus("User not found", 404);
    }
    users.splice(userIndex, 1);
    res.status(204).send();
  } catch (error) {
    const errorObj = handleError(res, error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
});

// --- Bookmark routes

const bookmarks = [
  { id: "1", userId: "1", url: "https://example.com", title: "Example" },
];

app.get("/users/:userId/bookmarks", (req, res) => {
  try {
    if (!req.params?.userId) {
      throw new ErrorWithStatus("User ID is required", 400);
    }
    const user = users.find(u => u.id === req.params.userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }

    const userBookmarks = bookmarks.filter(b => b.userId === req.params.userId);
    res.status(200).json({ data: userBookmarks });
  } catch (error) {
    const errorObj = handleError(res, error);
    res.status(errorObj.status).json({ error: errorObj.message });
  }
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

class ErrorWithStatus extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
