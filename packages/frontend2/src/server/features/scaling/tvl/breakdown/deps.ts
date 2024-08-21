import {
  bridgeToBackendProject,
  bridges,
  chains,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  layer2ToBackendProject,
  layer2s,
  layer3ToBackendProject,
  layer3s,
} from '@l2beat/config'
import { ChainConverter, ChainId, type ProjectId } from '@l2beat/shared-pure'
import { db } from '~/server/database'
import { AmountsDataService } from './AmountsDataService'
import { BreakdownService } from './BreakdownService'
import { ConfigMapping } from './ConfigMapping'
import { DataStatusService } from './DataStatusService'
import { PricesDataService } from './PricesDataService'

export function bootDepsForTvl(projectId: ProjectId) {
  const projects = [
    ...layer2s.map(layer2ToBackendProject),
    ...layer3s.map(layer3ToBackendProject),
    ...bridges.map(bridgeToBackendProject),
  ]

  const filteredProjects = projects.filter((p) => p.projectId === projectId)

  const amountsConfigs = getTvlAmountsConfig(projects).filter(
    (c) => c.project === projectId,
  )
  const priceConfigs = getTvlPricesConfig()

  const dataStatusService = new DataStatusService(db)

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )

  const pricesDataService = new PricesDataService({
    db,
    dataStatusService,
  })

  const amountsDataService = new AmountsDataService({
    db,
    dataStatusService,
  })

  const configMapping = new ConfigMapping(
    priceConfigs,
    amountsConfigs,
    filteredProjects.map((p) => p.projectId),
  )

  const breakdownService = new BreakdownService({
    pricesDataService,
    amountsDataService,
    configMapping,
    chainConverter,
  })

  return breakdownService
}
