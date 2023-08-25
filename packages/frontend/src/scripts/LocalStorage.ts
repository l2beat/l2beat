import { z } from 'zod'

const LOCAL_STORAGE_PREFIX = 'l2beat'

const LocalStorageKeySchemas = {
  'canonical-bridges-checked': z
    .string()
    .transform((x) => x === 'true')
    .optional(),
  'canonical-bridges-filter': z.string(),
} as const

type LocalStorageKeys = keyof typeof LocalStorageKeySchemas
type LocalStorageKeyType<T extends LocalStorageKeys> = z.infer<
  (typeof LocalStorageKeySchemas)[T]
>

export const LocalStorage = {
  setItem: (key: LocalStorageKeys, value: string) => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${key}`, value)
  },

  getItem: <T extends LocalStorageKeys>(key: T): LocalStorageKeyType<T> => {
    const keySchema = LocalStorageKeySchemas[key]
    const result = keySchema.parse(
      localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${key}`),
    )
    return result as unknown as LocalStorageKeyType<T>
  },
}
