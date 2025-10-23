import {
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type MatchResult,
  Result,
} from '../types'
import { TokenReceived, TokenSent } from './relay.indexer'

export class RelayPlugin implements InteropPlugin {
  name = 'relay'

  matchTypes = [TokenReceived]
  match(
    tokenReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!TokenReceived.checkType(tokenReceived)) return

    const tokenSent = db.find(TokenSent, { id: tokenReceived.args.id })
    if (!tokenSent) return

    return [
      Result.Message('relay.Message', {
        app: 'relay',
        srcEvent: tokenSent,
        dstEvent: tokenReceived,
      }),
      Result.Transfer('relay.Transfer', {
        srcEvent: tokenSent,
        srcAmount: tokenSent.args.amount,
        srcTokenAddress: tokenSent.args.token,
        dstEvent: tokenReceived,
        dstAmount: tokenReceived.args.amount,
        dstTokenAddress: tokenReceived.args.token,
      }),
    ]
  }
}
