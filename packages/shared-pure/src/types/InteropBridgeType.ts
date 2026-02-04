import { v } from '@l2beat/validate'

export const InteropBridgeTypeValues = [
  'lockAndMint',
  'nonMinting',
  'omnichain',
  'unknown',
] as const
export const InteropBridgeType = v.enum(InteropBridgeTypeValues)
export type InteropBridgeType = v.infer<typeof InteropBridgeType>

export const KnownInteropBridgeTypeValues = [
  'lockAndMint',
  'nonMinting',
  'omnichain',
] as const
export const KnownInteropBridgeType = v.enum(KnownInteropBridgeTypeValues)
export type KnownInteropBridgeType = v.infer<typeof KnownInteropBridgeType>
