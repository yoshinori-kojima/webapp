//import { ZodTypeAny, z } from 'zod';
import { z } from 'zod';
import { s_divisionId, s_divisionName } from '../../../../common/schema/00_master';

export const formSchema = z.object({
  divisionId   : s_divisionId(),
  divisionName : s_divisionName(),
});

export type FormSchema = z.infer<typeof formSchema>;