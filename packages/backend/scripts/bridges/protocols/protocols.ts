import type { Chain } from '../chains'
import type { Asset } from '../types/Asset'
import type { Message } from '../types/Message'
import type { TransactionWithLogs } from '../types/TransactionWithLogs'
import { ACROSS } from './decoders/across'
import { AGGLAYER } from './decoders/agglayer'
import { CCTPV1 } from './decoders/cctpv1'
import { CCTPV2 } from './decoders/cctpv2'
import { LAYERZEROV1 } from './decoders/layerzerov1'
import { LAYERZEROV2 } from './decoders/layerzerov2'
import { STARGATE } from './decoders/stargate'

export interface Protocol {
  name: string
  decoder: (
    chain: Chain,
    transaction: TransactionWithLogs,
  ) => Partial<{ message: Message; asset: Asset }> | undefined
}

export const PROTOCOLS: Protocol[] = [
  ACROSS,
  CCTPV1,
  CCTPV2,
  LAYERZEROV1,
  LAYERZEROV2,
  AGGLAYER,
  STARGATE,
]
