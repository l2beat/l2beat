import type { Branded } from '@l2beat/shared-pure'
import mockData from './TokenDbMockData.json'

type AbstractTokenId = Branded<string, 'AbstractTokenId'>

function AbstractTokenId(id: string) {
  return id as AbstractTokenId
}

AbstractTokenId.from = function from(
  realId: string,
  issuer: string,
  symbol: string,
) {
  return `${realId}:${issuer}:${symbol}`
}

AbstractTokenId.realId = function readId(id: AbstractTokenId) {
  return id.slice(0, 6)
}

AbstractTokenId.issuer = function issuer(id: AbstractTokenId) {
  const withoutRealId = id.slice(7)
  return withoutRealId.slice(0, withoutRealId.indexOf(':'))
}

AbstractTokenId.symbol = function symbol(id: AbstractTokenId) {
  const withoutRealId = id.slice(7)
  return withoutRealId.slice(withoutRealId.indexOf(':') + 1)
}

type DeployedTokenId = Branded<string, 'AbstractTokenId'>

function DeployedTokenId(id: string) {
  return id as DeployedTokenId
}

DeployedTokenId.from = function from(chain: string, address: string) {
  return `${chain}+${address}` as DeployedTokenId
}

DeployedTokenId.chain = function chain(id: DeployedTokenId) {
  return id.slice(0, id.indexOf('+'))
}

DeployedTokenId.address = function address(id: DeployedTokenId) {
  return id.slice(id.indexOf('+') + 1)
}

export interface ITokenDb {
  getPriceInfo(deployedTokens: DeployedTokenId[]): Promise<
    Record<
      DeployedTokenId,
      {
        abstractId: AbstractTokenId
        coingeckoId: string | undefined
      }
    >
  >
}

const map = new Map<
  DeployedTokenId,
  { abstractId: AbstractTokenId; coingeckoId: string | undefined }
>()
for (const abstractToken of mockData.tokens) {
  for (const deployedId of abstractToken.deployed) {
    map.set(DeployedTokenId(deployedId), {
      abstractId: AbstractTokenId(abstractToken.abstractId),
      coingeckoId: abstractToken.coingeckoId,
    })
  }
}

export class MockTokenDb implements ITokenDb {
  async getPriceInfo(
    deployedTokens: DeployedTokenId[],
  ): Promise<
    Record<
      DeployedTokenId,
      { abstractId: AbstractTokenId; coingeckoId: string | undefined }
    >
  > {
    await new Promise((r) => setTimeout(r, 1000))
    const out: Record<
      DeployedTokenId,
      { abstractId: AbstractTokenId; coingeckoId: string | undefined }
    > = {}
    for (const id of deployedTokens) {
      const priceInfo = map.get(id)
      if (priceInfo) {
        out[id] = priceInfo
      }
    }
    return out
  }
}
