import type { UpdateMessage } from '../../kysely/generated/types'

export const selectUpdateMessage = [
  'projectName',
  'chain',
  'blockNumber',
  'timestamp',
  'message',
] as const satisfies (keyof UpdateMessage)[]
