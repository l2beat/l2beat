import { z } from 'zod'

export const UrlPath = z
  .string()
  .refine((data) => /^(https?:\/\/[^\s\/$.?#].[^\s]*)$/.test(data), {
    message: 'Invalid URL',
  })
