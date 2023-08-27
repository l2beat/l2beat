import { strictBoolean, stringAsObject } from '@l2beat/shared-pure'
import { z } from 'zod'

import { TopBarVariantData } from './types'

const LOCAL_STORAGE_PREFIX = 'l2beat'

const LocalStorageKeySchemas = {
  theme: z.enum(['light', 'dark']),
  'l2-warsaw-floating-banner-closed': strictBoolean,
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

    const result = keySchema.safeParse(value)
    if (!result.success) {
      return undefined
    }
    return result.data
  },
}
