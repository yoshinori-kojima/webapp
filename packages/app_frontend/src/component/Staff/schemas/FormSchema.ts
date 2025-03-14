//import { ZodTypeAny, z } from 'zod';
import { z } from 'zod';
import { s_divisionId, s_divisionName, s_loginId, s_userName } from '../../../../common/schema/00_master';

export const formSchema = z.object({
  loginId   : s_loginId(),
  userName : s_userName(),
});

export type FormSchema = z.infer<typeof formSchema>;