/* axelar

For general message passing:
    - ContractCall on SRC chain
    - ContractCallApproved on DST chain
    - ContractCallExecuted on DST chain

  TODO: handle other Axelar events (e.g. token transfer)
  TODO: axelar uses chain names, they may differ from our naming
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

const parseContractCallApproved = createEventParser(
  'event ContractCallApproved(bytes32 indexed commandId,string sourceChain, string sourceAddress, address indexed contractAddress,bytes32 indexed payloadHash,bytes32 sourceTxHash,uint256 sourceEventIndex)',
)

const parseContractCallExecuted = createEventParser(
  'event ContractCallExecuted(bytes32 indexed commandId)',
)

export const ContractCall = createBridgeEventType<{
  sender: EthereumAddress
  destinationChain: string
  destinationContractAddress: string
  payloadHash: `0x${string}`
  txHash: string
}>('axelar.ContractCall')

export const ContractCallApproved = createBridgeEventType<{
  commandId: string
  sourceChain: string
  sourceAddress: string
  contractAddress: EthereumAddress
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
}>('axelar.ContractCallApproved')

export const ContractCallExecuted = createBridgeEventType<{
  commandId: string
}>('axelar.ContractCallExecuted')

export class AxelarPlugin implements BridgePlugin {
  name = 'axelar'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const parsed = parseContractCall(input.log, null)
    if (parsed) {
      return ContractCall.create(input.ctx, {
        sender: EthereumAddress(parsed.sender),
        destinationContractAddress: parsed.destinationContractAddress,
        destinationChain: parsed.destinationChain,
        payloadHash: parsed.payloadHash,
        txHash: input.ctx.txHash,
      })
    }

    const parsedApproved = parseContractCallApproved(input.log, null)
    if (parsedApproved) {
      return ContractCallApproved.create(input.ctx, {
        commandId: parsedApproved.commandId,
        payloadHash: parsedApproved.payloadHash,
        sourceChain: parsedApproved.sourceChain,
        sourceAddress: parsedApproved.sourceAddress,
        contractAddress: EthereumAddress(parsedApproved.contractAddress),
        srcTxHash: parsedApproved.sourceTxHash,
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
        txHash: contractCallApproved.args.srcTxHash,
      })
      if (!contractCall) {
        return
      }

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
}
