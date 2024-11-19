import { ExternalBridgeRecord } from './entity'

export const selectExternalBridge = [
  'id',
  'name',
  'type',
  'createdAt',
  'updatedAt',
] as const satisfies (keyof ExternalBridgeRecord)[]
