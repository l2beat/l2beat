import { EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzero/layerzero-v2.plugin'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// DEPRECATED in favor of the general OFT plugin

const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

export const Usdt0OFTSent = createInteropEventType<{
  guid: string
  amountSentLD: number
  amountReceivedLD: number
  tokenAddress: Address32
}>('usdt0.OFTSent')

export const Usdt0OFTReceived = createInteropEventType<{
  guid: string
  amountReceivedLD: number
  tokenAddress: Address32
}>('usdt0.OFTReceived')

const USDT0_NETWORKS = defineNetworks('usdt0', [
  {
    chain: 'ethereum',
    adapter: EthereumAddress('0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee'), // special case: locking adapter (not relevant for the current decoder)
    tokenAddress: Address32.from('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
  },
  {
    chain: 'arbitrum',
    adapter: EthereumAddress('0x14E4A1B13bf7F943c8ff7C51fb60FA964A298D92'),
    tokenAddress: Address32.from('0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'),
  },
  {
    chain: 'optimism',
    adapter: EthereumAddress('0xF03b4d9AC1D5d1E7c4cEf54C2A313b9fe051A0aD'),
    tokenAddress: Address32.from('0x01bFF41798a0BcF287b996046Ca68b395DbC1071'),
  },
  {
    chain: 'unichain',
    adapter: EthereumAddress('0xc07bE8994D035631c36fb4a89C918CeFB2f03EC3'),
    tokenAddress: Address32.from('0x9151434b16b9763660705744891fA906F660EcC5'),
  },
  {
    chain: 'corn',
    adapter: EthereumAddress('0x3f82943338a8a76c35BFA0c1828aA27fd43a34E4'),
    tokenAddress: Address32.from('0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb'),
  },
  {
    chain: 'xlayer',
    adapter: EthereumAddress('0x94BCCa6bdfd6A61817Ab0E960bFedE4984505554'),
    tokenAddress: Address32.from('0x779Ded0c9e1022225f8E0630b35a9b54bE713736'),
  },
  {
    chain: 'ink',
    adapter: EthereumAddress('0x1cB6De532588fCA4a21B7209DE7C456AF8434A65'),
    tokenAddress: Address32.from('0x0200C29006150606B650577BBE7B6248F58470c1'),
  },
])

export class Usdt0Plugin implements InteropPlugin {
  name = 'usdt0'

  capture(input: LogToCapture) {
    const network = USDT0_NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    const oftSent = parseOFTSent(input.log, [network.adapter])
    if (oftSent) {
      return [
        Usdt0OFTSent.create(input.ctx, {
          guid: oftSent.guid,
          amountSentLD: Number(oftSent.amountSentLD),
          amountReceivedLD: Number(oftSent.amountReceivedLD),
          tokenAddress: network.tokenAddress,
        }),
      ]
    }

    const oftReceived = parseOFTReceived(input.log, [network.adapter])
    if (oftReceived) {
      return [
        Usdt0OFTReceived.create(input.ctx, {
          guid: oftReceived.guid,
          amountReceivedLD: Number(oftReceived.amountReceivedLD),
          tokenAddress: network.tokenAddress,
        }),
      ]
    }
  }

  matchTypes = [Usdt0OFTReceived]
  match(
    oftReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!Usdt0OFTReceived.checkType(oftReceived)) return

    const oftSent = db.find(Usdt0OFTSent, { guid: oftReceived.args.guid })
    if (!oftSent) return

    const packetSent = db.find(PacketSent, { guid: oftReceived.args.guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, {
      guid: oftReceived.args.guid,
    })
    if (!packetDelivered) return

    return [
      Result.Message('layerzero-v2.Message', {
        app: 'usdt0',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
      Result.Transfer('usdt0.Transfer', {
        srcEvent: oftSent,
        srcTokenAddress: oftSent.args.tokenAddress,
        srcAmount: BigInt(oftSent.args.amountSentLD),
        dstEvent: oftReceived,
        dstTokenAddress: oftReceived.args.tokenAddress,
        dstAmount: BigInt(oftReceived.args.amountReceivedLD),
      }),
    ]
  }
}
