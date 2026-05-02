const zod = require("zod");

// Reusable field definitions
const id = zod.string().uuid();
const name = zod
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");
const email = zod.string().email();

// Schemas
const UserSchema = zod.object({ id, name, email });

const CreateUserSchema = zod.object({ name, email });

const UpdateUserSchema = zod.object({
  name: name.optional(),
  email: email.optional(),
});

module.exports = {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
};
