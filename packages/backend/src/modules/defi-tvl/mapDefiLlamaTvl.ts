import type { DefiTvlRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { DefiLlamaProtocol } from './DefiLlamaClient'
import type { DefiTvlProjectConfig } from './types'

const RECONCILIATION_WINDOW = 30 * UnixTime.DAY
const MAX_STALENESS = 6 * UnixTime.HOUR
const MAX_FUTURE_SKEW = 3 * UnixTime.HOUR

export function mapDefiLlamaTvl(
  data: DefiLlamaProtocol,
  config: DefiTvlProjectConfig,
  from: UnixTime,
  to: UnixTime,
): DefiTvlRecord[] {
  const historyFrom = Math.max(
    config.sinceTimestamp,
    to - from > RECONCILIATION_WINDOW ? from : to - RECONCILIATION_WINDOW,
  )
  const records = new Map<string, DefiTvlRecord>()

  for (const chainConfig of config.chains) {
    const currentValue = data.currentChainTvls[chainConfig.providerChain]
    const history = data.chainTvls[chainConfig.providerChain]?.tvl

    assert(
      typeof currentValue === 'number' && Number.isFinite(currentValue),
      `${config.protocolSlug}: Missing current TVL for ${chainConfig.providerChain}`,
    )
    assert(
      currentValue >= 0,
      `${config.protocolSlug}: Negative current TVL for ${chainConfig.providerChain}`,
    )
    assert(
      history !== undefined && history.length > 0,
      `${config.protocolSlug}: Missing TVL history for ${chainConfig.providerChain}`,
    )

    const latest = history.reduce((a, b) => (a.date > b.date ? a : b))
    const sourceTimestamp = UnixTime(latest.date)
    assert(
      sourceTimestamp >= to - MAX_STALENESS,
      `${config.protocolSlug}: Stale TVL for ${chainConfig.providerChain}`,
    )
    assert(
      sourceTimestamp <= to + MAX_FUTURE_SKEW,
      `${config.protocolSlug}: Future TVL timestamp for ${chainConfig.providerChain}`,
    )

    for (const point of history) {
      const timestamp = UnixTime(point.date)
      if (
        timestamp < historyFrom ||
        timestamp > to ||
        !UnixTime.isFull(timestamp, 'day')
      ) {
        continue
      }
      assert(
        Number.isFinite(point.totalLiquidityUSD) &&
          point.totalLiquidityUSD >= 0,
        `${config.protocolSlug}: Invalid historical TVL for ${chainConfig.providerChain}`,
      )

      const record = createRecord(
        config,
        chainConfig.chain,
        timestamp,
        timestamp,
        point.totalLiquidityUSD,
      )
      records.set(recordKey(record), record)
    }

    const currentRecord = createRecord(
      config,
      chainConfig.chain,
      to,
      sourceTimestamp,
      currentValue,
    )
    records.set(recordKey(currentRecord), currentRecord)
  }

  return [...records.values()].sort((a, b) => a.timestamp - b.timestamp)
}

function createRecord(
  config: DefiTvlProjectConfig,
  chain: string,
  timestamp: UnixTime,
  sourceTimestamp: UnixTime,
  valueUsd: number,
): DefiTvlRecord {
  return {
    configurationId: config.configurationId,
    projectId: config.projectId,
    chain,
    timestamp,
    sourceTimestamp,
    valueUsd,
  }
}

function recordKey(record: DefiTvlRecord): string {
  return `${record.configurationId}:${record.chain}:${record.timestamp}`
}
