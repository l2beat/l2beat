import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  type InteropPlugin,
  type LogToCapture,
} from './types'

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

export const WORMHOLE_NETWORKS = defineNetworks('wormhole', [
  { wormholeChainId: 2, chain: 'ethereum' },
  // { wormholeChainId: 1, chain: 'solana' },
  // { wormholeChainId: 8, chain: 'algorand' },
  // { wormholeChainId: 22, chain: 'aptos' },
  { wormholeChainId: 23, chain: 'arbitrum' },
  { wormholeChainId: 6, chain: 'avalanche' },
  { wormholeChainId: 30, chain: 'base' },
  // { wormholeChainId: 39, chain: 'berachain' },
  { wormholeChainId: 4, chain: 'bsc' },
  // { wormholeChainId: 4004, chain: 'celestia' },
  { wormholeChainId: 14, chain: 'celo' },
  // { wormholeChainId: 53, chain: 'converge' },
  // { wormholeChainId: 4000, chain: 'cosmosHub' },
  // { wormholeChainId: 4007, chain: 'dymension' },
  // { wormholeChainId: 4001, chain: 'ethmos' },
  // { wormholeChainId: 10, chain: 'fantom' },
  // { wormholeChainId: 51, chain: 'fogo' },
  // { wormholeChainId: 47, chain: 'hyperEVM' },
  // { wormholeChainId: 19, chain: 'injective' },
  { wormholeChainId: 46, chain: 'ink' },
  // { wormholeChainId: 13, chain: 'kaia' },
  // { wormholeChainId: 4002, chain: 'kujira' },
  { wormholeChainId: 38, chain: 'linea' },
  { wormholeChainId: 35, chain: 'mantle' },
  // { wormholeChainId: 50, chain: 'mezo' },
  // { wormholeChainId: 48, chain: 'monad' },
  // { wormholeChainId: 16, chain: 'moonbeam' },
  // { wormholeChainId: 15, chain: 'near' },
  // { wormholeChainId: 4003, chain: 'neutron' },
  // { wormholeChainId: 4009, chain: 'noble' },
  { wormholeChainId: 24, chain: 'optimism' },
  // { wormholeChainId: 20, chain: 'osmosis' },
  // { wormholeChainId: 55, chain: 'plume' },
  { wormholeChainId: 5, chain: 'polygonpos' },
  { wormholeChainId: 34, chain: 'scroll' },
  // { wormholeChainId: 4006, chain: 'seda' },
  // { wormholeChainId: 32, chain: 'sei' },
  // { wormholeChainId: 40, chain: 'seievm' },
  // { wormholeChainId: 52, chain: 'sonic' },
  // { wormholeChainId: 4005, chain: 'stargaze' },
  // { wormholeChainId: 21, chain: 'sui' },
  { wormholeChainId: 44, chain: 'unichain' },
  { wormholeChainId: 45, chain: 'worldchain' },
  { wormholeChainId: 37, chain: 'xlayer' },
  // { wormholeChainId: 57, chain: 'xrpl-evm' },
])

export const LogMessagePublished = createInteropEventType<{
  payload: `0x${string}`
  sequence: string
  wormholeChainId: number
  sender: EthereumAddress
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements InteropPlugin {
  name = 'wormhole'

  capture(input: LogToCapture) {
    const parsed = parseLogMessagePublished(input.log, null)
    if (!parsed) return

    const network = WORMHOLE_NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) {
      return
    }

    return [
      LogMessagePublished.create(input.ctx, {
        payload: parsed.payload,
        sequence: parsed.sequence.toString(),
        wormholeChainId: network.wormholeChainId,
        sender: EthereumAddress(parsed.sender),
      }),
    ]
  }
  // no matching because wormhole matches by source emitter address + sequence, of which the destination event depends on the app layer
}
