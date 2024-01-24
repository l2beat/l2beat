import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { LivenessId } from './LivenessId'

export type LivenessConfigEntry =
  | LivenessFunctionCall
  | LivenessTransfer
  | LivenessSharpSubmission

interface LivenessConfigBase {
  id: LivenessId
  projectId: ProjectId
  type: LivenessType
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface LivenessFunctionCall extends LivenessConfigBase {
  formula: 'functionCall'
  address: EthereumAddress
  selector: string
}

export function makeLivenessFunctionCall(
  values: Omit<LivenessFunctionCall, 'id'>,
): LivenessFunctionCall {
  const id = LivenessId([
    ...baseValues(values),
    values.address.toString(),
    values.selector,
  ])
  return { id, ...values }
}

export interface LivenessTransfer extends LivenessConfigBase {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
}

export function makeLivenessTransfer(
  values: Omit<LivenessTransfer, 'id'>,
): LivenessTransfer {
  const id = LivenessId([
    ...baseValues(values),
    values.from.toString(),
    values.to.toString(),
  ])
  return { id, ...values }
}

export interface LivenessSharpSubmission extends LivenessConfigBase {
  formula: 'sharpSubmission'
  address: EthereumAddress
  selector: string
  programHashes: string[]
}

const sharpAddress = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
const sharpSelector = '0x9b3b76cc'

export function makeLivenessSharpSubmissions(
  values: Omit<LivenessSharpSubmission, 'id' | 'address' | 'selector'>,
): LivenessSharpSubmission {
  const id = LivenessId([...baseValues(values), ...values.programHashes])
  return { id, ...values, address: sharpAddress, selector: sharpSelector }
}

function baseValues(values: Omit<LivenessConfigEntry, 'id'>) {
  return [
    values.projectId.toString(),
    values.type,
    values.sinceTimestamp.toString(),
    values.formula,
  ]
}
