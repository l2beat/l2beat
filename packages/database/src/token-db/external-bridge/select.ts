import { ExternalBridgeRecord } from './entity'

export const selectExternalBridge = [
  'id',
  'name',
  'managedBy',
  'type',
  'createdAt',
  'updatedAt',
] as const satisfies (keyof ExternalBridgeRecord)[]
