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
  type LogToCapture,
  type MatchResult,
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

export const NETWORKS = [
  { axelarChainName: 'Ethereum', chain: 'ethereum' },
  { axelarChainName: 'arbitrum', chain: 'arbitrum' },
  { axelarChainName: 'Avalanche', chain: 'avalanche' },
  { axelarChainName: 'base', chain: 'base' },
  { axelarChainName: 'mantle', chain: 'mantle' },
  { axelarChainName: 'immutable', chain: 'immutable' },
  { axelarChainName: 'Fantom', chain: 'fantom' },
  { axelarChainName: 'binance', chain: 'bsc' },
  { axelarChainName: 'centrifuge', chain: 'centrifuge' },
  { axelarChainName: 'linea', chain: 'linea' },
  { axelarChainName: 'optimism', chain: 'optimism' },
]

export const ContractCall = createBridgeEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  txHash: string
  $dstChain: string
}>('axelar.ContractCall')

export const ContractCallWithToken = createBridgeEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  txHash: string
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
  chains = ['ethereum', 'arbitrum', 'base', 'optimism']

  capture(input: LogToCapture) {
    const parsed = parseContractCall(input.log, null)
    if (parsed) {
      return ContractCall.create(input.ctx, {
        sender: EthereumAddress(parsed.sender),
        destinationContractAddress: parsed.destinationContractAddress,
        payloadHash: parsed.payloadHash,
        txHash: input.ctx.txHash,
        $dstChain:
          NETWORKS.find((x) => x.axelarChainName === parsed.destinationChain)
            ?.chain ?? `AXL_${parsed.destinationChain}`,
      })
    }

    const parsed2 = parseContractCallWithToken(input.log, null)
    if (parsed2) {
      return ContractCallWithToken.create(input.ctx, {
        sender: EthereumAddress(parsed2.sender),
        destinationContractAddress: parsed2.destinationContractAddress,
        payloadHash: parsed2.payloadHash,
        symbol: parsed2.symbol,
        amount: Number(parsed2.amount),
        txHash: input.ctx.txHash,
        $dstChain:
          NETWORKS.find((x) => x.axelarChainName === parsed2.destinationChain)
            ?.chain ?? `AXL_${parsed2.destinationChain}`,
      })
    }

    const parsedApproved = parseContractCallApproved(input.log, null)
    if (parsedApproved) {
      return ContractCallApproved.create(input.ctx, {
        commandId: parsedApproved.commandId,
        payloadHash: parsedApproved.payloadHash,
        sourceAddress: parsedApproved.sourceAddress,
        contractAddress: EthereumAddress(parsedApproved.contractAddress),
        srcTxHash: parsedApproved.sourceTxHash,
        $srcChain:
          NETWORKS.find((x) => x.axelarChainName === parsedApproved.sourceChain)
            ?.chain ?? `AXL_${parsedApproved.sourceChain}`,
      })
    }

    const parsedApprovedWithMint = parseContractCallApprovedWithMint(
      input.log,
      null,
    )
    if (parsedApprovedWithMint) {
      return ContractCallApprovedWithMint.create(input.ctx, {
        commandId: parsedApprovedWithMint.commandId,
        payloadHash: parsedApprovedWithMint.payloadHash,
        sourceAddress: parsedApprovedWithMint.sourceAddress,
        contractAddress: EthereumAddress(
          parsedApprovedWithMint.contractAddress,
        ),
        symbol: parsedApprovedWithMint.symbol,
        amount: Number(parsedApprovedWithMint.amount),
        srcTxHash: parsedApprovedWithMint.sourceTxHash,
        $srcChain:
          NETWORKS.find(
            (x) => x.axelarChainName === parsedApprovedWithMint.sourceChain,
          )?.chain ?? `AXL_${parsedApprovedWithMint.sourceChain}`,
      })
    }

    const parsedExecuted = parseContractCallExecuted(input.log, null)
    if (parsedExecuted) {
      return ContractCallExecuted.create(input.ctx, {
        commandId: parsedExecuted.commandId,
      })
    }
  }

  match(
    contractCallApproved: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (ContractCallApproved.checkType(contractCallApproved)) {
      const contractCall = db.find(ContractCall, {
        txHash: contractCallApproved.args.srcTxHash, // TODO: this may not be enough but event index is also available
      })
      if (contractCall) {
        return {
          messages: [
            {
              type: 'Axelar.ContractCallMessage',
              outbound: contractCall,
              inbound: contractCallApproved,
            },
          ],
        }
      }
    }
    if (ContractCallApprovedWithMint.checkType(contractCallApproved)) {
      const contractCallWithToken = db.find(ContractCallWithToken, {
        txHash: contractCallApproved.args.srcTxHash, // TODO: this may not be enough but event index is also available
      })
      if (contractCallWithToken) {
        const contractCallExecuted = db.find(ContractCallExecuted, {
          commandId: contractCallApproved.args.commandId,
        })
        if (contractCallExecuted) {
          return {
            messages: [
              {
                type: 'Axelar.ContractCallWithTokenMessage',
                outbound: contractCallWithToken,
                inbound: contractCallApproved,
              },
            ],
            transfers: [
              {
                type: 'axelarGateway.App',
                events: [
                  contractCallWithToken,
                  contractCallApproved,
                  contractCallExecuted,
                ],
                outbound: {
                  event: contractCallWithToken,
                  token: {
                    address: 'native', // TODO: we have only symbol, not address
                    amount: contractCallWithToken.args.amount.toString(),
                  },
                },
                inbound: {
                  event: contractCallExecuted,
                  token: {
                    address: 'native', // TODO: we have only symbol, not address
                    amount: contractCallWithToken.args.amount.toString(),
                  },
                },
              },
            ],
          }
        }
      }
    }
  }
}
