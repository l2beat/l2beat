import { type Layer2, type Layer2TxConfig } from '@l2beat/config'
import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export type TrackedTransactionsByType = {
  batchSubmissions: TrackedTransaction[] | undefined
  proofSubmissions: TrackedTransaction[] | undefined
  stateUpdates: TrackedTransaction[] | undefined
}

export type TrackedTransaction = {
  isHistorical: boolean
  sinceTimestamp: number
  untilTimestamp?: number
} & (
  | FunctionCallTransaction
  | TransferTransaction
  | SharpSubmissionTransaction
  | SharedBridgeTransaction
)

interface FunctionCallTransaction {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
  functionSignature: string
}

interface TransferTransaction {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
}

interface SharpSubmissionTransaction {
  formula: 'sharpSubmission'
  programHashes: string[]
}

interface SharedBridgeTransaction {
  formula: 'sharedBridge'
  chainId: number
  address: EthereumAddress
  selector: string
  functionSignature: string
}

export function getTrackedTransactions(
  project: Layer2,
): TrackedTransactionsByType {
  const costsTrackedTxs = project.config.trackedTxs?.filter(
    (trackedTxsConfig) =>
      trackedTxsConfig.uses.some((use) => use.type === 'l2costs'),
  )

  const now = UnixTime.now()

  function filterByType(trackedTxsConfig: Layer2TxConfig, type: string) {
    return (
      trackedTxsConfig.uses.some((use) => use.subtype === type) &&
      trackedTxsConfig.query.sinceTimestamp.lt(now)
    )
  }

  function mapToTrackedTransaction(
    trackedTxsConfig: Layer2TxConfig,
  ): TrackedTransaction {
    const isHistorical = !!trackedTxsConfig.query.untilTimestamp?.lt(now)

    if (trackedTxsConfig.query.formula === 'sharedBridge') {
      return {
        ...trackedTxsConfig.query,
        sinceTimestamp: trackedTxsConfig.query.sinceTimestamp.toNumber(),
        untilTimestamp: trackedTxsConfig.query.untilTimestamp?.toNumber(),
        chainId: trackedTxsConfig.query.chainId,
        isHistorical,
      }
    }

    return {
      ...trackedTxsConfig.query,
      sinceTimestamp: trackedTxsConfig.query.sinceTimestamp.toNumber(),
      untilTimestamp: trackedTxsConfig.query.untilTimestamp?.toNumber(),
      isHistorical,
    }
  }

  return {
    batchSubmissions: costsTrackedTxs
      ?.filter((trackedTxsConfig) =>
        filterByType(trackedTxsConfig, 'batchSubmissions'),
      )
      .map(mapToTrackedTransaction)
      .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp),
    proofSubmissions: costsTrackedTxs
      ?.filter((trackedTxsConfig) =>
        filterByType(trackedTxsConfig, 'proofSubmissions'),
      )
      .map(mapToTrackedTransaction)
      .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp),
    stateUpdates: costsTrackedTxs
      ?.filter((trackedTxsConfig) =>
        filterByType(trackedTxsConfig, 'stateUpdates'),
      )
      .map(mapToTrackedTransaction)
      .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp),
  }
}
