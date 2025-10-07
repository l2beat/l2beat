/* axelar Interchain Transfer Service (ITS) plugin

This plugin handles all ITS tokens

*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { AXELAR_NETWORKS, ContractCall, ContractCallApproved } from './axelar'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/*
ITS tokens - for each token there is a unique tokenId (bytes32). We keep track of tokenAddresses for each chain
Example:
tokenId: 0x88f7d4d3c179fc145b10300e6e4ee078f32ec3cd3bcb80ca98f2fa7a719f330b
symbol: ATH:
arbitrum: 0xc87B37a581ec3257B734886d9d3a581F5A9d056c
ethereum: 0xbe0Ed4138121EcFC5c0E56B40517da27E6c5226B
*/

export const ITS_TOKENS: {
  tokenId: `0x${string}`
  symbol: string
  tokenAddresses: { [chain: string]: EthereumAddress }
}[] = [
  {
    tokenId:
      '0x88f7d4d3c179fc145b10300e6e4ee078f32ec3cd3bcb80ca98f2fa7a719f330b',
    symbol: 'ATH',
    tokenAddresses: {
      arbitrum: EthereumAddress('0xc87B37a581ec3257B734886d9d3a581F5A9d056c'),
      ethereum: EthereumAddress('0xbe0Ed4138121EcFC5c0E56B40517da27E6c5226B'),
    },
  },
]

const parseInterchainTransfer = createEventParser(
  'event InterchainTransfer(bytes32 indexed tokenId, address indexed sourceAddress, string destinationChain, bytes destinationAddress, uint256 amount, bytes32 indexed dataHash)',
)

const parseInterchainTransferReceived = createEventParser(
  'event InterchainTransferReceived(bytes32 indexed commandId, bytes32 indexed tokenId, string sourceChain, bytes sourceAddress, address indexed destinationAddress, uint256 amount, bytes32 dataHash)',
)

export const InterchainTransfer = createBridgeEventType<{
  tokenId: `0x${string}`
  amount: number
  tokenAddress: EthereumAddress
  $dstChain: string
}>('axelar-its.InterchainTransfer')

export const InterchainTransferReceived = createBridgeEventType<{
  commandId: `0x${string}`
  tokenId: `0x${string}`
  amount: number
  tokenAddress: EthereumAddress
  $srcChain: string
}>('axelar-its.InterchainTransferReceived')

export class AxelarITSPlugin implements BridgePlugin {
  name = 'axelar-its'

  capture(input: LogToCapture) {
    const interchainTransfer = parseInterchainTransfer(input.log, null)
    if (interchainTransfer) {
      return InterchainTransfer.create(input.ctx, {
        tokenId: interchainTransfer.tokenId,
        amount: Number(interchainTransfer.amount),
        tokenAddress:
          ITS_TOKENS.find((t) => t.tokenId === interchainTransfer.tokenId)
            ?.tokenAddresses[input.ctx.chain] ?? EthereumAddress.ZERO,
        $dstChain: findChain(
          AXELAR_NETWORKS,
          (x) => x.axelarChainName,
          interchainTransfer.destinationChain,
        ),
      })
    }

    const interchainTransferReceived = parseInterchainTransferReceived(
      input.log,
      null,
    )
    if (interchainTransferReceived) {
      return InterchainTransferReceived.create(input.ctx, {
        commandId: interchainTransferReceived.commandId,
        tokenId: interchainTransferReceived.tokenId,
        amount: Number(interchainTransferReceived.amount),
        tokenAddress:
          ITS_TOKENS.find(
            (t) => t.tokenId === interchainTransferReceived.tokenId,
          )?.tokenAddresses[input.ctx.chain] ?? EthereumAddress.ZERO,
        $srcChain: findChain(
          AXELAR_NETWORKS,
          (x) => x.axelarChainName,
          interchainTransferReceived.sourceChain,
        ),
      })
    }
  }

  /* Matching algorithm:
    1. Start with InterchainTransferReceived on DST chain
    2. Find AxelarGateway.ContractCallApproved on DST chain with the same commandId
    3. Find AxelarGateway.ContractCall on SRC chain with the same txHash as in step 2
    4. Find InterchainTransfer on SRC chain with the same txHash as in step 3
    5. Return message and transfer results
  */

  // TODO: There are two ContractCall events emitted in the same transaction in the example - how to deal with that ? This is somehow picked up by axelar plugin ????
  // TODO: There seems to be an error in Messages - src and dst events are the same...

  matchTypes = [InterchainTransferReceived]
  match(
    interchainTransferReceived: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (InterchainTransferReceived.checkType(interchainTransferReceived)) {
      const contractCallApproved = db.find(ContractCallApproved, {
        commandId: interchainTransferReceived.args.commandId,
      })
      if (!contractCallApproved) return

      const contractCall = db.find(ContractCall, {
        ctx: {
          txHash: contractCallApproved.args.srcTxHash, // TODO: this may not be enough but event index is also available
        },
      })
      if (!contractCall) return

      const interchainTransfer = db.find(InterchainTransfer, {
        sameTxBefore: contractCall,
      })
      if (!interchainTransfer) return
      return [
        Result.Message('axelar.ContractCallMessage', {
          app: 'axelar-its',
          srcEvent: contractCall,
          dstEvent: contractCallApproved,
        }),
        Result.Transfer('axelar-its.Transfer', {
          srcEvent: interchainTransfer,
          srcAmount: interchainTransfer.args.amount.toString(),
          srcTokenAddress: interchainTransfer.args.tokenAddress,
          dstEvent: interchainTransferReceived,
          dstAmount: interchainTransferReceived.args.amount.toString(),
          dstTokenAddress: interchainTransferReceived.args.tokenAddress,
        }),
      ]
    }
  }
}
