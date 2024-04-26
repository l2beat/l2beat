import { z } from 'zod'

import { SavedChartState, TopBarVariantData } from './types'

export const strictBoolean = z
  .enum(['true', 'false'])
  .transform((x) => x === 'true')

export const stringAsObjectOrUndefined = <
  T extends z.AnyZodObject | z.ZodRecord,
>(
  schema: T,
) =>
  z.string().transform((x) => {
    const result = schema.safeParse(JSON.parse(x))
    if (!result.success) return undefined
    return result.data as z.infer<T>
  })

const LOCAL_STORAGE_PREFIX = 'l2beat'

const LocalStorageKeySchemas = {
  theme: z.enum(['light', 'dark']),
  'gg-20-floating-banner-closed': strictBoolean,
  'combined-bridges-checked': strictBoolean,
  'rollups-only-checked': strictBoolean,
  'top-bar-variant-data': stringAsObjectOrUndefined(TopBarVariantData),
  'chart-settings': stringAsObjectOrUndefined(SavedChartState),
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
    const stringifiedValue =
      typeof value === 'string' ? value : JSON.stringify(value)

    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${key}`, stringifiedValue)
  },

  getItem: <T extends LocalStorageKeys>(
    key: T,
  ): LocalStorageKeyType<T> | undefined => {
    const keySchema = LocalStorageKeySchemas[key]
    const value = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${key}`)
    if (value === null) return undefined

    const result = keySchema.safeParse(value)
    if (!result.success) {
      return undefined
    }
    return result.data
  },
}
