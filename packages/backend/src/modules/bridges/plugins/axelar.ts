/* axelar

For general message passing:
    - ContractCall on SRC chain
    - ContractCallApproved on DST chain
    - ContractCallExecuted on DST chain

  TODO: handle other Axelar events (e.g. token transfer)
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseContractCall = createEventParser(
  'event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)',
)

const parseContractCallWithToken = createEventParser(
  'event ContractCallWithToken(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload, string symbol, uint256 amount)',
)

const parseContractCallApproved = createEventParser(
  'event ContractCallApproved(bytes32 indexed commandId,string sourceChain, string sourceAddress, address indexed contractAddress,bytes32 indexed payloadHash,bytes32 sourceTxHash,uint256 sourceEventIndex)',
)

const parseContractCallApprovedWithMint = createEventParser(
  'event ContractCallApprovedWithMint(bytes32 indexed commandId,string sourceChain, string sourceAddress, address indexed contractAddress,bytes32 indexed payloadHash,string symbol, uint256 amount, bytes32 sourceTxHash,uint256 sourceEventIndex)',
)

const parseContractCallExecuted = createEventParser(
  'event ContractCallExecuted(bytes32 indexed commandId)',
)

export const AXELAR_NETWORKS = defineNetworks('axelar', [
  { axelarChainName: 'Ethereum', chain: 'ethereum' },
  { axelarChainName: 'arbitrum', chain: 'arbitrum' },
  { axelarChainName: 'Avalanche', chain: 'avalanche' },
  { axelarChainName: 'base', chain: 'base' },
  { axelarChainName: 'mantle', chain: 'mantle' },
  // { axelarChainName: 'immutable', chain: 'immutable' },
  // { axelarChainName: 'Fantom', chain: 'fantom' },
  { axelarChainName: 'binance', chain: 'bsc' },
  // { axelarChainName: 'centrifuge', chain: 'centrifuge' },
  { axelarChainName: 'linea', chain: 'linea' },
  { axelarChainName: 'optimism', chain: 'optimism' },
])

export const ContractCall = createBridgeEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  $dstChain: string
}>('axelar.ContractCall')

export const ContractCallWithToken = createBridgeEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  symbol: string
  amount: number
  $dstChain: string
}>('axelar.ContractCallWithToken')

export const ContractCallApproved = createBridgeEventType<{
  commandId: string
  sourceAddress: string
  contractAddress: EthereumAddress
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain: string
}>('axelar.ContractCallApproved')

export const ContractCallApprovedWithMint = createBridgeEventType<{
  commandId: string
  sourceAddress: string
  contractAddress: EthereumAddress
  symbol: string
  amount: number
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain: string
}>('axelar.ContractCallApprovedWithMint')

export const ContractCallExecuted = createBridgeEventType<{
  commandId: string
}>('axelar.ContractCallExecuted')

export class AxelarPlugin implements BridgePlugin {
  name = 'axelar'

  capture(input: LogToCapture) {
    const contractCall = parseContractCall(input.log, null)
    if (contractCall) {
      return ContractCall.create(input.ctx, {
        sender: EthereumAddress(contractCall.sender),
        destinationContractAddress: contractCall.destinationContractAddress,
        payloadHash: contractCall.payloadHash,
        $dstChain:
          AXELAR_NETWORKS.find(
            (x) => x.axelarChainName === contractCall.destinationChain,
          )?.chain ?? `AXL_${contractCall.destinationChain}`,
      })
    }

    const contractCallWithToken = parseContractCallWithToken(input.log, null)
    if (contractCallWithToken) {
      return ContractCallWithToken.create(input.ctx, {
        sender: EthereumAddress(contractCallWithToken.sender),
        destinationContractAddress:
          contractCallWithToken.destinationContractAddress,
        payloadHash: contractCallWithToken.payloadHash,
        symbol: contractCallWithToken.symbol,
        amount: Number(contractCallWithToken.amount),
        $dstChain:
          AXELAR_NETWORKS.find(
            (x) => x.axelarChainName === contractCallWithToken.destinationChain,
          )?.chain ?? `AXL_${contractCallWithToken.destinationChain}`,
      })
    }

    const contractCallApproved = parseContractCallApproved(input.log, null)
    if (contractCallApproved) {
      return ContractCallApproved.create(input.ctx, {
        commandId: contractCallApproved.commandId,
        payloadHash: contractCallApproved.payloadHash,
        sourceAddress: contractCallApproved.sourceAddress,
        contractAddress: EthereumAddress(contractCallApproved.contractAddress),
        srcTxHash: contractCallApproved.sourceTxHash,
        $srcChain:
          AXELAR_NETWORKS.find(
            (x) => x.axelarChainName === contractCallApproved.sourceChain,
          )?.chain ?? `AXL_${contractCallApproved.sourceChain}`,
      })
    }

    const contractCallApprovedWithMint = parseContractCallApprovedWithMint(
      input.log,
      null,
    )
    if (contractCallApprovedWithMint) {
      return ContractCallApprovedWithMint.create(input.ctx, {
        commandId: contractCallApprovedWithMint.commandId,
        payloadHash: contractCallApprovedWithMint.payloadHash,
        sourceAddress: contractCallApprovedWithMint.sourceAddress,
        contractAddress: EthereumAddress(
          contractCallApprovedWithMint.contractAddress,
        ),
        symbol: contractCallApprovedWithMint.symbol,
        amount: Number(contractCallApprovedWithMint.amount),
        srcTxHash: contractCallApprovedWithMint.sourceTxHash,
        $srcChain:
          AXELAR_NETWORKS.find(
            (x) =>
              x.axelarChainName === contractCallApprovedWithMint.sourceChain,
          )?.chain ?? `AXL_${contractCallApprovedWithMint.sourceChain}`,
      })
    }

    const contractCallExecuted = parseContractCallExecuted(input.log, null)
    if (contractCallExecuted) {
      return ContractCallExecuted.create(input.ctx, {
        commandId: contractCallExecuted.commandId,
      })
    }
  }

  match(
    contractCallApproved: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (ContractCallApproved.checkType(contractCallApproved)) {
      const contractCall = db.find(ContractCall, {
        ctx: {
          txHash: contractCallApproved.args.srcTxHash, // TODO: this may not be enough but event index is also available
        },
      })
      if (!contractCall) return
      return [
        Result.Message('axelar.ContractCallMessage', [
          contractCall,
          contractCallApproved,
        ]),
      ]
    }

    if (ContractCallApprovedWithMint.checkType(contractCallApproved)) {
      const contractCallWithToken = db.find(ContractCallWithToken, {
        ctx: {
          txHash: contractCallApproved.args.srcTxHash, // TODO: this may not be enough but event index is also available
        },
      })
      if (!contractCallWithToken) return
      const contractCallExecuted = db.find(ContractCallExecuted, {
        commandId: contractCallApproved.args.commandId,
      })
      if (!contractCallExecuted) return
      return [
        Result.Message('axelar.ContractCallWithTokenMessage', [
          contractCallWithToken,
          contractCallApproved,
        ]),
        Result.Transfer('axelar-gateway.Transfer', {
          srcEvent: contractCallWithToken,
          srcTokenSymbol: contractCallWithToken.args.symbol,
          srcAmount: contractCallWithToken.args.amount.toString(),
          dstEvent: contractCallExecuted,
        }),
      ]
    }
  }
}
