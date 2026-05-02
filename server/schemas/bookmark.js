const zod = require("zod");

const id = zod.string().uuid();
const userId = zod.string().uuid();
const title = zod
  .string()
  .min(1, "Title is required")
  .max(200, "Title must be less than 200 characters");
const url = zod.string().url("Invalid URL format");
const description = zod
  .string()
  .max(500, "Description must be less than 500 characters")
  .optional();

const BookmarkSchema = zod.object({
  id,
  userId,
  title,
  url,
  description,
});

const CreateBookmarkSchema = zod.object({
  title,
  userId,
  url,
  description,
});

const UpdateBookmarkSchema = zod.object({
  title: title.optional(),
  url: url.optional(),
  description: description.optional(),
});

module.exports = {
  BookmarkSchema,
  CreateBookmarkSchema,
  UpdateBookmarkSchema,
};
