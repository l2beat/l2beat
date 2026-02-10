/**
 * Axelar Interchain Token Service
 * OMNICHAIN token standard
 */

import type { AbstractTokenRecord } from '@l2beat/database'
import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  AXELAR_NETWORKS,
  ContractCall,
  ContractCallApproved,
  ContractCallExecuted,
} from './axelar'
import { findParsedAround } from './hyperlane-hwr'
import { getBridgeType } from './layerzero/layerzero-v2-ofts.plugin'
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
  srcWasBurned?: boolean
  $dstChain: string
}>('axelar-its.InterchainTransfer', { direction: 'outgoing' })

export const InterchainTransferReceived = createInteropEventType<{
  matchId: string
  commandId: `0x${string}`
  amount: bigint
  tokenAddress?: Address32
  dstWasMinted?: boolean
  $srcChain: string
}>('axelar-its.InterchainTransferReceived', { direction: 'incoming' })

export class AxelarITSPlugin implements InteropPlugin {
  readonly name = 'axelar-its'

  capture(input: LogToCapture) {
    const interchainTransfer = parseInterchainTransfer(input.log, null)
    if (interchainTransfer) {
      const transferInfo = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== interchainTransfer.amount) return
          return {
            address: Address32.from(log.address),
            burned: Address32.from(transfer.to) === Address32.ZERO,
          }
        },
      )

      const $dstChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        interchainTransfer.destinationChain,
      )
      const matchId = axelarSynthMatchId(
        input.chain,
        $dstChain,
        interchainTransfer.sourceAddress,
        interchainTransfer.destinationAddress,
        interchainTransfer.amount,
        interchainTransfer.dataHash,
      )

      return [
        InterchainTransfer.create(input, {
          matchId,
          amount: interchainTransfer.amount,
          tokenAddress: transferInfo?.address,
          srcWasBurned: transferInfo?.burned,
          $dstChain,
        }),
      ]
    }

    const interchainTransferReceived = parseInterchainTransferReceived(
      input.log,
      null,
    )
    if (interchainTransferReceived) {
      const transferInfo = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== interchainTransferReceived.amount) return
          return {
            address: Address32.from(log.address),
            minted: Address32.from(transfer.from) === Address32.ZERO,
          }
        },
      )

      const $srcChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        interchainTransferReceived.sourceChain,
      )
      const matchId = axelarSynthMatchId(
        $srcChain,
        input.chain,
        interchainTransferReceived.sourceAddress,
        interchainTransferReceived.destinationAddress,
        interchainTransferReceived.amount,
        interchainTransferReceived.dataHash,
      )
      return [
        InterchainTransferReceived.create(input, {
          matchId,
          commandId: interchainTransferReceived.commandId,
          amount: interchainTransferReceived.amount,
          tokenAddress: transferInfo?.address,
          dstWasMinted: transferInfo?.minted,
          $srcChain,
        }),
      ]
    }
  }

  matchTypes = [ContractCallExecuted] // same entry as axelar.ts to prevent it stealing events
  match(
    contractCallExecuted: InteropEvent,
    db: InteropEventDb,
    deployedToAbstractMap: Map<ChainSpecificAddress, AbstractTokenRecord>,
  ): MatchResult | undefined {
    if (ContractCallExecuted.checkType(contractCallExecuted)) {
      const interchainTransferReceived = db.find(InterchainTransferReceived, {
        commandId: contractCallExecuted.args.commandId,
      })
      if (!interchainTransferReceived) return
      const contractCallApproved = db.find(ContractCallApproved, {
        commandId: interchainTransferReceived.args.commandId,
      })
      if (!contractCallApproved) return
      const interchainTransfer = db.find(InterchainTransfer, {
        // matching by our own ID because commandId, payload(hash) and 'txHash' are associated on axelar
        matchId: interchainTransferReceived.args.matchId,
      })
      if (!interchainTransfer) return

      const contractCall = db.find(ContractCall, {
        sameTxAfter: interchainTransfer,
      })
      if (!contractCall) return

      // bridgeType block
      const srcTokenAddress = interchainTransfer.args.tokenAddress
      const dstTokenAddress = interchainTransferReceived.args.tokenAddress
      const srcWasBurned = interchainTransfer.args.srcWasBurned
      const dstWasMinted = interchainTransferReceived.args.dstWasMinted
      const bridgeType = getBridgeType({
        srcTokenAddress,
        dstTokenAddress,
        srcWasBurned,
        dstWasMinted,
        srcChain: interchainTransfer.ctx.chain,
        dstChain: interchainTransferReceived.ctx.chain,
        deployedToAbstractMap,
      })

      return [
        Result.Message('axelar.Message', {
          app: 'axelar-its',
          srcEvent: contractCall,
          dstEvent: contractCallApproved,
          extraEvents: [contractCallExecuted],
        }),
        Result.Transfer('axelar-its.Transfer', {
          srcEvent: interchainTransfer,
          srcAmount: interchainTransfer.args.amount,
          srcTokenAddress,
          srcWasBurned,
          dstEvent: interchainTransferReceived,
          dstAmount: interchainTransferReceived.args.amount,
          dstTokenAddress,
          dstWasMinted,
          bridgeType,
        }),
      ]
    }
  }
}

export function axelarSynthMatchId(
  srcChain: string,
  dstChain: string,
  srcAddress: string,
  dstAddress: string,
  amount: bigint,
  dataHash: `0x${string}`,
): string {
  return `${srcChain}-${dstChain}-${srcAddress.toLowerCase()}-${dstAddress.toLowerCase()}-${amount.toString()}-${dataHash.toLowerCase()}`
}
