import { z } from "zod";

// Hey team this is just an exmaple
export const createUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});
