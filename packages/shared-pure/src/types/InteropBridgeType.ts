import { v } from '@l2beat/validate'

export const InteropBridgeTypeValues = [
  'lockAndMint',
  'nonMinting',
  'omnichain',
] as const
export const InteropBridgeType = v.enum(InteropBridgeTypeValues)
export type InteropBridgeType = v.infer<typeof InteropBridgeType>
