import type { Notification } from '../../kysely/generated/types'

export const selectNotification = [
  'id',
  'channel',
  'type',
  'relatedEntityId',
  'timestamp',
] as const satisfies (keyof Notification)[]
