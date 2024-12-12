import { layer2s, layer3s } from '@l2beat/config'
import { type ValueRecord } from '@l2beat/database'
import { assert, type ProjectId, notUndefined } from '@l2beat/shared-pure'
import { type Dictionary, uniq } from 'lodash'
import { z } from 'zod'
import { getEthPrices } from './utils/get-eth-prices'
import { getTvlProjects } from './utils/get-tvl-projects'
import { getTvlValuesForProjects } from './utils/get-tvl-values-for-projects'
import {
  TvlProjectFilter,
  createTvlProjectsFilter,
} from './utils/project-filter-utils'
import { TvlChartRange } from './utils/range'
import { sumValuesPerSource } from './utils/sum-values-per-source'

export const TvlChartDataParams2 = z.object({
  range: TvlChartRange,
  filter: TvlProjectFilter,
  excludeAssociatedTokens: z.boolean(),
})

export type TvlChartDataParams2 = z.infer<typeof TvlChartDataParams2>

/**
 * A function that computes values for chart data of the TVL over time.
 * @returns {
 *  total: {
 *    usd: number
 *    eth: number
 *  }
 *  chart: [timestamp, native, canonical, external, ethPrice][] - all numbers
 * }
 */

export async function getTvlChart2({
  range,
  filter,
  excludeAssociatedTokens,
}: TvlChartDataParams2) {
  const projectsFilter = createTvlProjectsFilter(filter)
  const tvlProjects = getTvlProjects(projectsFilter)
  const rollupProjects = tvlProjects.filter((p) =>
    rollupsIds.includes(p.projectId),
  )
  const validiumAndOptimiumsProjects = tvlProjects.filter((p) =>
    validiumAndOptimiumsIds.includes(p.projectId),
  )
  const othersProjects = tvlProjects.filter((p) =>
    othersIds.includes(p.projectId),
  )
  console.log('rollupProjects', rollupProjects)
  const [ethPrices, rollupValues, validiumAndOptimiumsValues, othersValues] =
    await Promise.all([
      getEthPrices(),
      getTvlValuesForProjects(rollupProjects, range),
      getTvlValuesForProjects(validiumAndOptimiumsProjects, range),
      getTvlValuesForProjects(othersProjects, range),
    ])

  // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
  const forTotal = filter.type !== 'projects' || filter.projectIds.length !== 1

  return getChartData(
    rollupValues,
    validiumAndOptimiumsValues,
    othersValues,
    ethPrices,
    {
      excludeAssociatedTokens,
      forTotal,
    },
  )
}
const othersIds: ProjectId[] = [
  'Blast',
  'Linea',
  'Worldchain',
  'Mode',
  'Fuel Ignition',
  'Taiko',
  'Zircuit',
  'Lisk',
  'BOB',
  'Zora',
  'Boba',
  'Binary',
  'Kroma',
  'Morph',
  'Polynomial',
  'Mint',
  'Shape',
  'DeBank Chain',
  'Optopia',
  'Swan Chain',
  'Honeypot',
  'SuperLumio',
  'Metal',
  'Parallel',
  'River',
  'Frame Chain',
  'Race Network',
  'Deri',
  'Lambda Chain',
  'Ethernity',
  'Bug Buster',
  'Mantle',
  'Manta Pacific',
  'Metis',
  'Fraxtal',
  'Gravity',
  'Immutable X',
  'Cronos zkEVM',
  'RSS3 VSL',
  'zkLink Nova',
  'Derive',
  'ApeX',
  'Aevo',
  'Cyber',
  'Re.al',
  'X Layer',
  'K2',
  'Sanko',
  'Reya',
  'Sorare',
  'Orderly',
  'SX Network',
  'ZKFair',
  'Silicon',
  'rhino.fi',
  'WINR',
  'Degen Chain',
  'Astar zkEVM',
  'Xai',
  'Redstone',
  'Ancient8',
  'Fluence',
  'tanX',
  'XCHAIN',
  'Ham',
  'AlienX',
  'HYCHAIN',
  'PoP Apex',
  'RARI Chain',
  'Aleph Zero EVM',
  'PGN',
  'PoP Boss',
  'Myria',
  'Everclear Hub',
  'Edgeless',
  'Hypr',
  'OEV Network',
  'GM Network',
  'Pay Chain',
  'Xterio Chain',
  'Molten',
  'Automata',
  'L3X',
  'Stack',
  'GPT Protocol',
  'Witness Chain',
  'Blessnet',
  'InEVM',
  'PlayBlock',
  'ApeChain',
]
  .map((x) =>
    [...layer2s, ...layer3s].find(
      (p) => p.display.name === x || p.display.shortName === x,
    ),
  )
  .map((p) => p?.id)
  .filter(notUndefined)
