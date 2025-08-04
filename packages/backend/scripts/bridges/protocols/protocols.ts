import type { RpcClient } from '@l2beat/shared'
import type { Chain } from '../chains'
import type { Asset } from '../types/Asset'
import type { DecoderInput } from '../types/DecoderInput'
import type { Message } from '../types/Message'
import { ACROSS } from './decoders/across'
import { AGGLAYER } from './decoders/agglayer'
import { CCTPV1 } from './decoders/cctpv1'
import { CCTPV2 } from './decoders/cctpv2'
import { DEBRIDGE } from './decoders/debridge'
import { HYPERLANE } from './decoders/hyperlane'
import { LAYERZEROV1 } from './decoders/layerzerov1'
import { LAYERZEROV2 } from './decoders/layerzerov2'
import { STARGATE } from './decoders/stargate'
import { WORMHOLE_CCTP } from './decoders/wormhole-cctp'
import { WORMHOLE_PORTAL } from './decoders/wormhole-portal'

export interface Protocol {
  name: string
  decoder: (
    chain: Chain,
    log: DecoderInput,
    rpc?: RpcClient,
  ) => Promise<Message | Asset | undefined> | Message | Asset | undefined
}

export const PROTOCOLS: Protocol[] = [
  ACROSS,
  CCTPV1,
  CCTPV2,
  LAYERZEROV1,
  LAYERZEROV2,
  AGGLAYER,
  STARGATE,
  HYPERLANE,
  DEBRIDGE,
  WORMHOLE_PORTAL,
  WORMHOLE_CCTP,
]
