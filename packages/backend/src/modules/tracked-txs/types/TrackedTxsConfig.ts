import { Layer2TrackedTxUse } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxId } from './TrackedTxId'

export const SHARP_SUBMISSION_ADDRESS = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
export const SHARP_SUBMISSION_SELECTOR = '0x9b3b76cc'

export type TrackedTxsConfig = {
  entries: TrackedTxConfigEntry[]
}

export type TrackedTxConfigEntry =
  | TrackedTxFunctionCallConfig
  | TrackedTxTransferConfig
  | TrackedTxSharpSubmissionConfig

export interface TrackedTxUseWithId extends Layer2TrackedTxUse {
  id: TrackedTxId
}

interface TrackedTxConfigBase {
  projectId: ProjectId
  uses: TrackedTxUseWithId[]
  sinceTimestampInclusive: UnixTime
  untilTimestampExclusive?: UnixTime
}

export interface TrackedTxFunctionCallConfig extends TrackedTxConfigBase {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
}

export interface TrackedTxTransferConfig extends TrackedTxConfigBase {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
}

export interface TrackedTxSharpSubmissionConfig extends TrackedTxConfigBase {
  formula: 'sharpSubmission'
  address: EthereumAddress
  selector: string
  programHashes: string[]
}
