import * as fs from 'fs'
import type { Project, ProjectService } from '@l2beat/config'
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

  const { amounts, prices } = getAmountsAndPrices(projects)

  return {
    projects,
    amounts,
    prices,
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

export function getAmountsAndPrices(projects: ProjectTvsConfig[]): {
  amounts: AmountConfig[]
  prices: PriceConfig[]
} {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const project of projects) {
    const { amounts: projectAmounts, prices: projectPrices } =
      extractPricesAndAmounts(project)

    for (const amount of projectAmounts) {
      amounts.set(amount.id, amount)
    }

    for (const price of projectPrices) {
      prices.set(price.priceId, price)
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
  }
}
