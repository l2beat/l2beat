/* RELAY

This is an experimental plugin for the RELAY protocol. It checks
deposits to the solver on SRC and deposits from the solver on DST
and matches them based on the additional requestId hidden in the 
calldata

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

export const TransferSrc = createInteropEventType<{
  amount: string
  tokenAddress: Address32
  requestId: string
}>('relay-simple.TransferSrc')

export const TransferDst = createInteropEventType<{
  amount: string
  tokenAddress: Address32
  requestId: string
}>('relay-simple.TransferDst')

const RelaySolver = EthereumAddress(
  '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
)
const RelaySolver32 = Address32.from(RelaySolver)

export class RelaySimplePlugIn implements InteropPlugin {
  name = 'relay-simple'

  captureTx(input: TxToCapture) {
    if (input.tx.txTo === RelaySolver32) {
      if (input.tx.txData.length === 2 + 64) {
        return TransferSrc.create(input.tx, {
          amount: input.tx.txValue.toString(),
          tokenAddress: Address32.NATIVE,
          requestId: input.tx.txData,
        })
      }
    }

    console.log('HELLO', input.tx.txFrom)
    if (input.tx.txFrom === RelaySolver32) {
      if (input.tx.txData.length === 2 + 64) {
        return TransferDst.create(input.tx, {
          amount: input.tx.txValue.toString(),
          tokenAddress: Address32.NATIVE,
          requestId: input.tx.txData,
        })
      }
    }
  }

  capture(input: LogToCapture) {
    const transfer = parseTransfer(input.log, null)
    if (transfer) {
      if (transfer.to === RelaySolver) {
        if (input.ctx.txData.length === 2 + 8 + 64 * 3) {
          return TransferSrc.create(input.ctx, {
            amount: transfer.value.toString(),
            tokenAddress: Address32.from(input.log.address),
            requestId: '0x' + input.ctx.txData.slice(-64),
          })
        }
      }

      if (transfer.from === RelaySolver) {
        if (input.ctx.txData.length === 2 + 8 + 64 * 3) {
          return TransferDst.create(input.ctx, {
            amount: transfer.value.toString(),
            tokenAddress: Address32.from(input.log.address),
            requestId: '0x' + input.ctx.txData.slice(-64),
          })
        }
      }
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
          srcAmount: transferDst.args.amount,
          srcTokenAddress: transferDst.args.tokenAddress,
          dstEvent: transferSrc,
          dstAmount: transferSrc.args.amount,
          dstTokenAddress: transferSrc.args.tokenAddress,
        }),
      ]
    }
  }
}
