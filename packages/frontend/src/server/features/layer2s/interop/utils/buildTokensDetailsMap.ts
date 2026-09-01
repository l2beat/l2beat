import { unique } from '@l2beat/shared-pure'
import { getTokenDb } from '~/server/tokenDb'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { AggregatedInteropTransferWithTokens } from '../types'

export type TokensDetailsMap = Map<string, TokensDetails>

export interface TokensDetails {
  symbol: string
  iconUrl: string
  issuer: string | null
}

export async function buildTokensDetailsMap(abstractTokenIds: string[]) {
  const tokenDb = getTokenDb()

  const tokensDetailsData =
    await tokenDb.abstractToken.getByIds(abstractTokenIds)
  const tokensDetailsMap = new Map<string, TokensDetails>(
    tokensDetailsData.map((t) => [
      t.id,
      {
        ...t,
        iconUrl: t.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      },
    ]),
  )

  return tokensDetailsMap
}

export async function buildTokensDetailsMapForRecords(
  records: AggregatedInteropTransferWithTokens[],
) {
  return await buildTokensDetailsMap(
    unique(
      records.flatMap((record) =>
        record.tokens.map((token) => token.abstractTokenId),
      ),
    ),
  )
}
