import { z } from 'zod'

export const sessionSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string(),
})

export type Session = z.infer<typeof sessionSchema>
