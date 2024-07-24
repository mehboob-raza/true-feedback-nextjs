import { z } from 'zod'


export const verifySchema = z.object({
    code: z.string()
        .length(6, 'Verification code must be exactly 6 characters long')
        .regex(/^\d{6}$/, 'Verification code must be 6 digits long'),
});
