import { TokenBridgeRecord } from './entity'

export const selectTokenBridge = [
  'id',
  'sourceTokenId',
  'targetTokenId',
  'externalBridgeId',
  'createdAt',
  'updatedAt',
] as const satisfies (keyof TokenBridgeRecord)[]
