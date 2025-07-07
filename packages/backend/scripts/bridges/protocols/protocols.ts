import type { Log } from 'viem'
import type { BridgeTransfer } from '../types/BridgeTransfer'
import { ACROSS } from './decoders/across'

interface Protocol {
  name: string
  decoder: (chainName: string, log: Log) => BridgeTransfer | undefined
}

export const PROTOCOLS: Protocol[] = [ACROSS]