const rollupsIds = [...layer2s, ...layer3s]
  .filter(
    (p) => p.display.category.endsWith('Rollup') && !othersIds.includes(p.id),
  )
  .map((p) => p.id)
const validiumAndOptimiumsIds = [...layer2s, ...layer3s]
  .filter(
    (p) =>
      (p.display.category === 'Validium' ||
        p.display.category === 'Optimium') &&
      !othersIds.includes(p.id),
  )
  .map((p) => p.id)

function getChartData(
  rollupsValues: Dictionary<Dictionary<ValueRecord[]>>,
  validiumAndOptimiumsValues: Dictionary<Dictionary<ValueRecord[]>>,
  othersValues: Dictionary<Dictionary<ValueRecord[]>>,
  ethPrices: Record<number, number>,
  options: {
    excludeAssociatedTokens: boolean
    forTotal: boolean
  },
) {
  const rollupTimestampValues: Record<string, ValueRecord[]> = {}
  const validiumAndOptimiumsTimestampValues: Record<string, ValueRecord[]> = {}
  const othersTimestampValues: Record<string, ValueRecord[]> = {}
  for (const projectValues of Object.values(rollupsValues)) {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = rollupTimestampValues[timestamp] ?? []
      rollupTimestampValues[timestamp] = map.concat(values)
    }
  }

  for (const projectValues of Object.values(validiumAndOptimiumsValues)) {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = validiumAndOptimiumsTimestampValues[timestamp] ?? []
      validiumAndOptimiumsTimestampValues[timestamp] = map.concat(values)
    }
  }

  for (const projectValues of Object.values(othersValues)) {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = othersTimestampValues[timestamp] ?? []
      othersTimestampValues[timestamp] = map.concat(values)
    }
  }
  const timestamps = uniq([
    ...Object.keys(rollupTimestampValues),
    ...Object.keys(validiumAndOptimiumsTimestampValues),
    ...Object.keys(othersTimestampValues),
  ]).sort()

  return timestamps.map((timestamp) => {
    const ethPrice = ethPrices[+timestamp]
    const rVals = rollupTimestampValues[timestamp]
    const vVals = validiumAndOptimiumsTimestampValues[timestamp]
    const oVals = othersTimestampValues[timestamp]

    const rSummed = rVals ? sumValuesPerSource(rVals, options) : undefined
    const vSummed = vVals ? sumValuesPerSource(vVals, options) : undefined
    const oSummed = oVals ? sumValuesPerSource(oVals, options) : undefined

    assert(ethPrice, 'No ETH price for ' + timestamp)

    const rTotal = rSummed
      ? Number(rSummed.native + rSummed.canonical + rSummed.external)
      : 0
    const vTotal = vSummed
      ? Number(vSummed.native + vSummed.canonical + vSummed.external)
      : 0
    const oTotal = oSummed
      ? Number(oSummed.native + oSummed.canonical + oSummed.external)
      : 0

    return [+timestamp, rTotal, vTotal, oTotal, ethPrice * 100] as const
  })
}
