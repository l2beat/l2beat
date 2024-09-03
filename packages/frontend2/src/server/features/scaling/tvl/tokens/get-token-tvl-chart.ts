import {
  ConfigMapping,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
  layer2s,
  layer3s,
  toBackendProject,
} from '@l2beat/config'
import {
  assert,
  type AmountConfigEntry,
  EthereumAddress,
  type PriceConfigEntry,
  UnixTime,
  asNumber,
  branded,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { z } from 'zod'
import { db } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getAmountsStatus } from '../sync-status/get-amounts-status'
import { getConfigurationsStatus } from '../sync-status/get-configurations-status'
import {
  TvlChartRange,
  type TvlChartResolution,
  rangeToResolution,
} from '../utils/range'
import { calculateValue } from './utils/calculate-value'

const TokenParams = z.object({
  projectId: z.string(),
  address: branded(z.string(), EthereumAddress).or(z.literal('native')),
  chain: z.string(),
})

export const TokenTvlChartParams = z.object({
  token: TokenParams,
  range: TvlChartRange,
})

export type TokenTvlChartParams = z.infer<typeof TokenTvlChartParams>
export type TokenParams = z.infer<typeof TokenParams>

/*
  Return type: [timestamp, amount, usdValue]
*/
export async function getTokenTvlChart({ token, range }: TokenTvlChartParams) {
  const targetTimestamp = UnixTime.now().toStartOf('hour').add(-2, 'hours')
  const resolution = rangeToResolution(range)

  const project = [...layer2s, ...layer3s].find((p) => p.id === token.projectId)
  assert(project, 'Project not found')
  const backendProject = toBackendProject(project)

  const amountsConfigs = getTvlAmountsConfigForProject(backendProject)
  const priceConfigs = getTvlPricesConfig()

  const configMapping = new ConfigMapping(priceConfigs, amountsConfigs, [
    backendProject.projectId,
  ])

  const tokenAmountConfigs = configMapping.getAmountsByProjectAndToken(
    project.id,
    token,
  )

  const firstTokenAmountConfig = tokenAmountConfigs[0]
  assert(firstTokenAmountConfig, 'No token amount config found')
  const [from, to] = getRangeWithMax(range, resolution, {
    now: targetTimestamp,
  })
  const tokenSinceTimestamp =
    firstTokenAmountConfig.sinceTimestamp.toEndOf('day')
  const adjustedFrom = from
    ? UnixTime.max(from, tokenSinceTimestamp)
    : tokenSinceTimestamp
  const adjustedRange: [UnixTime, UnixTime] = [adjustedFrom, to]

  const tokenPriceConfig = configMapping.getPriceConfigFromAmountConfig(
    firstTokenAmountConfig,
  )

  const timestamps = generateTimestamps(adjustedRange, resolution)

  const aggregatedTokenAmounts = await getAggregatedTokenAmounts({
    configurations: tokenAmountConfigs,
    range: adjustedRange,
    timestamps,
  })
  const prices = await getPrices(tokenPriceConfig, adjustedRange, resolution)

  const decimals = firstTokenAmountConfig.decimals
  const data: [number, number, number][] = []
  for (const timestamp of timestamps) {
    const amount = aggregatedTokenAmounts.amounts[timestamp.toNumber()]
    const price = prices.prices[timestamp.toNumber()]
    assert(amount !== undefined && price !== undefined, 'No amount or price')
    const usdValue = calculateValue({
      amount,
      priceUsd: price,
      decimals,
    })
    data.push([
      timestamp.toNumber(),
      asNumber(amount, decimals),
      asNumber(usdValue, 2),
    ])
  }

  return data
}

async function getAggregatedTokenAmounts({
  configurations,
  range,
  timestamps,
}: {
  configurations: (AmountConfigEntry & { configId: string })[]
  range: [UnixTime, UnixTime]
  timestamps: UnixTime[]
}) {
  const [from, to] = range
  const amountRecords = await db.amount.getByConfigIdsInRange(
    configurations.map((c) => c.configId),
    from,
    to,
  )
  const status = await getAmountsStatus(configurations, to)

  const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

  const aggregatedByTimestamp: Record<string, bigint> = {}
  for (const timestamp of timestamps) {
    const amounts = amountsByTimestamp[timestamp.toString()] ?? []

    const interpolatedRecords = status.lagging
      .filter((l) => timestamp.gt(l.latestTimestamp))
      .map((l) => {
        const amount =
          amountsByTimestamp[l.latestTimestamp.toString()]?.find(
            (a) => a.configId === l.id,
          )?.amount ?? 0n
        return { amount }
      })

    const aggregatedAmount = [
      ...amounts.filter((a) => !status.excluded.has(a.configId)),
      ...interpolatedRecords,
    ].reduce((acc, curr) => acc + curr.amount, 0n)

    aggregatedByTimestamp[timestamp.toString()] = aggregatedAmount
  }

  return {
    amounts: aggregatedByTimestamp,
    laggingFrom: new Map<string, UnixTime>(
      status.lagging.map((l) => [l.id, l.latestTimestamp]),
    ),
    excluded: status.excluded,
  }
}

async function getPrices(
  configuration: PriceConfigEntry & { configId: string },
  range: [UnixTime, UnixTime],
  resolution: TvlChartResolution,
) {
  const [from, to] = range
  const priceRecords = await db.price.getByConfigIdsInRange(
    [configuration.configId],
    from,
    to,
  )
  const status = await getConfigurationsStatus([configuration], to)

  assert(
    !status.excluded.has(configuration.configId),
    `This code should not run when price still syncing id ${configuration.configId}`,
  )

  const pricesByTimestamp: Record<string, number> = {}
  for (const price of priceRecords) {
    pricesByTimestamp[price.timestamp.toString()] = price.priceUsd
  }
  if (status.lagging.length === 0) {
    return {
      prices: pricesByTimestamp,
    }
  }

  const latest = priceRecords[priceRecords.length - 1]
  assert(latest, 'Latest price record not found')
  const missingTimestamps = generateTimestamps(
    [latest.timestamp, to],
    resolution,
  )

  for (const timestamp of missingTimestamps) {
    pricesByTimestamp[timestamp.toString()] = latest.priceUsd
  }

  return {
    prices: pricesByTimestamp,
    laggingFrom: latest.timestamp,
  }
}
