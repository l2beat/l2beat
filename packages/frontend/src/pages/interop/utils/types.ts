import type { KnownInteropBridgeType } from '@l2beat/shared-pure'

export interface InteropSelection {
  from: string[]
  to: string[]
}

export interface AnchoredInteropSelection extends InteropSelection {
  anchorChain?: string
}

export type TransferType = Extract<
  KnownInteropBridgeType,
  'lockAndMint' | 'burnAndMint' | 'nonMinting'
>
