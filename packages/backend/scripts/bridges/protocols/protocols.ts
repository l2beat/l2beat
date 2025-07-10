import type { Log } from 'viem'
import type { BridgeTransfer } from '../types/BridgeTransfer'
import { ACROSS_V2 } from './decoders/acrossv2'
import { ACROSS_V3 } from './decoders/acrossv3'

interface Protocol {
  name: string
  decoder: (chainName: string, log: Log) => BridgeTransfer | undefined
}

export const PROTOCOLS: Protocol[] = [ACROSS_V2, ACROSS_V3]
