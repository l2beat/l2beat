import type { ChainConfig, Project } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { categoryToLabel } from '~/pages/layer2s/project/tvs-breakdown/components/tables/categoryToLabel'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import {
  getSyncedTvsTimestamp,
  getTvsSyncMetadata,
} from '../utils/getSyncedTvsTimestamp'
import { sourceToLabel } from '../utils/sourceToLabel'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'
import type { ProjectTvsBreakdownTokenEntry } from './getProjectTokensEntries'
import {
  getSyncStatus,
  processAddresses,
  withExplorerUrl,
} from './tokenEntryHelpers'

export interface TvsBreakdownTokenEntry extends ProjectTvsBreakdownTokenEntry {
  projectName: string
}

export async function getAllTokensEntries(): Promise<TvsBreakdownTokenEntry[]> {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData()
  }
  const [allProjects, syncMetadata] = await Promise.all([
    ps.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'contracts'],
    }),
    getTvsSyncMetadata(),
  ])

  const db = getDb()
  const targetTimestamp = getSyncedTvsTimestamp(
    syncMetadata,
    allProjects.flatMap((p) => p.tvsConfig),
  )

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

      const addresses = extractAddressesFromTokenConfig(token)
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
        iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        priceUsd: { value: tokenValue.priceUsd },
        valueForProject: { value: tokenValue.valueForProject },
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

      entries.push(tokenWithValues)
    }
  }

  return entries.sort(
    (a, b) => b.valueForProject.value - a.valueForProject.value,
  )
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
