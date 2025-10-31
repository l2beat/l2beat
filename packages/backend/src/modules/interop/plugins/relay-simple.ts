/* RELAY

This is an experimental plugin for the RELAY protocol. It checks
deposits to the solver on SRC and deposits from the solver on DST
and matches them based on the additional requestId hidden in the
calldata

It also checks events from the following contracts:
1. RelayReceiver - used in V1
2. RelayDepository - used in V2

On the destination chain it tries to capture direct transfers from
the Solver or via Router (which serves as a multicall facitlity for
a Solver that, e.g. tries to buy an NFT on behalf of a user).
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
  type TxToCapture,
} from './types'

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

const parseFundsForwardedWithData = createEventParser(
  'event FundsForwardedWithData(bytes data)',
)

const parseRelayNativeDeposit = createEventParser(
  'event RelayNativeDeposit(address from, uint256 amount, bytes32 id)',
)

const parseRelayERC20Deposit = createEventParser(
  'event RelayERC20Deposit(address from, address token, uint256 amount, bytes32 id)',
)

export const TransferSrc = createInteropEventType<{
  amount?: string
  tokenAddress: Address32
  kind: string
  requestId: string
}>('relay-simple.TransferSrc')

export const TransferDst = createInteropEventType<{
  amount?: string
  tokenAddress: Address32
  kind: string
  requestId: string
}>('relay-simple.TransferDst')

export const FundsForwardedWithData = createInteropEventType<{
  requestId: string
}>('relay-simple.FundsForwardedWithData')

export const RelayNativeDeposit = createInteropEventType<{
  amount: string
  requestId: string
}>('relay-simple.RelayNativeDeposit')

export const RelayERC20Deposit = createInteropEventType<{
  tokenAddress: Address32
  amount: string
  requestId: string
}>('relay-simple.RelayERC20Deposit')

const RelaySolver = EthereumAddress(
  '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
)

const RelayRouter = EthereumAddress(
  '0xF5042e6ffaC5a625D4E7848e0b01373D8eB9e222',
)

const RelayApprovalProxy = EthereumAddress(
  '0xBBbfD134E9b44BfB5123898BA36b01dE7ab93d98',
)

const RelaySolver32 = Address32.from(RelaySolver)
const RelayRouter32 = Address32.from(RelayRouter)
const RelayApprovalProxy32 = Address32.from(RelayApprovalProxy)

export class RelaySimplePlugIn implements InteropPlugin {
  name = 'relay-simple'

  captureTx(input: TxToCapture) {
    if (input.tx.txTo === RelaySolver32) {
      if (input.tx.txData.length === 2 + 64) {
        return [
          TransferSrc.create(input.tx, {
            amount: input.tx.txValue?.toString(),
            tokenAddress: Address32.NATIVE,
            kind: 'direct transfer',
            requestId: input.tx.txData,
          }),
        ]
      }
    }

    if (input.tx.txFrom === RelaySolver32) {
      if (input.tx.txData.length === 2 + 64) {
        return [
          TransferDst.create(input.tx, {
            amount: input.tx.txValue?.toString(),
            tokenAddress: Address32.NATIVE,
            kind: 'direct transfer',
            requestId: input.tx.txData,
          }),
        ]
      }
    }

    if (input.tx.txTo === RelayRouter32) {
      return [
        TransferDst.create(input.tx, {
          amount: input.tx.txValue?.toString(),
          tokenAddress: Address32.NATIVE,
          kind: 'relay router',
          requestId: '0x' + input.tx.txData.slice(-64),
        }),
      ]
    }

    if (input.tx.txTo === RelayApprovalProxy32) {
      return [
        TransferDst.create(input.tx, {
          amount: input.tx.txValue?.toString(),
          tokenAddress: Address32.NATIVE,
          kind: 'relay approval proxy',
          requestId: '0x' + input.tx.txData.slice(-64),
        }),
      ]
    }
  }

  capture(input: LogToCapture) {
    const transfer = parseTransfer(input.log, null)
    if (transfer) {
      if (transfer.to === RelaySolver) {
        if (input.ctx.txData.length === 2 + 8 + 64 * 3) {
          return [
            TransferSrc.create(input.ctx, {
              amount: transfer.value.toString(),
              tokenAddress: Address32.from(input.log.address),
              kind: 'direct ERC20 transfer',
              requestId: '0x' + input.ctx.txData.slice(-64),
            }),
          ]
        }
      }

      if (transfer.from === RelaySolver) {
        if (input.ctx.txData.length === 2 + 8 + 64 * 3) {
          return [
            TransferDst.create(input.ctx, {
              amount: transfer.value.toString(),
              tokenAddress: Address32.from(input.log.address),
              kind: 'direct ERC20 transfer',
              requestId: '0x' + input.ctx.txData.slice(-64),
            }),
          ]
        }
      }
    }

    const fundsForwardedWithData = parseFundsForwardedWithData(input.log, null)
    if (fundsForwardedWithData) {
      return [
        TransferSrc.create(input.ctx, {
          amount: input.ctx.txValue?.toString(),
          tokenAddress: Address32.NATIVE,
          kind: 'funds forwarded',
          requestId: fundsForwardedWithData.data.slice(0, 2 + 64),
        }),
      ]
    }

    const relayNativeDeposit = parseRelayNativeDeposit(input.log, null)
    if (relayNativeDeposit) {
      return [
        TransferSrc.create(input.ctx, {
          amount: relayNativeDeposit.amount.toString(),
          tokenAddress: Address32.NATIVE,
          kind: 'relay native deposit',
          requestId: relayNativeDeposit.id,
        }),
      ]
    }

    const relayERC20Deposit = parseRelayERC20Deposit(input.log, null)
    if (relayERC20Deposit) {
      return [
        TransferSrc.create(input.ctx, {
          amount: relayERC20Deposit.amount.toString(),
          tokenAddress: Address32.from(input.log.address),
          kind: 'relay ERC20 deposit',
          requestId: relayERC20Deposit.id,
        }),
      ]
    }
  }

  matchTypes = [TransferSrc, TransferDst]
  match(
    transferSrc: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (TransferDst.checkType(transferSrc)) {
      const transferDst = db.find(TransferSrc, {
        requestId: transferSrc.args.requestId,
      })
      if (!transferDst) return

      if (transferSrc.ctx.chain === transferDst.ctx.chain) {
        return [Result.Ignore([transferSrc, transferDst])]
      }

      return [
        Result.Message('relay-simple.Message', {
          app: 'relay-simple',
          srcEvent: transferDst,
          dstEvent: transferSrc,
        }),
        Result.Transfer('relay-simple.Transfer', {
          srcEvent: transferDst,
          srcAmount: transferDst.args.amount
            ? BigInt(transferDst.args.amount)
            : undefined,
          srcTokenAddress: transferDst.args.tokenAddress,
          dstEvent: transferSrc,
          dstAmount: transferSrc.args.amount
            ? BigInt(transferSrc.args.amount)
            : undefined,
          dstTokenAddress: transferSrc.args.tokenAddress,
        }),
      ]
    }
  }
}
