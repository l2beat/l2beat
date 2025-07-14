import type { RpcClient } from '@l2beat/shared'
import type { Log } from 'viem'
import type { Chain } from '../chains'
import type { Receive } from '../types/Receive'
import type { Send } from '../types/Send'
import { ACROSS } from './decoders/across'
import { LAYER_ZERO } from './decoders/layerzero'

interface Protocol {
  name: string
  decoder: (
    chain: Chain & { rpc: RpcClient },
    log: Log,
  ) => (Send | Receive | undefined) | Promise<Send | Receive | undefined>
}

export const PROTOCOLS: Protocol[] = [ACROSS, LAYER_ZERO]
