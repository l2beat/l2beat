import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import { extractAddressFromPadded } from '../../../bridges/utils/viem'
import type { DataService } from '../../types/DataService'
import type { MatcherOutput } from '../../types/Matcher'
import type { TokenService } from '../../types/TokenService'
import type { Wormhole_Outbound } from '../../types/UnmatchedMessage'
import type { Portal_Inbound } from '../../types/UnmatchedTransfer.'

const ABI = parseAbi([
  'function parseTransfer(bytes memory encoded) public pure returns ((uint8 payloadID,uint256 amount,bytes32 tokenAddress,uint16 tokenChain,bytes32 to,uint16 toChain,uint256 fee) memory transfer)',
])

const CONFIG = [
  {
    chainId: 2,
    chain: 'ethereum',
    tokenBridge: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'),
  },
  {
    chainId: 23,
    chain: 'arbitrum',
    tokenBridge: EthereumAddress('0x0b2402144Bb366A632D14B83F244D2e0e21bD39c'),
  },
  {
    chainId: 30,
    chain: 'base',
    tokenBridge: EthereumAddress('0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627'),
  },
]

export async function matcher(
  dataService: DataService,
  tokenService: TokenService,
  rpcs: Map<string, RpcClient>,
): Promise<MatcherOutput> {
  const unmatchedMessages =
    dataService.getUnmatchedMessages<Wormhole_Outbound>('wormhole')

  const unmatchedTransfers =
    dataService.getUnmatchedTransfers<Portal_Inbound>('portal')

  const result: MatcherOutput = {
    transfers: [],
    messages: [],
  }

  const toDelete: {
    unmatchedMessages: { messagingProtocol: string; id: string }[]
    unmatchedTransfers: { app: string; id: string }[]
  } = {
    unmatchedMessages: [],
    unmatchedTransfers: [],
  }

  const outbounds = unmatchedMessages.filter(
    (m) =>
      m.sender === CONFIG.find((n) => n.chain === m.originChain)?.tokenBridge,
  )

  for (const outbound of outbounds) {
    const inbound = unmatchedTransfers.find((t) => t.id === outbound.id)

    if (inbound) {
      result.messages.push({
        id: outbound.id,
        messagingProtocol: outbound.messagingProtocol,
        associated: [
          {
            app: inbound.app,
            transferId: inbound.id,
          },
        ],

        originChain: outbound.originChain,
        originTxHash: outbound.txHash,
        originTimestamp: outbound.timestamp,

        destinationChain: inbound.destinationChain,
        destinationTxHash: inbound.txHash,
        destinationTimestamp: inbound.timestamp,
      })

      const rpc = rpcs.get(outbound.originChain)
      assert(rpc)
      const tokenBridge = CONFIG.find(
        (n) => n.chain === outbound.originChain,
      )?.tokenBridge
      assert(tokenBridge)
      //parseTransferWithPayload not yet supported
      //to support it we would need to check method signature from calldata
      const call = await rpc.call(
        {
          to: tokenBridge,
          data: Bytes.fromHex(
            encodeFunctionData({
              abi: ABI,
              functionName: 'parseTransfer',
              args: [outbound.payload],
            }),
          ),
        },
        outbound.blockNumber,
      )

      const parsedTransfer = decodeFunctionResult({
        abi: ABI,
        data: call.toString() as Hex,
        functionName: 'parseTransfer',
      })

      const destinationToken = extractAddressFromPadded(
        parsedTransfer.tokenAddress,
      )

      const financials = await tokenService.calculateValue(
        inbound.destinationChain,
        destinationToken,
        parsedTransfer.amount,
        inbound.timestamp,
      )

      result.transfers.push({
        id: outbound.id,
        app: inbound.app,
        associated: [
          {
            messagingProtocol: outbound.messagingProtocol,
            messageId: outbound.id,
          },
        ],

        originChain: outbound.originChain,
        originTx: outbound.txHash,
        originTimestamp: outbound.timestamp,
        originAmount: parsedTransfer.amount,

        destinationChain: inbound.destinationChain,
        destinationTx: inbound.txHash,
        destinationTimestamp: inbound.timestamp,
        destinationToken: destinationToken,
        destinationAmount: parsedTransfer.amount,

        token: financials?.symbol,
        amount: financials?.amount,
        valueUsd: financials?.valueUsd,
      })

      toDelete.unmatchedMessages.push({
        messagingProtocol: outbound.messagingProtocol,
        id: outbound.id,
      })
      toDelete.unmatchedTransfers.push({
        app: inbound.app,
        id: inbound.id,
      })
    }
  }

  dataService.deleteUnmatchedMessages(toDelete.unmatchedMessages)
  dataService.deleteUnmatchedTransfers(toDelete.unmatchedTransfers)

  return result
}
