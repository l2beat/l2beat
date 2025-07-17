import type { Log } from 'viem'
import type { Chain } from '../chains'
import type { Receive } from '../types/Receive'
import type { Send } from '../types/Send'
import { ACROSS } from './decoders/across'
import { CCTPV1 } from './decoders/cctpv1'
import { CCTPV2 } from './decoders/cctpv2'

interface Protocol {
  name: string
  decoder: (
    chain: Chain,
    txLogs: { hash: string; logs: Log[] },
  ) => Promise<Send | Receive | undefined> | (Send | Receive | undefined)
}

export const PROTOCOLS: Protocol[] = [ACROSS, CCTPV1, CCTPV2]
