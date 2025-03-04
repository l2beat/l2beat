import type { Project } from '@l2beat/config'
import type { TrackedTxCostsConfig } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

export type TrackedTransactionsByType = {
  batchSubmissions: TrackedTransaction[] | undefined
  proofSubmissions: TrackedTransaction[] | undefined
  stateUpdates: TrackedTransaction[] | undefined
}

export type TrackedTransaction = Omit<TrackedTxCostsConfig, 'id'> & {
  isHistorical: boolean
}

export function getTrackedTransactions(
  project: Project<never, 'trackedTxsConfig'>,
): TrackedTransactionsByType | undefined {
  if (!project.trackedTxsConfig) {
    return undefined
  }

  const now = UnixTime.now().toNumber()
  const txs = project.trackedTxsConfig
    .filter((x): x is TrackedTxCostsConfig => x.type === 'l2costs')
    .map(
      (x): TrackedTransaction => ({
        ...x,
        isHistorical: !!x.untilTimestamp && x.untilTimestamp < now,
      }),
    )
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)

  return {
    batchSubmissions: txs.filter((x) => x.subtype === 'batchSubmissions'),
    proofSubmissions: txs.filter((x) => x.subtype === 'proofSubmissions'),
    stateUpdates: txs.filter((x) => x.subtype === 'stateUpdates'),
  }
}
