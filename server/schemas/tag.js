const zod = require("zod");

const id = zod.string().uuid();
const userId = zod.string().uuid();
const name = zod
  .string()
  .min(1, "Name is required")
  .max(50, "Name must be less than 50 characters");

const TagSchema = zod.object({ id, name, userId });

const CreateTagSchema = zod.object({ name, userId });

const UpdateTagSchema = zod.object({
  name: name.optional(),
});

module.exports = {
  TagSchema,
  CreateTagSchema,
  UpdateTagSchema,
};
