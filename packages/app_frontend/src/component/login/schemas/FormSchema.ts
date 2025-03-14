//import { ZodTypeAny, z } from 'zod';
import { z } from 'zod';
import { s_loginId, s_password } from '../../../../../shared/src/schema/00_master';

export const formSchema = z.object({
  loginId : s_loginId(),
  password: s_password(),
});

export type FormSchema = z.infer<typeof formSchema>;