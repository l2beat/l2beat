import { Address32, assert } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import { LayerZeroV2Config } from './layerzero.config'
import {
  createLayerZeroGuid,
  decodePacket,
  PacketDelivered,
  PacketSent,
  parsePacketDelivered,
  parsePacketSent,
} from './layerzero-v2.plugin'

export const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
export const parseRareOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountLD)', // found this here: https://etherscan.io/address/0x2b11834ed1feaed4b4b3a86a6f571315e25a884d#events
)
export const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)
const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

const OFTSentPacketSent = createInteropEventType<{
  $dstChain: string
  guid: string
  amountSentLD: bigint
  amountReceivedLD: bigint
  oappAddress: Address32
  srcTokenAddress?: Address32
  srcAmount?: bigint
}>('layerzero-v2.PacketOFTSent')

const OFTReceivedPacketDelivered = createInteropEventType<{
  $srcChain: string
  guid: string
  amountReceivedLD: bigint
  oappAddress: Address32
  dstTokenAddress?: Address32
  dstAmount?: bigint
}>('layerzero-v2.PacketOFTDelivered')

export class LayerZeroV2OFTsPlugin implements InteropPlugin {
  name = 'layerzero-v2-ofts'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const networks = this.configs.get(LayerZeroV2Config)
    if (!networks) return

    const network = networks.find((x) => x.chain === input.chain)
    if (!network) return
    assert(network.endpointV2, 'We capture only chains with endpoints')

    const oftSentRaw =
      parseOFTSent(input.log, null) || parseRareOFTSent(input.log, null)

    if (oftSentRaw) {
      const normalized =
        'amountSentLD' in oftSentRaw && 'amountReceivedLD' in oftSentRaw
          ? {
              amountSentLD: oftSentRaw.amountSentLD,
              amountReceivedLD: oftSentRaw.amountReceivedLD,
            }
          : {
              amountSentLD: oftSentRaw.amountLD,
              amountReceivedLD: oftSentRaw.amountLD, // fallback
            }

      const previousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 1,
      )
      if (previousLog) {
        const packetSent = parsePacketSent(previousLog, [network.endpointV2])
        if (packetSent) {
          const packet = decodePacket(packetSent.encodedPayload)
          if (packet) {
            const guid = createLayerZeroGuid(
              packet.header.nonce,
              packet.header.srcEid,
              packet.header.sender,
              packet.header.dstEid,
              packet.header.receiver,
            )
            const $dstChain = findChain(
              networks,
              (x) => x.eid,
              packet.header.dstEid,
            )

            // Find Transfer event before OFTSent by searching through all preceding logs in the worst case
            let srcTokenAddress: Address32 | undefined
            let srcAmount: bigint | undefined

            for (
              let offset = 1;
              // biome-ignore lint/style/noNonNullAssertion: It's there
              offset <= input.log.logIndex!;
              offset++
            ) {
              const precedingLog = input.txLogs.find(
                // biome-ignore lint/style/noNonNullAssertion: It's there
                (x) => x.logIndex === input.log.logIndex! - offset,
              )
              if (!precedingLog) break

              const transfer = parseTransfer(precedingLog, null)
              if (transfer) {
                srcTokenAddress = Address32.from(precedingLog.address)
                srcAmount = transfer.value
                break
              }
            }

            return [
              OFTSentPacketSent.create(input, {
                $dstChain,
                guid,
                amountSentLD: normalized.amountSentLD,
                amountReceivedLD: normalized.amountReceivedLD,
                oappAddress: Address32.from(input.log.address),
                srcTokenAddress,
                srcAmount,
              }),
            ]
          }
        }
      }
    }

    const oftReceived = parseOFTReceived(input.log, null)
    if (oftReceived) {
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      if (nextLog) {
        const packetDelivered = parsePacketDelivered(nextLog, [
          network.endpointV2,
        ])
        if (packetDelivered) {
          const guid = createLayerZeroGuid(
            packetDelivered.origin.nonce,
            packetDelivered.origin.srcEid,
            packetDelivered.origin.sender,
            network.eid,
            packetDelivered.receiver,
          )
          const $srcChain = findChain(
            networks,
            (x) => x.eid,
            packetDelivered.origin.srcEid,
          )
          // use erc20 transfer event instead (fragile because it might not be 1 log before)
          const previousLog = input.txLogs.find(
            // biome-ignore lint/style/noNonNullAssertion: It's there
            (x) => x.logIndex === input.log.logIndex! - 1,
          )
          const transfer = previousLog && parseTransfer(previousLog, null)
          return [
            OFTReceivedPacketDelivered.create(input, {
              $srcChain,
              guid,
              amountReceivedLD: oftReceived.amountReceivedLD,
              // TODO: OFT log emitter is not always the token contract (needs effects)
              oappAddress: Address32.from(input.log.address),
              dstTokenAddress: previousLog
                ? Address32.from(previousLog.address)
                : undefined,
              dstAmount: transfer?.value ?? undefined,
            }),
          ]
        }
      }
    }
  }

  matchTypes = [OFTReceivedPacketDelivered]
  match(
    oftReceivedPacketDelivered: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OFTReceivedPacketDelivered.checkType(oftReceivedPacketDelivered))
      return

    const guid = oftReceivedPacketDelivered.args.guid

    const oftSentPacketSent = db.find(OFTSentPacketSent, { guid })
    if (!oftSentPacketSent) return

    const packetSent = db.find(PacketSent, { guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, { guid })
    if (!packetDelivered) return

    return [
      Result.Message('layerzero-v2.Message', {
        app: 'oftv2',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
      Result.Transfer('oftv2.Transfer', {
        srcEvent: oftSentPacketSent,
        srcAmount: oftSentPacketSent.args.amountSentLD, // we also have oftSentPacketSent.args.srcAmount
        srcTokenAddress: oftSentPacketSent.args.srcTokenAddress,
        dstEvent: oftReceivedPacketDelivered,
        dstAmount: oftReceivedPacketDelivered.args.amountReceivedLD, // we also have oftReceivedPacketDelivered.args.dstAmount
        dstTokenAddress: oftReceivedPacketDelivered.args.dstTokenAddress,
      }),
    ]
  }
}
