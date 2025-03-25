import * as fs from 'fs'
import { type Project, ProjectService } from '@l2beat/config'
import { assert, type UnixTime, notUndefined } from '@l2beat/shared-pure'
import { CirculatingSupplyAmountIndexer } from '../../modules/tvs/indexers/CirculatingSupplyAmountIndexer'
import { extractPricesAndAmounts } from '../../modules/tvs/tools/extractPricesAndAmounts'
import { getEffectiveConfig } from '../../modules/tvs/tools/getEffectiveConfig'
import type {
  AmountConfig,
  BlockTimestampConfig,
  PriceConfig,
  ProjectTvsConfig,
} from '../../modules/tvs/types'
import type { TvsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvsConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  sinceTimestamp?: number,
): Promise<TvsConfig> {
  const projectsWithTvl = await ps.getProjects({
    select: ['tvlConfig'],
  })

  // filter our projects disabled by flag
  const enabledProjects = projectsWithTvl.filter((p) =>
    flags.isEnabled('tvs', p.id),
  )

  // TODO be replaced by ProjectService
  let projects = readConfigs(enabledProjects).filter((p) => p.tokens.length > 0)

  // sinceTimestamp override for local development
  if (sinceTimestamp) {
    projects = projects.map((p) => ({
      projectId: p.projectId,
      tokens: getEffectiveConfig(p.tokens, sinceTimestamp),
    }))
  }

  const { amounts, prices, chains } = await getAmountsAndPrices(
    projects,
    sinceTimestamp,
  )

  const projectsWithSources = projects.map((p) => {
    const amountChains = amounts
      .filter((a) => a.project === p.projectId)
      .map((a) => {
        switch (a.type) {
          case 'circulatingSupply':
            return CirculatingSupplyAmountIndexer.SOURCE
          case 'balanceOfEscrow':
          case 'totalSupply':
            return a.chain
          case 'const':
            return undefined
        }
      })
      .filter(notUndefined)

    return { ...p, amountSources: Array.from(new Set(amountChains).values()) }
  })

  return {
    projects: projectsWithSources,
    amounts,
    prices,
    chains,
  }
}

export function readConfigs(
  projects: Project<'tvlConfig'>[],
): ProjectTvsConfig[] {
  const projectConfigs: ProjectTvsConfig[] = []

  for (const project of projects) {
    const fileName = project.id.replace(/[=;]+/g, '')
    const filePath = `./src/modules/tvs/config/${fileName}.json`

    if (!fs.existsSync(filePath)) {
      continue
    }

    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    projectConfigs.push({
      projectId: project.id,
      tokens: json.tokens,
    })
  }

  return projectConfigs
}

export async function getAmountsAndPrices(
  projects: ProjectTvsConfig[],
  sinceTimestamp?: UnixTime,
): Promise<{
  amounts: (AmountConfig & { project: string; chain?: string })[]
  prices: PriceConfig[]
  chains: BlockTimestampConfig[]
}> {
  const amounts = new Map<
    string,
    AmountConfig & { project: string; chain?: string }
  >()
  const prices = new Map<string, PriceConfig>()
  const chains: Map<string, BlockTimestampConfig> = new Map()

  const chainConfigs = await new ProjectService().getProjects({
    select: ['chainConfig'],
  })

  for (const project of projects) {
    const {
      amounts: projectAmounts,
      prices: projectPrices,
      chains: projectChains,
    } = extractPricesAndAmounts(project, chainConfigs)
    for (const amount of projectAmounts) {
      if (amount.type === 'balanceOfEscrow' || amount.type === 'totalSupply') {
        amounts.set(amount.id, {
          ...amount,
          project: project.projectId,
          chain: amount.chain,
        })
      } else {
        amounts.set(amount.id, {
          ...amount,
          project: project.projectId,
        })
      }
    }

    for (const price of projectPrices) {
      prices.set(price.priceId, price)
    }

    assert(projectChains)
    for (const chain of projectChains) {
      chains.set(chain.chainName, chain)
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
    chains: sinceTimestamp
      ? Array.from(chains.values()).map((c) => ({
          ...c,
          sinceTimestamp,
        }))
      : Array.from(chains.values()),
  }
}
