import type { Blob } from '../../kysely/generated/types'

export const selectBlob = [
  'id',
  'blockNumber',
  'timestamp',
  'daLayer',
  'from',
  'to',
  'topics',
  'size',
] as const satisfies (keyof Blob)[]
