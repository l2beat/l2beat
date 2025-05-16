import type { UpdateMessage } from '../../kysely/generated/types'

export const selectUpdateMessage = [
  'projectId',
  'chain',
  'blockNumber',
  'timestamp',
  'message',
] as const satisfies (keyof UpdateMessage)[]
