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
import { findParsedAround } from './hyperlane-hwr'
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
  matchId: string
  amount: bigint
  tokenAddress?: Address32
  $dstChain: string
}>('axelar-its.InterchainTransfer')

export const InterchainTransferReceived = createInteropEventType<{
  matchId: string
  commandId: `0x${string}`
  amount: bigint
  tokenAddress?: Address32
  $srcChain: string
}>('axelar-its.InterchainTransferReceived')

export class AxelarITSPlugin implements InteropPlugin {
  name = 'axelar-its'

  capture(input: LogToCapture) {
    const interchainTransfer = parseInterchainTransfer(input.log, null)
    if (interchainTransfer) {
      const tokenAddress = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== interchainTransfer.amount) return
          return Address32.from(log.address)
        },
      )?.parsed

      const $dstChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        interchainTransfer.destinationChain,
      )
      const matchId = `${input.chain}-${$dstChain}-${interchainTransfer.sourceAddress.toLowerCase()}-${interchainTransfer.destinationAddress.toLowerCase()}-${interchainTransfer.amount.toString()}-${interchainTransfer.dataHash}`

      return [
        InterchainTransfer.create(input, {
          matchId,
          amount: interchainTransfer.amount,
          tokenAddress: tokenAddress,
          $dstChain,
        }),
      ]
    }

    const interchainTransferReceived = parseInterchainTransferReceived(
      input.log,
      null,
    )
    if (interchainTransferReceived) {
      const tokenAddress = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== interchainTransferReceived.amount) return
          return Address32.from(log.address)
        },
      )?.parsed

      const $srcChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        interchainTransferReceived.sourceChain,
      )
      const matchId = `${$srcChain}-${input.chain}-${interchainTransferReceived.sourceAddress.toLowerCase()}-${interchainTransferReceived.destinationAddress.toLowerCase()}-${interchainTransferReceived.amount.toString()}-${interchainTransferReceived.dataHash}`

      return [
        InterchainTransferReceived.create(input, {
          matchId,
          commandId: interchainTransferReceived.commandId,
          amount: interchainTransferReceived.amount,
          tokenAddress: tokenAddress,
          $srcChain,
        }),
      ]
    }
  }

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
      const interchainTransfer = db.find(InterchainTransfer, {
        matchId: interchainTransferReceived.args.matchId,
      })
      if (!interchainTransfer) return

      const contractCall = db.find(ContractCall, {
        sameTxAfter: interchainTransfer,
      })
      if (!contractCall) return
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
