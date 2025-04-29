import { HttpClient, type TrackedTxCostsConfig } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { makeConfig } from '../src/config/makeConfig'
import { getEnv } from '@l2beat/backend-tools'
import type { Config } from '../src/config'
import { createDatabase } from '@l2beat/database'

const http = new HttpClient()

async function main() {
  const end = UnixTime.toStartOf(UnixTime.now() - UnixTime.DAY, 'day')
  const start = end - 30 * UnixTime.DAY

  const env = getEnv({ FEATURES: 'tracked-txs' })
  const config = await makeConfig(env, {
    name: 'Script/Local',
    isLocal: true,
  })

  const db = createDatabase({
    ...config.database.connection,
    ...config.database.connectionPoolSize,
  })

  const configs = getSharpConfigs(config, start, end)
  const costsByConfig = await db.l2Cost.getGasSumByTimeRangeAndConfigId(
    configs.map((c) => c.id),
    start,
    end,
  )
  const totalProofCost = costsByConfig.reduce(
    (acc, c) => acc + weiToEth(c.totalCostInWei),
    0,
  )

  const batchConfigs = getBatchConfigsForProject(config, 'starknet', start, end)
  const costsByBatchConfig = await db.l2Cost.getGasSumByTimeRangeAndConfigId(
    batchConfigs.map((c) => c.id),
    start,
    end,
  )
  const totalDataCost = costsByBatchConfig.reduce(
    (acc, c) => acc + weiToEth(c.totalCostInWei),
    0,
  )

  const proofConfigs = getProofSubmissionConfigsForProject(
    config,
    'starknet',
    start,
    end,
  )
  const costsByProofConfig = await db.l2Cost.getGasSumByTimeRangeAndConfigId(
    proofConfigs.map((c) => c.id),
    start,
    end,
  )
  const proofCost = costsByProofConfig.reduce(
    (acc, c) => acc + weiToEth(c.totalCostInWei),
    0,
  )

  const customers = Object.keys(await getCostumers(start, end))
  let reportedTotalProofCost = 0
  let reportedTotalDataCost = 0
  for (const customer of customers) {
    const { proof_cost_eth, onchain_data_cost_eth } = await fetchStarkwareApi(
      customer,
      start,
      end,
    )
    reportedTotalProofCost += proof_cost_eth
    reportedTotalDataCost += onchain_data_cost_eth
  }

  console.log('reported_total_proof_cost:', reportedTotalProofCost)
  console.log('reported_total_data_cost:', reportedTotalDataCost)
  console.log('total_proof_cost:', totalProofCost)
  console.log('total_data_cost:', totalDataCost)
  console.log('proof_cost:', proofCost)
}
main().catch(console.error)

function getSharpConfigs(config: Config, start: UnixTime, end: UnixTime) {
  assert(config.trackedTxsConfig !== false)
  return config.trackedTxsConfig.projects.flatMap((p) =>
    p.configurations.filter(
      (c): c is TrackedTxCostsConfig =>
        c.sinceTimestamp < end &&
        (!c.untilTimestamp || c.untilTimestamp > start) &&
        c.type === 'l2costs' &&
        c.params.formula === 'sharpSubmission',
    ),
  )
}

function getBatchConfigsForProject(
  config: Config,
  projectId: string,
  start: UnixTime,
  end: UnixTime,
) {
  assert(config.trackedTxsConfig !== false)
  const projectConfig = config.trackedTxsConfig.projects.find(
    (p) => p.id === projectId,
  )
  return (
    projectConfig?.configurations.filter(
      (c): c is TrackedTxCostsConfig =>
        c.sinceTimestamp < end &&
        (!c.untilTimestamp || c.untilTimestamp > start) &&
        c.type === 'l2costs' &&
        c.subtype === 'batchSubmissions',
    ) ?? []
  )
}

function getProofSubmissionConfigsForProject(
  config: Config,
  projectId: string,
  start: UnixTime,
  end: UnixTime,
) {
  assert(config.trackedTxsConfig !== false)
  const projectConfig = config.trackedTxsConfig.projects.find(
    (p) => p.id === projectId,
  )
  return (
    projectConfig?.configurations.filter(
      (c): c is TrackedTxCostsConfig =>
        c.sinceTimestamp < end &&
        (!c.untilTimestamp || c.untilTimestamp > start) &&
        c.type === 'l2costs' &&
        c.subtype === 'proofSubmissions' &&
        c.params.formula === 'functionCall',
    ) ?? []
  )
}

async function getCostumers(startDate: UnixTime, endDate: UnixTime) {
  const http = new HttpClient()
  const data = await http.fetch(
    `http://sharp-bi.provingservice.io/sharp_bi/aggregations/steps?day_start=${UnixTime.toYYYYMMDD(startDate)}&day_end=${UnixTime.toYYYYMMDD(endDate)}`,
    {
      timeout: 10000,
    },
  )
  return data as Record<string, number>
}

async function fetchStarkwareApi(
  customerId: string,
  startDate: UnixTime,
  endDate: UnixTime,
) {
  const data = await http.fetch(
    `http://sharp-bi.provingservice.io/sharp_bi/aggregations/cost?day_start=${UnixTime.toYYYYMMDD(startDate)}&day_end=${UnixTime.toYYYYMMDD(endDate)}&customer_id=${customerId}`,
    {
      timeout: 10000,
    },
  )
  return data as {
    proof_cost_eth: number
    onchain_data_cost_eth: number
  }
}

function weiToEth(wei: bigint): number {
  // Biggest wei we can get from DB is 2^63-1 which divided by 1e9 is safe to parse to Number
  const integerPartGwei = Number(wei / 1_000_000_000n)
  const fractionPartGwei = Number(wei % 1_000_000_000n)
  const gwei = integerPartGwei + fractionPartGwei / 1_000_000_000

  return gwei / 1_000_000_000
}
