//import { ZodTypeAny, z } from 'zod';
import { z } from 'zod';
import { s_loginId, s_password } from '../../../../common/schema/00_master';

export const formSchema = z.object({
  username: s_password(),
});

export type FormSchema = z.infer<typeof formSchema>;