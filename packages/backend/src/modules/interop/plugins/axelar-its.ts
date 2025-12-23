/* axelar Interchain Transfer Service (ITS) plugin

This plugin handles all ITS tokens
SRC:
- InterchainTransfer event
- ContractCall event
DST APPROVE:
- ContractCallApproved event
DST EXECUTE:
- Gateway.ContractCallExecuted event
- InterchainTransferReceived event

*/

import { Address32 } from '@l2beat/shared-pure'
import {
  AXELAR_NETWORKS,
  ContractCall,
  ContractCallApproved,
  ContractCallExecuted,
} from './axelar'
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
} from './types'

const parseInterchainTransfer = createEventParser(
  'event InterchainTransfer(bytes32 indexed tokenId, address indexed sourceAddress, string destinationChain, bytes destinationAddress, uint256 amount, bytes32 indexed dataHash)',
)

const parseInterchainTransferReceived = createEventParser(
  'event InterchainTransferReceived(bytes32 indexed commandId, bytes32 indexed tokenId, string sourceChain, bytes sourceAddress, address indexed destinationAddress, uint256 amount, bytes32 dataHash)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export const InterchainTransfer = createInteropEventType<{
  tokenId: `0x${string}`
  amount: bigint
  tokenAddress?: Address32
  $dstChain: string
}>('axelar-its.InterchainTransfer')

export const InterchainTransferReceived = createInteropEventType<{
  commandId: `0x${string}`
  tokenId: `0x${string}`
  amount: bigint
  tokenAddress?: Address32
  $srcChain: string
}>('axelar-its.InterchainTransferReceived')

export class AxelarITSPlugin implements InteropPlugin {
  name = 'axelar-its'

  capture(input: LogToCapture) {
    const interchainTransfer = parseInterchainTransfer(input.log, null)
    if (interchainTransfer) {
      // Find Transfer event by searching through all preceding logs in the same tx in the worst case
      let srcTokenAddress: Address32 | undefined

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
          // compare amount to not match a rogue Transfer event
          if (transfer.value === interchainTransfer.amount) {
            srcTokenAddress = Address32.from(precedingLog.address)
            break
          }
        }
      }

      return [
        InterchainTransfer.create(input, {
          tokenId: interchainTransfer.tokenId,
          amount: interchainTransfer.amount,
          tokenAddress: srcTokenAddress,
          $dstChain: findChain(
            AXELAR_NETWORKS,
            (x) => x.axelarChainName,
            interchainTransfer.destinationChain,
          ),
        }),
      ]
    }

    const interchainTransferReceived = parseInterchainTransferReceived(
      input.log,
      null,
    )
    if (interchainTransferReceived) {
      // Find Transfer event by searching through all preceding logs in the same tx in the worst case
      let dstTokenAddress: Address32 | undefined
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
          if (transfer.value === interchainTransferReceived.amount) {
            dstTokenAddress = Address32.from(precedingLog.address)
            break
          }
        }
      }

      return [
        InterchainTransferReceived.create(input, {
          commandId: interchainTransferReceived.commandId,
          tokenId: interchainTransferReceived.tokenId,
          amount: interchainTransferReceived.amount,
          tokenAddress: dstTokenAddress,
          $srcChain: findChain(
            AXELAR_NETWORKS,
            (x) => x.axelarChainName,
            interchainTransferReceived.sourceChain,
          ),
        }),
      ]
    }
  }

  /* Matching algorithm:
    1. Start with InterchainTransferReceived on DST chain
    2. Find Gateway.ContractCallExecuted on DST chain with the same transaction
    3. Find AxelarGateway.ContractCallApproved on DST chain with the same commandId3
    4. Find AxelarGateway.ContractCall on SRC chain with the same txHash as in step 2
    4. Find InterchainTransfer on SRC chain with the same txHash as in step 3
    5. Return message and transfer results
  */

  // TODO: There are two ContractCall events emitted in the same transaction in the example - how to deal with that ? This is somehow picked up by axelar plugin ????
  // TODO: There seems to be an error in Messages - src and dst events are the same...

  matchTypes = [InterchainTransferReceived]
  match(
    interchainTransferReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (InterchainTransferReceived.checkType(interchainTransferReceived)) {
      const contractCallExecuted = db.find(ContractCallExecuted, {
        commandId: interchainTransferReceived.args.commandId,
      })
      if (!contractCallExecuted) return

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
          extraEvents: [contractCallExecuted],
        }),
        Result.Transfer('axelar-its.Transfer', {
          srcEvent: interchainTransfer,
          srcAmount: interchainTransfer.args.amount,
          srcTokenAddress: interchainTransfer.args.tokenAddress,
          dstEvent: interchainTransferReceived,
          dstAmount: interchainTransferReceived.args.amount,
          dstTokenAddress: interchainTransferReceived.args.tokenAddress,
        }),
      ]
    }
  }
}
