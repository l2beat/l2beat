import {
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type MatchResult,
  Result,
} from '../types'
import { TokenReceived, TokenSent } from './relay.indexer'

export class RelayPlugin implements InteropPlugin {
  readonly name = 'relay'

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
        srcAmount: tokenSent.args.amount
          ? BigInt(tokenSent.args.amount)
          : undefined,
        srcTokenAddress: tokenSent.args.token,
        srcWasBurned: false,
        dstEvent: tokenReceived,
        dstAmount: tokenReceived.args.amount
          ? BigInt(tokenReceived.args.amount)
          : undefined,
        dstTokenAddress: tokenReceived.args.token,
        dstWasMinted: false,
      }),
    ]
  }
}
