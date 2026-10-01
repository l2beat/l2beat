import type { Database } from '@l2beat/database'
import {
  createPrivacyAnonymitySetConfigurationId,
  createPrivacyFlowConfigurationId,
  createPrivacyRelayerConfigurationId,
} from '@l2beat/shared'
import {
  ChainSpecificAddress,
  type UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { PrivacyMetricCoverage } from '~/utils/privacyMetricCoverage'
import type { PrivacyAnonymitySetProject } from './anonymity-set/getPrivacyAnonymitySetSeries'

/** Compare active configurations over the same complete time window. */
export async function getPrivacyMetricCoverage(
  db: Database,
  project: PrivacyAnonymitySetProject,
  metric: 'fundingAddresses' | 'paidFinalizers',
  from: UnixTime,
  to: UnixTime,
): Promise<
  { coverage: PrivacyMetricCoverage; addresses?: number } | undefined
> {
  const flows: { id: string; since: number }[] = []
  const attributed: { id: string; since: number }[] = []
  for (const token of project.privacyInfo.tokens) {
    for (const bucket of token.buckets) {
      if (metric === 'fundingAddresses' && bucket.anonymitySet === undefined)
        continue
      const base = {
        projectId: project.id,
        bucketId: bucket.id,
        chain:
          typeof bucket.address === 'string'
            ? ChainSpecificAddress.longChain(bucket.address)
            : bucket.address.chain,
        address:
          typeof bucket.address === 'string'
            ? ChainSpecificAddress.address(bucket.address).toString()
            : bucket.address.address,
      }
      for (const direction of metric === 'fundingAddresses'
        ? (['deposit'] as const)
        : (['deposit', 'withdrawal'] as const)) {
        const config = { ...base, direction, ...bucket[direction] }
        flows.push({
          id: createPrivacyFlowConfigurationId(config),
          since: bucket.sinceTimestamp,
        })
      }
      if (metric === 'fundingAddresses') {
        attributed.push({
          id: createPrivacyAnonymitySetConfigurationId({
            ...base,
            ...bucket.deposit,
          }),
          since: bucket.sinceTimestamp,
        })
      }
    }
  }
  if (metric === 'paidFinalizers') {
    const tracking = project.privacyInfo.relayerTracking
    if (tracking?.type !== 'onchainEvents') return undefined
    for (const source of tracking.sources) {
      const direction =
        source.extractor === 'zkMoneyDepositPayout' ? 'deposit' : 'withdrawal'
      const bucket = project.privacyInfo.tokens
        .flatMap((token) => token.buckets)
        .find((bucket) => bucket.address === source.address)
      if (!bucket) return undefined
      attributed.push({
        id: createPrivacyRelayerConfigurationId({
          ...source,
          projectId: project.id,
          chain: ChainSpecificAddress.longChain(source.address),
          address: ChainSpecificAddress.address(source.address).toString(),
          event: bucket[direction].event,
        }),
        since: source.sinceTimestamp,
      })
    }
  }
  const required = [...flows, ...attributed]
  const configurations = await db.indexerConfiguration.getByConfigurationIds(
    unique(required.map((item) => item.id)),
  )
  const byId = new Map(configurations.map((config) => [config.id, config]))
  if (
    required.length === 0 ||
    required.some(({ id, since }) => {
      const config = byId.get(id)
      return (
        !config ||
        config.maxHeight !== null ||
        config.currentHeight === null ||
        config.currentHeight < to ||
        config.minHeight > Math.max(from, since)
      )
    })
  )
    return undefined

  const ids = unique(attributed.map((config) => config.id))
  const [total, result] = await Promise.all([
    db.privacyFlowEvent.getOperationCount(
      unique(flows.map((config) => config.id)),
      from,
      to,
    ),
    metric === 'fundingAddresses'
      ? db.privacyAnonymitySetEvent
          .getOperationCount(ids, from, to)
          .then((operations) => ({ operations, addresses: undefined }))
      : db.privacyRelayerActivity.getAttributedStats(ids, from, to),
  ])
  return {
    coverage: { attributed: result.operations, total },
    addresses: result.addresses,
  }
}
