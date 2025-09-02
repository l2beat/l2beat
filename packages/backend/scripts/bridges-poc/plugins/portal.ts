import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'
import {
  createEventParser,
  createEventType,
  type Event,
  type EventDb,
  type LogToDecode,
  type MatchResult,
  type Plugin,
} from './types'
import { LogMessagePublished } from './wormhole'

const ABI = parseAbi([
  'function parseTransfer(bytes memory encoded) public pure returns ((uint8 payloadID,uint256 amount,bytes32 tokenAddress,uint16 tokenChain,bytes32 to,uint16 toChain,uint256 fee) memory transfer)',
])

const NETWORKS = [
  {
    wormholeChainId: 2,
    chain: 'ethereum',
    tokenBridge: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'),
  },
  {
    wormholeChainId: 23,
    chain: 'arbitrum',
    tokenBridge: EthereumAddress('0x0b2402144Bb366A632D14B83F244D2e0e21bD39c'),
  },
  {
    wormholeChainId: 30,
    chain: 'base',
    tokenBridge: EthereumAddress('0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627'),
  },
]

const parseTransferRedeemed = createEventParser(
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress, uint64 indexed sequence)',
)

export const TransferRedeemed = createEventType<{
  sequence: string
  emitterWormholeChainId: number
  emitterAddress: EthereumAddress
}>('portal.TransferRedeemed')

export class PortalPlugin implements Plugin {
  name = 'portal'

  constructor(
    private logger: Logger,
    private rpcs: Map<string, RpcClient>,
  ) {
    this.logger = logger.for(this)
  }

  decode(input: LogToDecode) {
    // TODO: whitelist
    const parsed = parseTransferRedeemed(input.log, null)
    if (!parsed) return

    return TransferRedeemed.create(input.tx, {
      sequence: parsed.sequence.toString(),
      emitterWormholeChainId: parsed.emitterChainId,
      emitterAddress: EthereumAddress(`0x${parsed.emitterAddress.slice(-40)}`),
    })
  }

  async match(event: Event, db: EventDb): Promise<MatchResult | undefined> {
    if (!TransferRedeemed.checkType(event)) {
      return
    }

    const outboundEvent = db.find(LogMessagePublished, {
      sender: event.args.emitterAddress,
      wormholeChainId: event.args.emitterWormholeChainId,
      sequence: event.args.sequence,
    })
    if (!outboundEvent) {
      return
    }

    const rpc = this.rpcs.get(outboundEvent.tx.chain)
    if (!rpc) {
      this.logger.warn('RPC not configured', { chain: outboundEvent.tx.chain })
      return
    }

    const tokenBridge = NETWORKS.find(
      (n) => n.chain === outboundEvent.tx.chain,
    )?.tokenBridge
    if (!tokenBridge) {
      this.logger.warn('Network not configured', {
        chain: outboundEvent.tx.chain,
      })
      return
    }
    //parseTransferWithPayload not yet supported
    //to support it we would need to check method signature from calldata
    const call = await rpc.call(
      {
        to: tokenBridge,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'parseTransfer',
            args: [outboundEvent.args.payload],
          }),
        ),
      },
      outboundEvent.tx.blockNumber,
    )

    const parsedTransfer = decodeFunctionResult({
      abi: ABI,
      data: call.toString() as `0x${string}`,
      functionName: 'parseTransfer',
    })

    const tokenAddress = `0x${parsedTransfer.tokenAddress.slice(-40)}`

    return {
      message: {
        type: 'portal.WormholeMessage',
        inbound: event,
        outbound: outboundEvent,
      },
      transfer: {
        type: 'portal.Transfer',
        events: [outboundEvent, event],
        outbound: {
          tx: outboundEvent.tx,
        },
        inbound: {
          tx: event.tx,
          tokenAddress,
          amount: parsedTransfer.amount.toString(),
        },
      },
    }
  }
}
