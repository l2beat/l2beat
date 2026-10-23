import type { ChainConfig, Project, TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { env } from '~/env'
import { categoryToLabel } from '~/pages/layer2s/project/tvs-breakdown/components/tables/categoryToLabel'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import {
  calculatePercentageChange,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import {
  getSyncedTvsTimestamp,
  getTvsSyncMetadata,
} from '../utils/getSyncedTvsTimestamp'
import { sourceToLabel } from '../utils/sourceToLabel'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'
import {
  type AddressData,
  type FormulaWithMeta,
  getSyncStatus,
  processAddresses,
  withExplorerUrl,
} from './tokenEntryHelpers'

export interface ProjectTvsBreakdownTokenEntry extends FilterableEntry {
  id: TvsToken['id']
  name: string
  symbol: TvsToken['symbol']
  iconUrl: string
  valueForProject: {
    value: number
    change?: number
    changePeriod?: PercentageChangePeriod
  }
  value: number
  amount: number
  priceUsd: {
    value: number
    change?: number
    changePeriod?: PercentageChangePeriod
  }
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
  const targetTimestamp = getSyncedTvsTimestamp(
    await getTvsSyncMetadata(),
    project.tvsConfig,
  )
  const sevenDaysAgoTargetTimestamp = targetTimestamp - 7 * UnixTime.DAY

  const [projects, tokenValues, sevenDaysAgoTokenValues] = await Promise.all([
    ps.getProjects({
      select: ['chainConfig'],
    }),
    db.tvsTokenValue.getByProjectAtOrBefore(project.id, targetTimestamp),
    db.tvsTokenValue.getByProjectAtOrBefore(
      project.id,
      sevenDaysAgoTargetTimestamp,
    ),
  ])

  const chains = projects.map((x) => x.chainConfig)
  const tokenValuesMap = new Map(
    tokenValues.map((x) => [TokenId(x.tokenId), x]),
  )
  const sevenDaysAgoTokenValuesMap = new Map(
    sevenDaysAgoTokenValues.map((x) => [TokenId(x.tokenId), x]),
  )

  const entries = getEntries(
    project,
    tokenValuesMap,
    sevenDaysAgoTokenValuesMap,
    chains,
    targetTimestamp,
  )

  return entries
}

function getEntries(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
  tokenValuesMap: Map<TokenId, TokenValueRecord>,
  sevenDaysAgoTokenValuesMap: Map<TokenId, TokenValueRecord>,
  chains: ChainConfig[],
  targetTimestamp: UnixTime,
) {
  const breakdown: ProjectTvsBreakdownTokenEntry[] = []

  const projectTokens = project.tvsConfig
  const gasTokens = project.chainConfig?.gasTokens

  for (const token of projectTokens) {
    const tokenValue = tokenValuesMap.get(token.id)
    if (!tokenValue) continue

    const addresses = extractAddressesFromTokenConfig(token)
    const address = processAddresses(
      addresses,
      chains,
      project.contracts?.addresses,
    )

    // Only compute change when we have a record exactly seven days before the current record's timestamp
    const sevenDaysAgoTokenValue = sevenDaysAgoTokenValuesMap.get(token.id)
    const matchedSevenDaysAgo =
      sevenDaysAgoTokenValue &&
      sevenDaysAgoTokenValue.timestamp ===
        tokenValue.timestamp - 7 * UnixTime.DAY
        ? sevenDaysAgoTokenValue
        : undefined

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
      iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      priceUsd: {
        value: tokenValue.priceUsd,
        changePeriod: '7D',
        change: matchedSevenDaysAgo
          ? calculatePercentageChange(
              tokenValue.priceUsd,
              matchedSevenDaysAgo.priceUsd,
            )
          : undefined,
      },
      valueForProject: {
        value: tokenValue.valueForProject,
        changePeriod: '7D',
        change: matchedSevenDaysAgo
          ? calculatePercentageChange(
              tokenValue.valueForProject,
              matchedSevenDaysAgo.valueForProject,
            )
          : undefined,
      },
      value: tokenValue.value,
      amount: tokenValue.amount,
      isGasToken: gasTokens?.includes(token.symbol.toUpperCase()),
      syncStatus: getSyncStatus(tokenValue.timestamp, targetTimestamp),
      bridgedUsing: token.bridgedUsing,
      filterable: [
        {
          id: 'bridgingType',
          value: sourceToLabel(token.source),
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

  return breakdown.sort(
    (a, b) => b.valueForProject.value - a.valueForProject.value,
  )
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

  const entries = getEntries(
    project,
    tokenValuesMap,
    new Map(),
    chains,
    UnixTime.now(),
  )

  return entries
}
