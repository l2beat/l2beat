import type { Chain } from '../chains'
import type { Asset } from '../types/Asset'
import type { Message } from '../types/Message'
import type { DecoderInput } from '../types/TransactionWithLogs'
import { DEBRIDGE } from './decoders/debridge'

export interface Protocol {
  name: string
  decoder: (chain: Chain, log: DecoderInput) => Message | Asset | undefined
}

export const PROTOCOLS: Protocol[] = [
  // ACROSS,
  // CCTPV1,
  // CCTPV2,
  // LAYERZEROV1,
  // LAYERZEROV2,
  // AGGLAYER,
  // STARGATE,
  // HYPERLANE,
  DEBRIDGE,
]
