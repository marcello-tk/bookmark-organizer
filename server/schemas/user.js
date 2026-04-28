const zod = require("zod");

const UserSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string(),
  email: zod.string().email(),
});

const CreateUserSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: zod.string().email(),
});

const UpdateUserSchema = zod.object({
  name: zod.string().optional(),
  email: zod.string().email().optional(),
});

const zodError = zod.ZodError;

module.exports = {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  zodError,
};
