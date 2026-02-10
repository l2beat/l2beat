import type { AbstractTokenRecord } from '@l2beat/database'
import { Address32, assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { findParsedAround } from '../hyperlane-hwr'
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
  burned?: boolean
}>('layerzero-v2.PacketOFTSent', { direction: 'outgoing' })

const OFTReceivedPacketDelivered = createInteropEventType<{
  $srcChain: string
  guid: string
  amountReceivedLD: bigint
  oappAddress: Address32
  dstTokenAddress?: Address32
  dstAmount?: bigint
  minted?: boolean
}>('layerzero-v2.PacketOFTDelivered', { direction: 'incoming' })

export class LayerZeroV2OFTsPlugin implements InteropPlugin {
  readonly name = 'layerzero-v2-ofts'

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

      // try preceding log but fallback to any log in the same tx
      let packetSentLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 1,
      )
      if (!packetSentLog) return
      let packetSent = parsePacketSent(packetSentLog, [network.endpointV2])
      if (!packetSent)
        packetSentLog = input.txLogs.find((l) => parsePacketSent(l, null))
      if (!packetSentLog) return
      packetSent = parsePacketSent(packetSentLog, [network.endpointV2])
      if (!packetSent) return
      const packet = decodePacket(packetSent.encodedPayload)
      if (!packet) return
      const guid = createLayerZeroGuid(
        packet.header.nonce,
        packet.header.srcEid,
        packet.header.sender,
        packet.header.dstEid,
        packet.header.receiver,
      )
      const $dstChain = findChain(networks, (x) => x.eid, packet.header.dstEid)

      const matchingTransferData = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== normalized.amountSentLD) return
          return {
            address: Address32.from(log.address),
            burned: Address32.from(transfer.to) === Address32.ZERO,
          }
        },
      )

      return [
        OFTSentPacketSent.create(input, {
          $dstChain,
          guid,
          amountSentLD: normalized.amountSentLD,
          amountReceivedLD: normalized.amountReceivedLD,
          oappAddress: Address32.from(input.log.address),
          srcTokenAddress: matchingTransferData?.address,
          srcAmount: normalized.amountSentLD,
          burned: matchingTransferData?.burned,
        }),
      ]
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

          const matchingTransferData = findParsedAround(
            input.txLogs,
            // biome-ignore lint/style/noNonNullAssertion: It's there
            input.log.logIndex!,
            (log, _index) => {
              const transfer = parseTransfer(log, null)
              if (!transfer) return
              // compare amount to not match a rogue Transfer event
              if (transfer.value !== oftReceived.amountReceivedLD) return
              return {
                address: Address32.from(log.address),
                minted: Address32.from(transfer.from) === Address32.ZERO,
              }
            },
          )

          return [
            OFTReceivedPacketDelivered.create(input, {
              $srcChain,
              guid,
              amountReceivedLD: oftReceived.amountReceivedLD,
              oappAddress: Address32.from(input.log.address),
              dstTokenAddress: matchingTransferData?.address,
              dstAmount: oftReceived.amountReceivedLD,
              minted: matchingTransferData?.minted,
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
    deployedToAbstractMap: Map<ChainSpecificAddress, AbstractTokenRecord>,
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

    const srcAbstractToken = deployedToAbstractMap.get(
      ChainSpecificAddress.fromLong(
        Address32.cropToEthereumAddress(
          oftSentPacketSent.args.srcTokenAddress ?? Address32.ZERO,
        ),
        oftSentPacketSent.ctx.chain,
      ),
    )
    const dstAbstractToken = deployedToAbstractMap.get(
      ChainSpecificAddress.fromLong(
        Address32.cropToEthereumAddress(
          oftReceivedPacketDelivered.args.dstTokenAddress ?? Address32.ZERO,
        ),
        packetDelivered.ctx.chain,
      ),
    )

    return [
      Result.Message('layerzero-v2.Message', {
        app: 'oftv2',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
      Result.Transfer('oftv2.Transfer', {
        srcEvent: oftSentPacketSent,
        srcAmount: oftSentPacketSent.args.amountSentLD, // same as oftSentPacketSent.args.srcAmount
        srcTokenAddress: oftSentPacketSent.args.srcTokenAddress,
        dstEvent: oftReceivedPacketDelivered,
        dstAmount: oftReceivedPacketDelivered.args.amountReceivedLD, // same as oftReceivedPacketDelivered.args.dstAmount
        dstTokenAddress: oftReceivedPacketDelivered.args.dstTokenAddress,
        srcWasBurned: oftSentPacketSent.args.burned,
        dstWasMinted: oftReceivedPacketDelivered.args.minted,
        bridgeType:
          srcAbstractToken?.issuer !== dstAbstractToken?.issuer
            ? 'lockAndMint'
            : 'omnichain',
      }),
    ]
  }
}
