import { z } from 'zod'

export const sessionSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
})

export type Session = z.infer<typeof sessionSchema>
