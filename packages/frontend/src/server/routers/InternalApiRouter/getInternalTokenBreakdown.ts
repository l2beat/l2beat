import {
  type ChainConfig,
  type ProjectContract,
  ProjectService,
} from '@l2beat/config'
import { assert, ChainSpecificAddress, TokenId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import {
  type Address,
  extractAddressesFromTokenConfig,
} from '~/server/features/layer2s/tvs/breakdown/extractAddressesFromTokenConfig'
import { getTvsTargetTimestamp } from '~/server/features/layer2s/tvs/utils/getTvsTargetTimestamp'

/**
 * This endpoint is temporary - it serves as a source of data for our internal token spreadsheet.
 * It will be removed in the future and doesn't need to be ideal.
 */
export async function getInternalTokenBreakdown() {
  const db = getDb()
  const ps = new ProjectService()

  const targetTimestamp = getTvsTargetTimestamp()

  const [projects, projectsWithChainConfig, tokenValues] = await Promise.all([
    ps.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'contracts'],
    }),
    ps.getProjects({
      select: ['chainConfig'],
    }),
    db.tvsTokenValue.getAtOrBefore(targetTimestamp),
  ])

  const chains = projectsWithChainConfig.map((x) => x.chainConfig)

  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )

  const values: unknown[][] = []
  const headers: string[] = [
    'mode',
    'id',
    'priceId',
    'symbol',
    'name',
    'iconUrl',
    'chain',
    'bridgedUsing',
    'category',
    'source',
    'isAssociated',
    'timestamp',
    'configurationId',
    'amount',
    'value',
    'valueForProject',
    'valueForSummary',
    'priceUsd',
    'tokenId',
    'projectId',
    'addressAddress',
    'addressUrl',
    'addressName',
  ]

  for (const project of projects) {
    const projectTokens = project.tvsConfig

    for (const token of projectTokens) {
      const tokenValue = tokenValuesMap.get(token.id)
      if (!tokenValue) continue

      const addresses = extractAddressesFromTokenConfig(token)
      const address = processAddresses(addresses, chains)
      const project = projects.find((p) => p.id === tokenValue.projectId)
      assert(project, 'Project not found')

      const { amount: _, bridgedUsing, ...tokenn } = token
      const result = flatten(
        merge({
          token: tokenn,
          tokenValue,
          misc: {
            address,
            chain: project.name,
            bridgedUsing: bridgedUsing?.bridges.map((b) => b.name).join(', '),
          },
        }),
      )

      values.push(toCSV(result, headers))
    }
  }

  return {
    headers,
    values,
  }
}

function toCSV(data: Record<string, unknown>, headers: string[]) {
  return headers.map((h) => data[h])
}

// biome-ignore lint/suspicious/noExplicitAny: it can be anything
function merge(obj: Record<string, any>) {
  const result: Record<string, unknown> = {}

  for (const [superiorKey, superiorValue] of Object.entries(obj)) {
    for (const [key, value] of Object.entries(superiorValue)) {
      if (result[key]) {
        result[`${superiorKey}${capitalize(key)}`] = value
      } else {
        result[key] = value
      }
    }
  }

  return result
}

function flatten(data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const result: Record<string, unknown> = {}

  for (const key of keys) {
    if (typeof data[key] === 'object') {
      const flattened = flatten(data[key] as Record<string, unknown>)
      for (const [k, v] of Object.entries(flattened)) {
        result[`${key}${capitalize(k)}`] = v
      }
    } else {
      result[key] = data[key]
    }
  }
  return result
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function processAddresses(
  addresses: Address[],
  chains: ChainConfig[],
  projectContracts?: Record<string, ProjectContract[]>,
) {
  if (addresses.length > 1) {
    return 'multiple'
  }
  if (addresses.length === 1 && addresses[0]) {
    const address = addresses[0]
    const contractName = projectContracts?.[address.chain]?.find(
      (c) =>
        ChainSpecificAddress.address(c.address).toLowerCase() ===
        address.address.toLowerCase(),
    )?.name
    const explorer = chains.find((c) => c.name === address.chain)?.explorerUrl

    return {
      address: address.address,
      url: explorer ? `${explorer}/address/${address.address}` : undefined,
      name: contractName,
    }
  }
  return undefined
}
