import { Layer2TrackedTransactionConfig } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

export type TrackedTransactionsConfig = {
  entries: TrackedTransactionsConfigEntry[]
}

export interface TrackedTransactionsConfigEntry
  extends TrackedTransactionsConfigBase {
  query: FunctionCallQuery | TransferQuery | SharpSubmissionQuery
}

interface TrackedTransactionsConfigBase {
  projectId: ProjectId
  uses: Layer2TrackedTransactionConfig['uses']
}

interface BaseQuery {
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface FunctionCallQuery extends BaseQuery {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
}

export interface TransferQuery extends BaseQuery {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
}

export interface SharpSubmissionQuery extends BaseQuery {
  formula: 'sharpSubmission'
  address: EthereumAddress
  selector: string
  programHashes: string[]
}

const sharpAddress = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
const sharpSelector = '0x9b3b76cc'

export function makeSharpSubmissionsQuery(
  values: Omit<SharpSubmissionQuery, 'address' | 'selector'>,
): SharpSubmissionQuery {
  return { ...values, address: sharpAddress, selector: sharpSelector }
}
