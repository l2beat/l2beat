import type { RpcClient } from '@l2beat/shared'
import type { Log } from 'viem'
import type { Chain } from '../chains'
import type { Receive } from '../types/Receive'
import type { Send } from '../types/Send'
import { ACROSS } from './decoders/across'
import { CCTPV1 } from './decoders/cctpv1'

interface Protocol {
  name: string
  decoder: (
    chain: Chain & { rpc: RpcClient },
    log: Log,
  ) => Promise<Send | Receive | undefined> | (Send | Receive | undefined)
}

export const PROTOCOLS: Protocol[] = [ACROSS, CCTPV1]
