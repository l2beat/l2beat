import type {
  ChainConfig,
  Formula,
  Project,
  ProjectContract,
  TvsToken,
} from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import {
  assertUnreachable,
  ChainSpecificAddress,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import capitalize from 'lodash/capitalize'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { env } from '~/env'
import { categoryToLabel } from '~/pages/scaling/project/tvs-breakdown/components/tables/categoryToLabel'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { formatTimestamp } from '~/utils/dates'
import { getTvsTargetTimestamp } from '../utils/getTvsTargetTimestamp'
import {
  type Address,
  extractAddressesFromTokenConfig,
} from './extractAddressesFromTokenConfig'

type AddressData = {
  address: string
  url?: string
  name?: string
}

export interface ProjectTvsBreakdownTokenEntry extends FilterableEntry {
  id: TvsToken['id']
  name: string
  symbol: TvsToken['symbol']
  iconUrl: string
  valueForProject: number
  value: number
  amount: number
  priceUsd: number
  category: TvsToken['category']
  source: TvsToken['source']
  isAssociated: TvsToken['isAssociated']
  isGasToken?: boolean
  address?: AddressData | 'multiple'
  formula: FormulaWithMeta
  syncStatus?: string
  bridgedUsing?: {
    bridges: {
      name: string
      slug?: string
    }[]
    warning?: string
  }
}

export async function getProjectTokensEntries(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
): Promise<ProjectTvsBreakdownTokenEntry[]> {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData(project)
  }

  const db = getDb()
  const targetTimestamp = getTvsTargetTimestamp()

  const [projects, tokenValues] = await Promise.all([
    ps.getProjects({
      select: ['chainConfig'],
    }),
    db.tvsTokenValue.getByProjectAtOrBefore(project.id, targetTimestamp),
  ])

  const chains = projects.map((x) => x.chainConfig)
  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )

  const entries = getEntries(project, tokenValuesMap, chains, targetTimestamp)

  return entries
}

function getEntries(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
) {
  const breakdown: ProjectTvsBreakdownTokenEntry[] = []

  const projectTokens = project.tvsConfig
  const gasTokens = project.chainConfig?.gasTokens

  for (const token of projectTokens) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    const { addresses } = extractAddressesFromTokenConfig(token)
    const address = processAddresses(
      addresses,
      chains,
      project.contracts?.addresses,
    )

    const tokenWithValues: ProjectTvsBreakdownTokenEntry = {
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      category: token.category,
      source: token.source,
      isAssociated: token.isAssociated,
      address,
      formula: withExplorerUrl(
        token.valueForProject ?? token.amount,
        chains,
        project.contracts?.addresses,
      ),
      iconUrl: token.iconUrl ?? '',
      priceUsd: tokenValue.priceUsd,
      valueForProject: tokenValue.valueForProject,
      value: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
      syncStatus: getSyncStatus(tokenValue.timestamp, targetTimestamp),
      bridgedUsing: token.bridgedUsing,
      filterable: [
        {
          id: 'bridgingType',
          value: capitalize(token.source),
        },
        ...(token.bridgedUsing?.bridges.map(
          (b) =>
            ({
              id: 'bridgedUsing',
              value: b.name,
            }) as const,
        ) ?? []),
        {
          id: 'category',
          value: categoryToLabel(token.category),
        },
      ],
    }

    breakdown.push(tokenWithValues)
  }

  return breakdown.sort((a, b) => +b.valueForProject - +a.valueForProject)
}

// Ik its ugly but it works and is type safe
type FormulaWithMeta =
  | (Extract<Formula, { type: 'balanceOfEscrow' }> & {
      addressMeta: AddressData
      escrowAddressMeta: AddressData
    })
  | (Omit<Extract<Formula, { type: 'calculation' }>, 'arguments'> & {
      arguments: FormulaWithMeta[]
    })
  | (Extract<
      Formula,
      { type: 'circulatingSupply' | 'totalSupply' | 'starknetTotalSupply' }
    > & {
      addressMeta: AddressData
    })
  | (Omit<Extract<Formula, { type: 'value' }>, 'amount'> & {
      amount: FormulaWithMeta
    })
  | Extract<Formula, { type: 'const' }>

function withExplorerUrl(
  formula: Formula,
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): FormulaWithMeta {
  switch (formula.type) {
    case 'balanceOfEscrow': {
      return {
        ...formula,
        escrowAddressMeta: processAddress(
          {
            address: formula.escrowAddress,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
        addressMeta: processAddress(
          {
            address: formula.address,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
      }
    }
    case 'calculation':
      return {
        ...formula,
        arguments: formula.arguments.map((arg) =>
          withExplorerUrl(arg, chains, projectContracts),
        ),
      }
    case 'circulatingSupply':
    case 'totalSupply':
    case 'starknetTotalSupply': {
      return {
        ...formula,
        addressMeta: processAddress(
          {
            address: formula.address,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
      }
    }
    case 'value':
      return {
        ...formula,
        amount: withExplorerUrl(formula.amount, chains, projectContracts),
      }
    case 'const':
      return formula
    default:
      assertUnreachable(formula)
  }
}

function processAddresses(
  addresses: Address[],
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): AddressData | 'multiple' | undefined {
  if (addresses.length > 1) {
    return 'multiple'
  }
  if (addresses.length === 1 && addresses[0]) {
    const address = addresses[0]
    return processAddress(address, chains, projectContracts)
  }
  return undefined
}

function processAddress(
  address: Address,
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): AddressData {
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

function getSyncStatus(valueTimestamp: UnixTime, targetTimestamp: UnixTime) {
  if (valueTimestamp < targetTimestamp) {
    return `No token data since ${formatTimestamp(valueTimestamp, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }
}

async function getMockTvsBreakdownForProjectData(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
): Promise<ProjectTvsBreakdownTokenEntry[]> {
  const projects = await ps.getProjects({
    select: ['chainConfig'],
  })
  const chains = projects.map((x) => x.chainConfig)

  const tokenValuesMap = new Map<TokenId, TokenValueRecord>(
    project.tvsConfig.map(
      (t) =>
        [
          TokenId(t.id),
          {
            timestamp: UnixTime.now(),
            configurationId: 'any',
            projectId: project.id,
            tokenId: TokenId('1'),
            valueForProject: 100,
            valueForSummary: 100,
            value: 100,
            amount: 100,
            priceUsd: 10,
          },
        ] as const,
    ),
  )

  const entries = getEntries(project, tokenValuesMap, chains, UnixTime.now())

  return entries
}
