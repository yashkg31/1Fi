import { z } from 'zod';

const userSchema = z.object({
  name: z.string().trim().min(3).max(18),
  password: z.string().trim().min(6).max(12),
  mobile: z.string().trim().min(10).max(10),
  email: z.string().trim().email(),
});

export default userSchema;
