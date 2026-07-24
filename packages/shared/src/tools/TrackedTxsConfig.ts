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

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

export type TrackedTxConfigEntryWithoutId = DistributiveOmit<
  TrackedTxConfigEntry,
  'id'
>

type TrackedTxConfig =
  | TrackedTxFunctionCallConfig
  | TrackedTxTransferConfig
  | TrackedTxSharpSubmissionConfig
  | TrackedTxSharedBridgeConfig

interface TrackedTxConfigBase<T extends TrackedTxConfig = TrackedTxConfig> {
  id: TrackedTxId
  projectId: ProjectId
  sinceTimestamp: number
  untilTimestamp?: number
  params: T
  subtype: TrackedTxsConfigSubtype
}

export interface TrackedTxCostsConfig extends TrackedTxConfigBase {
  costMultiplier?: number
  type: 'l2costs'
}

export type TrackedTxLivenessConfig =
  | TrackedTxTransactionHashLivenessConfig
  | TrackedTxFunctionCallParameterLivenessConfig

export type TrackedTxTransactionHashLivenessConfig = TrackedTxConfigBase & {
  type: 'liveness'
  eventIdentity: TrackedTxTransactionHashEventIdentity
}

export type TrackedTxFunctionCallParameterLivenessConfig =
  TrackedTxConfigBase<TrackedTxFunctionCallConfig> & {
    type: 'liveness'
    eventIdentity: TrackedTxFunctionCallParameterEventIdentity
  }

export interface TrackedTxFunctionCallConfig {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
  signature: `function ${string}`
  topics?: string[]
}

export type TrackedTxLivenessEventIdentity =
  | TrackedTxTransactionHashEventIdentity
  | TrackedTxFunctionCallParameterEventIdentity

export interface TrackedTxTransactionHashEventIdentity {
  type: 'transactionHash'
}

export interface TrackedTxFunctionCallParameterEventIdentity {
  type: 'functionCallParameter'
  /** Index path through the decoded function arguments, including tuple indices. */
  path: readonly [number, ...number[]]
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
