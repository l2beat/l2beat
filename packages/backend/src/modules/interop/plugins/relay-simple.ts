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

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
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
  'event RelayErc20Deposit(address from, address token, uint256 amount, bytes32 id)',
)

export const TransferSrc = createInteropEventType<{
  amount?: bigint
  tokenAddress: Address32
  kind: string
  requestId: string
}>('relay-simple.TransferSrc')

export const TransferDst = createInteropEventType<{
  amount?: bigint
  tokenAddress: Address32
  kind: string
  requestId: string
}>('relay-simple.TransferDst')

export const FundsForwardedWithData = createInteropEventType<{
  requestId: string
}>('relay-simple.FundsForwardedWithData')

export const RelayNativeDeposit = createInteropEventType<{
  amount: bigint
  requestId: string
}>('relay-simple.RelayNativeDeposit')

export const RelayERC20Deposit = createInteropEventType<{
  tokenAddress: Address32
  amount: bigint
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

export class RelaySimplePlugIn implements InteropPlugin {
  name = 'relay-simple'

  captureTx(input: TxToCapture) {
    if (input.tx.to === RelaySolver) {
      if (input.tx.data && input.tx.data.length === 2 + 64) {
        return [
          TransferSrc.createTx(input, {
            amount: input.tx.value ?? 0n,
            tokenAddress: Address32.NATIVE,
            kind: 'direct transfer',
            requestId: input.tx.data as string,
          }),
        ]
      }
    }

    if (input.tx.from === RelaySolver) {
      if (input.tx.data && input.tx.data.length === 2 + 64) {
        return [
          TransferDst.createTx(input, {
            amount: input.tx.value ?? 0n,
            tokenAddress: Address32.NATIVE,
            kind: 'direct transfer',
            requestId: input.tx.data as string,
          }),
        ]
      }
    }

    if (input.tx.to === RelayRouter) {
      return [
        TransferDst.createTx(input, {
          amount: input.tx.value ?? 0n,
          tokenAddress: Address32.NATIVE,
          kind: 'relay router',
          requestId: '0x' + (input.tx.data ?? '').slice(-64),
        }),
      ]
    }

    if (input.tx.to === RelayApprovalProxy) {
      return [
        TransferDst.createTx(input, {
          amount: input.tx.value ?? 0n,
          tokenAddress: Address32.NATIVE,
          kind: 'relay approval proxy',
          requestId: '0x' + (input.tx.data ?? '').slice(-64),
        }),
      ]
    }
  }

  capture(input: LogToCapture) {
    const transfer = parseTransfer(input.log, null)
    if (transfer) {
      if (transfer.to === RelaySolver) {
        if (input.tx.data && input.tx.data.length === 2 + 8 + 64 * 3) {
          return [
            TransferSrc.create(input, {
              amount: transfer.value,
              tokenAddress: Address32.from(input.log.address),
              kind: 'direct ERC20 transfer',
              requestId: '0x' + input.tx.data.slice(-64),
            }),
          ]
        }
      }

      if (transfer.from === RelaySolver) {
        if (input.tx.data && input.tx.data.length === 2 + 8 + 64 * 3) {
          return [
            TransferDst.create(input, {
              amount: transfer.value,
              tokenAddress: Address32.from(input.log.address),
              kind: 'direct ERC20 transfer',
              requestId: '0x' + input.tx.data.slice(-64),
            }),
          ]
        }
      }
    }

    const fundsForwardedWithData = parseFundsForwardedWithData(input.log, null)
    if (fundsForwardedWithData) {
      return [
        TransferSrc.create(input, {
          amount: input.tx.value ?? 0n,
          tokenAddress: Address32.NATIVE,
          kind: 'funds forwarded',
          requestId: fundsForwardedWithData.data.slice(0, 2 + 64),
        }),
      ]
    }

    const relayNativeDeposit = parseRelayNativeDeposit(input.log, null)
    if (relayNativeDeposit) {
      return [
        TransferSrc.create(input, {
          amount: relayNativeDeposit.amount,
          tokenAddress: Address32.NATIVE,
          kind: 'relay native deposit',
          requestId: relayNativeDeposit.id,
        }),
      ]
    }

    const relayERC20Deposit = parseRelayERC20Deposit(input.log, null)
    if (relayERC20Deposit) {
      return [
        TransferSrc.create(input, {
          amount: relayERC20Deposit.amount,
          tokenAddress: Address32.from(relayERC20Deposit.token),
          kind: 'relay ERC20 deposit',
          requestId: relayERC20Deposit.id,
        }),
      ]
    }
  }

  matchTypes = [TransferSrc, TransferDst]
  match(
    transferDst: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (TransferDst.checkType(transferDst)) {
      const transferSrc = db.find(TransferSrc, {
        requestId: transferDst.args.requestId,
      })
      if (!transferSrc) {
        // Auto-ignore unmatched after 2 hours
        if (transferDst.ctx.timestamp < UnixTime.now() - 2 * UnixTime.HOUR) {
          return [Result.Ignore([transferDst])]
        }
        return
      }

      if (transferDst.ctx.chain === transferSrc.ctx.chain) {
        return [Result.Ignore([transferDst, transferSrc])]
      }

      return [
        Result.Message('relay-simple.Message', {
          app: 'relay-simple',
          srcEvent: transferSrc,
          dstEvent: transferDst,
        }),
        Result.Transfer('relay-simple.Transfer', {
          srcEvent: transferSrc,
          srcAmount: transferSrc.args.amount,
          srcTokenAddress: transferSrc.args.tokenAddress,
          dstEvent: transferDst,
          dstAmount: transferDst.args.amount,
          dstTokenAddress: transferDst.args.tokenAddress,
        }),
      ]
    }
  }
}
