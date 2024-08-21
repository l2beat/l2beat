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
import { ChainConverter, ChainId } from '@l2beat/shared-pure'
import { db } from '~/server/database'
import { AmountsDataService } from './AmountsDataService'
import { BreakdownService } from './BreakdownService'
import { Clock } from './Clock'
import { ConfigMapping } from './ConfigMapping'
import { DataStatusService } from './DataStatusService'
import { PricesDataService } from './PricesDataService'
import { getEtherPriceConfig } from './getEtherPriceConfig'

export function bootDepsForTvl() {
  const projects = [
    ...layer2s.map(layer2ToBackendProject),
    ...layer3s.map(layer3ToBackendProject),
    ...bridges.map(bridgeToBackendProject),
  ]

  const amountsConfigs = getTvlAmountsConfig(projects)
  const priceConfigs = getTvlPricesConfig()

  const clock = new Clock(getEthereumMinTimestamp(), 60 * 60, 7, 9)

  const dataStatusService = new DataStatusService(db)

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )

  const pricesDataService = new PricesDataService({
    db,
    dataStatusService,
    clock,
    etherPriceConfig: getEtherPriceConfig(priceConfigs),
  })

  const amountsDataService = new AmountsDataService({
    db,
    dataStatusService,
    clock,
  })

  const configMapping = new ConfigMapping(
    priceConfigs,
    amountsConfigs,
    projects.map((p) => p.projectId),
  )

  const breakdownService = new BreakdownService({
    pricesDataService,
    amountsDataService,
    configMapping,
    chainConverter,
  })

  return breakdownService
}

function getEthereumMinTimestamp() {
  const minBlockTimestamp = chains.find(
    (c) => c.name === 'ethereum',
  )?.minTimestampForTvl
  if (!minBlockTimestamp) {
    throw new Error('Missing minBlockTimestamp for ethereum')
  }
  return minBlockTimestamp
}
