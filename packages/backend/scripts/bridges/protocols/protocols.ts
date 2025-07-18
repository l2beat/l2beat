import type { Chain } from '../chains'
import type { Message } from '../types/Message'
import type { TransactionWithViemLogs } from '../types/TransactionWithViemLogs'
import { ACROSS } from './decoders/across'
import { CCTPV1 } from './decoders/cctpv1'
import { CCTPV2 } from './decoders/cctpv2'
import { LAYERZEROV2 } from './decoders/layerzerov2'

interface Protocol {
  name: string
  decoder: (
    chain: Chain,
    transaction: TransactionWithViemLogs,
  ) => Message | undefined
}

export const PROTOCOLS: Protocol[] = [ACROSS, CCTPV1, CCTPV2, LAYERZEROV2]
