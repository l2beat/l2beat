import { createHash } from 'crypto'
import * as fs from 'fs'
import { type Project, ProjectService } from '@l2beat/config'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import { extractPricesAndAmounts } from '../../modules/tvs/tools/extractPricesAndAmounts'
import type {
  AmountConfig,
  PriceConfig,
  ProjectTvsConfig,
} from '../../modules/tvs/types'
import type { TvsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvsConfig(
  ps: ProjectService,
  flags: FeatureFlags,
): Promise<TvsConfig> {
  const projectsWithTvl = await ps.getProjects({
    select: ['tvlConfig'],
  })

  // filter our projects disabled by flag
  const enabledProjects = projectsWithTvl.filter((p) =>
    flags.isEnabled('tvs', p.id),
  )

  // TODO be replaced by ProjectService
  const projects = readConfigs(enabledProjects).filter(
    (p) => p.tokens.length > 0,
  )

  const { amounts, prices, chains } = await getAmountsAndPrices(projects)

  return {
    projects,
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
): Promise<{
  chains: {
    name: string
    configurationId: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
  amounts: (AmountConfig & { project: string; chain?: string })[]
  prices: PriceConfig[]
}> {
  const chains = new Set<string>()
  const amounts = new Map<
    string,
    AmountConfig & { project: string; chain?: string }
  >()
  const prices = new Map<string, PriceConfig>()

  for (const project of projects) {
    const { amounts: projectAmounts, prices: projectPrices } =
      extractPricesAndAmounts(project)

    for (const amount of projectAmounts) {
      if (amount.type === 'balanceOfEscrow' || amount.type === 'totalSupply') {
        amounts.set(amount.id, {
          ...amount,
          project: project.projectId,
          chain: amount.chain,
        })
        chains.add(amount.chain)
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
  }

  console.log(chains)

  const chainConfigs = await new ProjectService().getProjects({
    select: ['chainConfig'],
  })

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
    chains: Array.from(chains.values()).map((c) => {
      const chain = chainConfigs.find((cc) => cc.id === c)
      assert(chain, `${c}: chainConfig not configured`)
      assert(chain.chainConfig.sinceTimestamp)

      return {
        name: c,
        configurationId: createHash('sha1')
          .update(`chain_${c}`)
          .digest('hex')
          .slice(0, 12),
        sinceTimestamp: chain.chainConfig.sinceTimestamp,
        untilTimestamp: chain.chainConfig.untilTimestamp,
      }
    }),
  }
}
