/**
 * captures mctp-specific orderfulfilled event
 * matching happens in cctp plugin and a mayan message is produced
 * the transfer is cctp (no mayan transfer)
 */
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropPluginResyncable,
  type LogToCapture,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

// FastMCTP contract address (same on all chains)
const FAST_MCTP = EthereumAddress('0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741')

// Chains where FastMCTP is deployed
const FAST_MCTP_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
]

// Event signatures
const orderFulfilledLog =
  'event OrderFulfilled(uint32 sourceDomain, bytes32 sourceNonce, uint256 amount)'

const parseOrderFulfilled = createEventParser(orderFulfilledLog)

export const OrderFulfilled = createInteropEventType<{
  amount: bigint
  $srcChain: string
}>('mayan-mctp-fast.OrderFulfilled')

export class MayanMctpFastPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-mctp-fast'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const fastMctpAddresses: ChainSpecificAddress[] = []
    for (const chain of FAST_MCTP_CHAINS) {
      try {
        fastMctpAddresses.push(ChainSpecificAddress.fromLong(chain, FAST_MCTP))
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: orderFulfilledLog,
        addresses: fastMctpAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      const $srcChain = findChain(
        wormholeNetworks,
        (x) => x.wormholeChainId,
        Number(orderFulfilled.sourceDomain),
      )
      return [
        OrderFulfilled.create(input, {
          amount: orderFulfilled.amount,
          $srcChain,
        }),
      ]
    }
  }

  // matching and consuming happens in ../cctp/cctp-v2.plugin.ts
}

// not needed since mayan does not transfer
// function decodeOrderPayload(encodedHex: string) {
//   try {
//     const reader = new BinaryReader(encodedHex)
//     const payloadType = reader.readUint8()
//     const destAddr = reader.readBytes(32)
//     const tokenOut = reader.readBytes(32)
//     const amountOutMin = reader.readUint64()
//     const gasDrop = reader.readUint64()
//     const redeemFee = reader.readUint64()
//     const refundFee = reader.readUint64()
//     const deadline = reader.readUint64()
//     const referrerAddr = reader.readBytes(32)
//     const referrerBps = reader.readUint8()
//     return {
//       payloadType,
//       destAddr,
//       tokenOut,
//       amountOutMin,
//       gasDrop,
//       redeemFee,
//       refundFee,
//       deadline,
//       referrerAddr,
//       referrerBps,
//     }
//   } catch {
//     return undefined
//   }
// }
