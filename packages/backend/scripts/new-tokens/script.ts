import { ProjectService } from '@l2beat/config'
import type { LegacyToken, UnixTime } from '@l2beat/shared-pure'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type AbstractTokenId = `${string}:${string}.${string}`
type DeployedTokenId = `${string}+${string}`

interface AbstractToken {
  id: AbstractTokenId
  iconUrl?: string
  coingeckoId?: string
  coingeckoListingTimestamp?: UnixTime
  deployedTokens: DeployedTokenId[]
  category?: string
}

interface DeployedToken {
  id: DeployedTokenId
  symbol: string
  decimals: number
  deploymentTimestamp?: UnixTime
}

interface Output {
  ignored: DeployedTokenId[]
  abstractTokens: AbstractToken[]
  deployedTokens: DeployedToken[]
}

async function main() {
  const ps = new ProjectService()
  const tokens = await ps.getTokens()
  const out: Output = JSON.parse(
    readFileSync(join(__dirname, 'out.json'), 'utf-8'),
  )

  const assigned = new Set<string>()
  for (const abstract of out.abstractTokens) {
    for (const id of abstract.deployedTokens ?? []) {
      if (assigned.has(id)) {
        console.log('DUPLICATE ASSIGNMENT', id)
      } else {
        assigned.add(id)
      }
    }
  }

  const known = new Set<string>()
  for (const id of out.ignored) {
    known.add(id)
  }
  for (const deployed of out.deployedTokens) {
    known.add(deployed.id)
    if (!assigned.has(deployed.id)) {
      console.log('UNASSIGNED DEPLOYED', deployed.id)
    }
  }

  for (const abstract of out.abstractTokens) {
    const relevant = tokens.filter(
      (x) => x.coingeckoId === abstract.coingeckoId,
    )
    for (const token of relevant) {
      const id = `${token.chainName}+${token.address ?? 'native'}`
      if (known.has(id)) {
        continue
      }
      const deployed = createDeployedToken(token, abstract)
      known.add(deployed.id)
      addToken(out, deployed, abstract)
    }
  }

  for (const token of tokens) {
    const id = `${token.chainName}+${token.address ?? 'native'}`
    if (!known.has(id)) {
      let abstract = out.abstractTokens.find(
        (x) => x.coingeckoId === token.coingeckoId,
      )
      if (!abstract) {
        abstract = createAbstractToken(token)
        out.abstractTokens.push(abstract)
      }

      const deployed = createDeployedToken(token, abstract)
      known.add(deployed.id)
      addToken(out, deployed, abstract)
    }
  }

  out.abstractTokens.sort((a, b) => {
    const diff = b.deployedTokens?.length - a.deployedTokens?.length
    if (diff !== 0) {
      return diff
    }
    return (
      (a.coingeckoListingTimestamp ?? Number.POSITIVE_INFINITY) -
      (b.coingeckoListingTimestamp ?? Number.POSITIVE_INFINITY)
    )
  })

  const humanIds = new Set<string>()
  for (const abstract of out.abstractTokens) {
    abstract.deployedTokens.sort()

    const humanId = abstract.id.slice(7)
    if (humanIds.has(humanId)) {
      console.log('Duplicate abstract id', humanId)
    }
    humanIds.add(humanId)
  }

  out.deployedTokens.sort((a, b) => a.id.localeCompare(b.id))

  writeFileSync(
    join(__dirname, 'out.json'),
    JSON.stringify(out, null, 2),
    'utf-8',
  )
}

function addToken(
  out: Output,
  deployed: DeployedToken,
  abstract: AbstractToken,
) {
  out.deployedTokens.push(deployed)
  abstract.deployedTokens ??= []
  abstract.deployedTokens.push(deployed.id)
}

function randomId() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length: 6 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
}

function createAbstractToken(token: LegacyToken): AbstractToken {
  const abstract: AbstractToken = {
    id: `${randomId()}:unknown.${token.symbol}`,
    coingeckoId: token.coingeckoId,
    coingeckoListingTimestamp: token.coingeckoListingTimestamp,
    category: token.category,
    iconUrl: token.iconUrl,
    deployedTokens: [],
  }
  console.log('New abstract token', JSON.stringify(abstract, null, 2))
  return abstract
}

function createDeployedToken(
  token: LegacyToken,
  abstract: AbstractToken,
): DeployedToken {
  console.log('For abstract', abstract.id)
  const deployed: DeployedToken = {
    id: `${token.chainName}+${token.address ?? 'native'}`,
    decimals: token.decimals,
    symbol: token.symbol,
    deploymentTimestamp: token.deploymentTimestamp,
  }
  console.log('New deployed token', JSON.stringify(deployed, null, 2))
  return deployed
}

main()
