import { getEnv } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import { HttpClient, type TrackedTxCostsConfig } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { command, optional, positional, run, string } from 'cmd-ts'
import { makeConfig } from '../src/config/makeConfig'

const args = {
  project: positional({
    type: string,
    displayName: 'projectId',
    description: 'Project id to check multipliers',
  }),
  startDate: positional({
    type: optional(string),
    displayName: 'start date',
    description: 'Start date of the period to check multipliers (dd-mm-yyyy)',
  }),
  endDate: positional({
    type: optional(string),
    displayName: 'end date',
    description: 'End date of the period to check multipliers (dd-mm-yyyy)',
  }),
}

const customerIds = {
  starknet: 'gcp-starknet-production_starknet-mainnet',
  paradex: 'cp-paradigm-otc-prod_potc-production',
}

const cmd = command({
  name: 'starkware-multiplier',
  args,
  handler: async (args) => {
    const env = getEnv({ FEATURES: 'tracked-txs' })
    const config = await makeConfig(env, {
      name: 'Script/Local',
      isLocal: true,
    })

    if (!Object.keys(customerIds).includes(args.project)) {
      throw new Error(`Project ${args.project} is not supported`)
    }
    const [startDate, endDate] = getDates(args.startDate, args.endDate)

    const db = createDatabase({
      ...config.database.connection,
      ...config.database.connectionPoolSize,
    })

    assert(config.trackedTxsConfig !== false)
    const projectConfig = config.trackedTxsConfig.projects.find(
      (p) => p.id === args.project,
    )
    const costsConfigs = projectConfig?.configurations.filter(
      (c): c is TrackedTxCostsConfig =>
        c.sinceTimestamp < endDate &&
        (!c.untilTimestamp || c.untilTimestamp > startDate) &&
        c.type === 'l2costs',
    )

    if (!costsConfigs || costsConfigs?.length === 0) {
      return
    }

    const proofConfigs = costsConfigs.filter(
      (c) => c.subtype === 'proofSubmissions',
    )
    const batchConfigs = costsConfigs.filter(
      (c) => c.subtype === 'batchSubmissions',
    )

    console.log('Getting data from db...')
    const costsByConfig = await db.l2Cost.getGasSumByTimeRangeAndConfigId(
      [...proofConfigs, ...batchConfigs].map((c) => c.id),
      startDate,
      endDate,
    )
    const costsInEth = costsByConfig.map((c) => ({
      ...c,
      totalEthCost: weiToEth(c.totalCostInWei),
    }))

    const totalProofCost = proofConfigs.reduce((acc, c) => {
      const cost = costsInEth.find((cost) => cost.configurationId === c.id)
      return acc + (cost ? cost.totalEthCost : 0)
    }, 0)
    const totalBatchSubmissionCost = batchConfigs.reduce((acc, c) => {
      const cost = costsInEth.find((cost) => cost.configurationId === c.id)
      return acc + (cost ? cost.totalEthCost : 0)
    }, 0)

    console.log('Fetching data from starkware api...')
    const data = await fetchStarkwareApi(args.project, startDate, endDate)

    const actualProofMultiplier = data.proof_cost_eth / totalProofCost
    const actualBatchMultiplier =
      data.onchain_data_cost_eth / totalBatchSubmissionCost

    console.log('Actual proof multiplier:', actualProofMultiplier)
    for (const c of proofConfigs) {
      console.log(
        `Proof config: ${c.id} |`,
        getConfigDetails(c.params),
        `Since: ${c.sinceTimestamp}`,
        `Until: ${c.untilTimestamp ? c.untilTimestamp : '-'} |`,
        'Multiplier:',
        c.costMultiplier,
      )
    }
    console.log('Actual batch submissions multiplier:', actualBatchMultiplier)
    for (const c of batchConfigs) {
      console.log(
        `Batch config: ${c.id} |`,
        getConfigDetails(c.params),
        `Since: ${c.sinceTimestamp}`,
        `Until: ${c.untilTimestamp ? c.untilTimestamp : '-'} |`,
        'Multiplier:',
        c.costMultiplier,
      )
    }
  },
})

run(cmd, process.argv.slice(2))

async function fetchStarkwareApi(
  projectId: string,
  startDate: UnixTime,
  endDate: UnixTime,
) {
  const customerId = customerIds[projectId as keyof typeof customerIds]
  const http = new HttpClient()

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

function getConfigDetails(params: TrackedTxCostsConfig['params']) {
  return params.formula === 'sharpSubmission'
    ? `Program hashes: ${params.programHashes.join(',')} |`
    : params.formula === 'functionCall'
      ? `Selector: ${params.selector} |`
      : ''
}

function getDates(startDate: string | undefined, endDate: string | undefined) {
  if (!startDate) {
    console.log('No start date provided, using default value (yesterday)')
  }
  if (!endDate) {
    console.log('No end date provided, using default value (today)')
  }
  const start = startDate
    ? UnixTime.fromDate(getDateFromString(startDate))
    : UnixTime.toStartOf(UnixTime.now(), 'day') - 1 * UnixTime.DAY
  const end = endDate
    ? UnixTime.fromDate(getDateFromString(endDate))
    : UnixTime.toStartOf(UnixTime.now(), 'day')
  return [start, end]
}

function getDateFromString(date: string) {
  const [day, month, year] = date.split('-')
  const utcDate = Date.UTC(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day),
  )
  return new Date(utcDate)
}

function weiToEth(wei: bigint): number {
  // Biggest wei we can get from DB is 2^63-1 which divided by 1e9 is safe to parse to Number
  const integerPartGwei = Number(wei / 1_000_000_000n)
  const fractionPartGwei = Number(wei % 1_000_000_000n)
  const gwei = integerPartGwei + fractionPartGwei / 1_000_000_000

  return gwei / 1_000_000_000
}
