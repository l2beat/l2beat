import { z } from 'zod'

export const strictBoolean = z
  .enum(['true', 'false'])
  .transform((x) => x === 'true')

export const stringAsObject = <T extends z.AnyZodObject>(schema: T) =>
  z.string().transform((x) => schema.parse(JSON.parse(x)) as z.infer<T>)
