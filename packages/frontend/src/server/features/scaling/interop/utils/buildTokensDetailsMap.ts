import { getTokenDb } from '~/server/tokenDb'
import { manifest } from '~/utils/Manifest'

export type TokensDetailsMap = Map<string, TokensDetails>

export interface TokensDetails {
  symbol: string
  iconUrl: string
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
        iconUrl: t.iconUrl ?? manifest.getUrl('/images/token-placeholder.png'),
      },
    ]),
  )

  return tokensDetailsMap
}
