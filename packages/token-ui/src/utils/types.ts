import type { v } from '@l2beat/validate'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type InferFormSchema<T> = Prettify<{
  [K in keyof T]: v.infer<T[K]>
}>
