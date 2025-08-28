import type {
  ChainConfig,
  Formula,
  Project,
  ProjectContract,
} from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import {
  assertUnreachable,
  ChainSpecificAddress,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import capitalize from 'lodash/capitalize'
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
import type { ProjectTvsBreakdownTokenEntry } from './getProjectTokensEntries'

type AddressData = {
  address: string
  url?: string
  name?: string
}

export interface TvsBreakdownTokenEntry extends ProjectTvsBreakdownTokenEntry {
  projectName: string
}

export async function getAllTokensEntries(): Promise<TvsBreakdownTokenEntry[]> {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData()
  }
  const allProjects = await ps.getProjects({
    select: ['tvsConfig'],
    optional: ['chainConfig', 'contracts'],
  })

  const db = getDb()
  const targetTimestamp = getTvsTargetTimestamp()

  const [projects, tokenValues] = await Promise.all([
    ps.getProjects({
      select: ['chainConfig'],
    }),
    db.tvsTokenValue.getAtOrBefore(targetTimestamp),
  ])

  const chains = projects.map((x) => x.chainConfig)
  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )

  const entries = getEntries(
    allProjects,
    tokenValuesMap,
    chains,
    targetTimestamp,
  )

  return entries
}

function getEntries(
  projects: Project<'tvsConfig', 'chainConfig' | 'contracts'>[],
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
) {
  const entries: TvsBreakdownTokenEntry[] = []

  for (const project of projects) {
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

      const projectName = project.shortName ?? project.name

      const tokenWithValues: TvsBreakdownTokenEntry = {
        id: token.id,
        name: token.name,
        projectName,
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
            id: 'project',
            value: projectName,
          },
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

      entries.push(tokenWithValues)
    }
  }

  return entries.sort((a, b) => +b.valueForProject - +a.valueForProject)
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

async function getMockTvsBreakdownForProjectData(): Promise<
  TvsBreakdownTokenEntry[]
> {
  const projects = await ps.getProjects({
    select: ['tvsConfig'],
    optional: ['chainConfig', 'contracts'],
  })
  const chains = projects
    .map((x) => x.chainConfig)
    .filter((e) => e !== undefined)

  const tokenValuesMap = new Map<TokenId, TokenValueRecord>(
    projects.flatMap((p) =>
      p.tvsConfig.map(
        (t) =>
          [
            TokenId(t.id),
            {
              timestamp: UnixTime.now(),
              configurationId: 'any',
              projectId: p.id,
              priceUsd: 50,
              tokenId: TokenId('1'),
              valueForProject: 100,
              valueForSummary: 100,
              value: 100,
              amount: 100,
            },
          ] as const,
      ),
    ),
  )

  const entries = getEntries(projects, tokenValuesMap, chains, UnixTime.now())

  return entries
}
