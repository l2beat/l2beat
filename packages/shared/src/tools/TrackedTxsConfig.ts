import {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'

import { TrackedTxId } from './TrackedTxId'

export type TrackedTxsConfig = {
  entries: TrackedTxConfigEntry[]
}

export type TrackedTxConfigEntry =
  | TrackedTxFunctionCallConfig
  | TrackedTxTransferConfig
  | TrackedTxSharpSubmissionConfig

export interface TrackedTxUseWithId {
  id: TrackedTxId
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
}

interface TrackedTxConfigBase {
  projectId: ProjectId
  uses: TrackedTxUseWithId[]
  sinceTimestampInclusive: UnixTime
  untilTimestampExclusive?: UnixTime
  costMultiplier?: number
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
