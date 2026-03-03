import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV1Config, CCTPV2Config } from './cctp/cctp.config'
import { getChainFromCctpDomain } from './mayan-forwarder'
import {
  MAYAN_FAST_MCTP,
  MAYAN_FAST_MCTP_CHAINS,
  toChainSpecificAddresses,
} from './mayan-shared'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropPluginResyncable,
  type LogToCapture,
} from './types'

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
    const fastMctpAddresses = toChainSpecificAddresses(
      MAYAN_FAST_MCTP_CHAINS,
      MAYAN_FAST_MCTP,
    )

    return [
      {
        type: 'event',
        signature: orderFulfilledLog,
        addresses: fastMctpAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const cctpNetworks = [
      ...(this.configs.get(CCTPV1Config) ?? []),
      ...(this.configs.get(CCTPV2Config) ?? []),
    ]
    if (cctpNetworks.length === 0) return

    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      const $srcChain = getChainFromCctpDomain(
        cctpNetworks,
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
