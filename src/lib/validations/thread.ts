import * as z from 'zod'

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3).max(30),
  accountId: z.string().nonempty()
})
