import {
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type MatchResult,
  Result,
} from '../types'
import {
  TokenReceived,
  type TokenReceivedArgs,
  TokenSent,
  type TokenSentArgs,
} from './relay.indexer'

export class RelayPlugin implements InteropPlugin {
  readonly name = 'relay'

  constructor(private oneSidedChains: string[] = []) {}

  matchTypes = [TokenReceived, TokenSent]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (TokenReceived.checkType(event)) {
      return this.matchReceived(event, db)
    }

    if (TokenSent.checkType(event)) {
      return this.matchSent(event, db)
    }
  }

  private matchReceived(
    tokenReceived: InteropEvent<TokenReceivedArgs>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const tokenSent = db.find(TokenSent, { id: tokenReceived.args.id })
    if (!tokenSent) {
      const srcChain = tokenReceived.args.$srcChain
      if (!this.oneSidedChains.includes(srcChain)) return

      return [
        Result.Transfer('relay.Transfer', {
          srcChain,
          dstEvent: tokenReceived,
          dstAmount: tokenReceived.args.amount
            ? BigInt(tokenReceived.args.amount)
            : undefined,
          dstTokenAddress: tokenReceived.args.token,
          dstWasMinted: false,
        }),
      ]
    }

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

  private matchSent(
    tokenSent: InteropEvent<TokenSentArgs>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const dstChain = tokenSent.args.$dstChain
    if (!this.oneSidedChains.includes(dstChain)) return

    const hasCounterpart = db.find(TokenReceived, { id: tokenSent.args.id })
    if (hasCounterpart) return

    return [
      Result.Transfer('relay.Transfer', {
        srcEvent: tokenSent,
        dstChain,
        srcAmount: tokenSent.args.amount
          ? BigInt(tokenSent.args.amount)
          : undefined,
        srcTokenAddress: tokenSent.args.token,
        srcWasBurned: false,
      }),
    ]
  }
}
