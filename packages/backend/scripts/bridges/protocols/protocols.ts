import type { Log } from 'viem'
import type { Chain } from '../chains'
import type { Receive } from '../types/Receive'
import type { Send } from '../types/Send'
import { ACROSS } from './decoders/across'

interface Protocol {
  name: string
  decoder: (chain: Chain, log: Log) => Send | Receive | undefined
}

export const PROTOCOLS: Protocol[] = [ACROSS]
