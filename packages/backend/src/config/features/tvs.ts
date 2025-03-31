import * as fs from 'fs'
import { type Project, ProjectService } from '@l2beat/config'
import { assert, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { CirculatingSupplyAmountIndexer } from '../../modules/tvs/indexers/CirculatingSupplyAmountIndexer'
import {
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../../modules/tvs/tools/extractPricesAndAmounts'
import { getEffectiveConfig } from '../../modules/tvs/tools/getEffectiveConfig'
import type { ProjectTvsConfig } from '../../modules/tvs/types'
import type { TvsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvsConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  sinceTimestamp?: number,
): Promise<TvsConfig> {
  const projectsWithTvs = await ps.getProjects({
    select: ['tvsConfig'],
  })

  // filter our projects disabled by flag
  const enabledProjects = projectsWithTvs.filter((p) =>
    flags.isEnabled('tvs', p.id),
  )

  let projects = enabledProjects.map((p) => ({
    projectId: p.id,
    tokens: p.tvsConfig,
  }))

  // sinceTimestamp override for local development
  if (sinceTimestamp) {
    projects = projects.map((p) => ({
      projectId: p.projectId,
      tokens: getEffectiveConfig(p.tokens, sinceTimestamp),
    }))
  }

  // It is very important to pass ALL PROJECTS tokens here
  // this allows us to deduplicate amounts and extractPricesAndAmounts
  // and set since and untilTimestamp properly
  const { amounts, prices } = extractPricesAndAmounts(
    projects.flatMap((p) => p.tokens),
  )

  const projectsWithSources = projects.map((p) => {
    const { amounts: projectAmounts } = extractPricesAndAmounts(p.tokens)
    const amountChains = projectAmounts
      .map((a) => {
        switch (a.type) {
          case 'circulatingSupply':
            return CirculatingSupplyAmountIndexer.SOURCE()
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

  const chains = Array.from(
    new Set(
      amounts
        .filter((a) => a.type === 'totalSupply' || a.type === 'balanceOfEscrow')
        .map((c) => c.chain)
        .filter(notUndefined),
    ),
  )

  const blockTimestamps = await Promise.all(
    Array.from(new Set(chains).values()).map(async (c) => {
      const chainConfig = await new ProjectService().getProject({
        id: ProjectId(c),
        select: ['chainConfig'],
      })
      assert(chainConfig, `${c}: chainConfig not configured`)
      assert(chainConfig.chainConfig.sinceTimestamp)

      return {
        chainName: c,
        configurationId: generateConfigurationId([`chain_${c}`]),
        sinceTimestamp:
          sinceTimestamp ?? chainConfig.chainConfig.sinceTimestamp,
        untilTimestamp: chainConfig.chainConfig.untilTimestamp,
      }
    }),
  )

  return {
    projects: projectsWithSources,
    amounts,
    prices,
    chains,
    blockTimestamps,
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
