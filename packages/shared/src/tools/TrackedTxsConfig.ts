import {
  EthereumAddress,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import type { TrackedTxId } from './createTrackedTxConfigId'

export const SHARP_SUBMISSION_ADDRESS = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
export const SHARP_SUBMISSION_SELECTOR = '0x9b3b76cc'

export type TrackedTxConfigEntry =
  | TrackedTxCostsConfig
  | TrackedTxLivenessConfig

export type TrackedTxConfigEntryWithoutId =
  | Omit<TrackedTxCostsConfig, 'id'>
  | Omit<TrackedTxFunctionCallLivenessConfig, 'id'>
  | Omit<TrackedTxOtherLivenessConfig, 'id'>

type TrackedTxParams =
  | TrackedTxFunctionCallConfig
  | TrackedTxTransferConfig
  | TrackedTxSharpSubmissionConfig
  | TrackedTxSharedBridgeConfig

interface TrackedTxConfigBase<
  TParams extends TrackedTxParams = TrackedTxParams,
> {
  id: TrackedTxId
  projectId: ProjectId
  sinceTimestamp: number
  untilTimestamp?: number
  params: TParams
  subtype: TrackedTxsConfigSubtype
}

export interface TrackedTxCostsConfig extends TrackedTxConfigBase {
  costMultiplier?: number
  type: 'l2costs'
}

export type TrackedTxLivenessConfig =
  | TrackedTxFunctionCallLivenessConfig
  | TrackedTxOtherLivenessConfig

export interface TrackedTxFunctionCallLivenessConfig
  extends TrackedTxConfigBase<TrackedTxFunctionCallConfig> {
  type: 'liveness'
  groupBy?: TrackedTxFunctionCallGrouping
}

export interface TrackedTxOtherLivenessConfig
  extends TrackedTxConfigBase<
    | TrackedTxTransferConfig
    | TrackedTxSharpSubmissionConfig
    | TrackedTxSharedBridgeConfig
  > {
  type: 'liveness'
}

export interface TrackedTxFunctionCallGrouping {
  type: 'functionCallParameter'
  /** Index path through the decoded function arguments, including tuple indices. */
  path: readonly [number, ...number[]]
}

export interface TrackedTxFunctionCallConfig {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
  signature: `function ${string}`
  topics?: string[]
}

export interface TrackedTxTransferConfig {
  formula: 'transfer'
  from?: EthereumAddress
  to: EthereumAddress
}

export interface TrackedTxSharpSubmissionConfig {
  formula: 'sharpSubmission'
  address: EthereumAddress
  selector: string
  programHashes: string[]
}

export interface TrackedTxSharedBridgeConfig {
  formula: 'sharedBridge'
  address: EthereumAddress
  signature: `function ${string}`
  selector: string
  /** First parameter of the function call. It is used to match the input to the config, by decoding the input and checking if the first parameter matches the expected value.*/
  firstParameter: number | EthereumAddress
}
