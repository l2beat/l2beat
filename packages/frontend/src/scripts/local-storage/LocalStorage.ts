import { z } from 'zod'

import { TopBarVariantData } from './types'

const LOCAL_STORAGE_PREFIX = 'l2beat'

const strictBoolean = z.enum(['true', 'false']).transform((x) => x === 'true')
const stringAsObject = <T extends z.AnyZodObject>(schema: T) =>
  z.string().transform((x) => schema.parse(JSON.parse(x)) as z.infer<T>)

const LocalStorageKeySchemas = {
  theme: z.enum(['light', 'dark']),
  'l2-warsaw-floating-banner': strictBoolean,
  'combined-bridges-checked': strictBoolean,
  'rollups-only-checked': strictBoolean,
  'top-bar-variant-data': stringAsObject(TopBarVariantData),
} as const

type LocalStorageKeys = keyof typeof LocalStorageKeySchemas
type LocalStorageKeyType<T extends LocalStorageKeys> = z.infer<
  (typeof LocalStorageKeySchemas)[T]
>

export const LocalStorage = {
  setItem: <T extends LocalStorageKeys>(
    key: T,
    value: LocalStorageKeyType<T>,
  ) => {
    localStorage.setItem(
      `${LOCAL_STORAGE_PREFIX}-${key}`,
      JSON.stringify(value),
    )
  },

  getItem: <T extends LocalStorageKeys>(
    key: T,
  ): LocalStorageKeyType<T> | undefined => {
    const keySchema = LocalStorageKeySchemas[key]
    const value = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${key}`)
    if (value === null) return undefined

    const result = keySchema.parse(value)
    return result
  },
}
