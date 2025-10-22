/* RELAY

This is an experimental plugin for the RELAY protocol. It checks
deposits to the solver on SRC and deposits from the solver on DST
and matches them based on the additional requestId hidden in the 
calldata

*/

import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export const RelayTransferOut = createInteropEventType<{
  from: string
  to: string
  value: string
  requestId?: string
}>('relay-simple.TransferOut')

export const RelayTransferIn = createInteropEventType<{
  from: string
  to: string
  value: string
  requestId?: string
}>('relay-simple.TransferIn')

export class RelaySimplePlugIn implements InteropPlugin {
  name = 'relay-simple'

  capture(input: LogToCapture) {
    const transfer = parseTransfer(input.log, null)
    if (transfer) {
      if (
        transfer.to ===
        EthereumAddress('0xf70da97812CB96acDF810712Aa562db8dfA3dbEF')
      ) {
        console.log(input)
        return RelayTransferOut.create(input.ctx, {
          from: transfer.from,
          to: transfer.to,
          value: transfer.value.toString(),
          requestId: input.log.data.slice(66, 98), // third 32 bytes of calldata
        })
      }

      if (
        transfer.from ===
        EthereumAddress('0xf70da97812CB96acDF810712Aa562db8dfA3dbEF')
      ) {
        return RelayTransferIn.create(input.ctx, {
          from: transfer.from,
          to: transfer.to,
          value: transfer.value.toString(),
          requestId: input.log.data.slice(66, 98), // third 32 bytes of calldata
        })
      }
    }
  }

  matchTypes = [RelayTransferOut, RelayTransferIn]
  match(
    relayTransferIn: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (RelayTransferIn.checkType(relayTransferIn)) {
      const relayTransferOut = db.find(RelayTransferOut, {
        requestId: relayTransferIn.args.requestId,
      })
      if (relayTransferOut) {
        return [
          Result.Message('relay-simple.ERC20Transfer', {
            app: 'unknown',
            srcEvent: relayTransferOut,
            dstEvent: relayTransferIn,
          }),
        ]
      }
    }
  }
}
