import {
  type AmountFormula,
  type CalculationFormula,
  type ChainConfig,
  type ProjectContract,
  ProjectService,
  type TvsToken,
  type ValueFormula,
} from '@l2beat/config'
import {
  assertUnreachable,
  ChainSpecificAddress,
  TokenId,
} from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '~/server/features/scaling/tvs/utils/getTvsTargetTimestamp'

const HEADERS = [
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
  'address',
  'addressUrl',
  'addressName',
  'RWA-isStablecoin',
  'RWA-isOnRWA',
  'RWA-categories',
]

/**
 * This endpoint is temporary - it serves as a source of data for our internal token spreadsheet.
 * It will be removed in the future and doesn't need to be ideal.
 */
export async function getInternalTokenBreakdown() {
  const db = getDb()
  const ps = new ProjectService()

  const targetTimestamp = getTvsTargetTimestamp()

  const [projects, projectsWithChainConfig, tokenValues, tokens] =
    await Promise.all([
      ps.getProjects({
        select: ['tvsConfig'],
        optional: ['chainConfig', 'contracts'],
      }),
      ps.getProjects({
        select: ['chainConfig'],
      }),
      db.tvsTokenValue.getAtOrBefore(targetTimestamp),
      ps.getTokens(),
    ])

  const chains = projectsWithChainConfig.map(({ chainConfig }) => chainConfig)

  const tokenValuesMap = new Map(
    tokenValues.map((t) => [TokenId(t.tokenId), t]),
  )
  const tokenRwaMetadataMap = new Map(
    tokens.map((t) => [t.symbol, t.rwaMetadata]),
  )

  const values: unknown[][] = []

  for (const project of projects) {
    for (const token of project.tvsConfig) {
      const tokenValue = tokenValuesMap.get(token.id)

      if (!tokenValue) {
        continue
      }

      const addresses = extractAddressesFromTokenConfig(token)

      const address = processAddresses(
        addresses,
        chains,
        project.contracts?.addresses,
      )

      const tokenMetadata = tokenRwaMetadataMap.get(token.symbol)

      values.push([
        token.mode,
        token.id,
        token.priceId,
        token.symbol,
        token.name,
        token.iconUrl,
        project.name,
        token.bridgedUsing?.bridges.map((b) => b.name).join(', '),
        token.category,
        token.source,
        token.isAssociated,
        tokenValue.timestamp,
        tokenValue.configurationId,
        tokenValue.amount,
        tokenValue.value,
        tokenValue.valueForProject,
        tokenValue.valueForSummary,
        tokenValue.priceUsd,
        token.id,
        tokenValue.projectId,
        address === 'multiple' ? address : address?.address,
        address === 'multiple' ? address : address?.url,
        address === 'multiple' ? address : address?.name,
        tokenMetadata?.isStablecoin,
        tokenMetadata?.isOnRWA,
        tokenMetadata?.categories?.join(', '),
      ])
    }
  }

  return {
    headers: HEADERS,
    values,
  }
}

type Address = {
  address: string
  chain: string
}

function extractAddressesFromTokenConfig(token: TvsToken): Address[] {
  if (!token.amount) {
    return []
  }

  const addresses = collectAddressesFromFormula(token.amount)

  return uniqBy(addresses, 'address')
}

function collectAddressesFromFormula(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): Address[] {
  const addresses: Address[] = []

  switch (formula.type) {
    case 'calculation':
      formula.arguments.forEach((arg) => {
        const result = collectAddressesFromFormula(arg)
        addresses.push(...result)
      })
      break
    case 'balanceOfEscrow':
      if (formula.address !== 'native') {
        addresses.push({
          address: formula.address,
          chain: formula.chain,
        })
      }

      break
    case 'totalSupply':
    case 'starknetTotalSupply':
    case 'circulatingSupply':
      if (formula.address !== 'native') {
        addresses.push({
          address: formula.address,
          chain: formula.chain,
        })
      }
      break
    case 'const':
    case 'value':
      // These types don't contain addresses
      break
    default:
      assertUnreachable(formula)
  }

  return addresses
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
