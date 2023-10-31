import { assert, Hash256, hashJson, json } from '@l2beat/shared-pure'

import { LivenessFunctionCall, LivenessTransfer } from './LivenessConfig'

export interface LivenessConfigurationIdentifier extends String {
  _LivenessConfigHashBrand: string
}

type InputType =
  | Omit<LivenessTransfer, 'livenessConfigurationId' | 'latestSyncedTimestamp'>
  | Omit<
      LivenessFunctionCall,
      'livenessConfigurationId' | 'latestSyncedTimestamp'
    >

export function LivenessConfigurationIdentifier(value: InputType) {
  const hashInputs: string[] = []

  hashInputs.push(value.projectId.toString())
  hashInputs.push(value.type)
  hashInputs.push(value.sinceTimestamp.toString())

  if ('from' in value && 'to' in value) {
    hashInputs.push(value.from.toString())
    hashInputs.push(value.to.toString())
  }

  if ('address' in value && 'selector' in value) {
    hashInputs.push(value.address.toString())
    hashInputs.push(value.selector.toString())
  }

  return hashJson(hashInputs) as unknown as LivenessConfigurationIdentifier
}

LivenessConfigurationIdentifier.params = function (value: InputType): json {
  if ('from' in value && 'to' in value) {
    return {
      from: value.from.toString(),
      to: value.from.toString(),
    }
  }

  if ('address' in value && 'selector' in value) {
    return {
      address: value.address.toString(),
      selector: value.selector.toString(),
    }
  }

  assert(false, 'Runtime should not reach here')
}

LivenessConfigurationIdentifier.unsafe = function unsafe(value: string) {
  return value as unknown as LivenessConfigurationIdentifier
}

LivenessConfigurationIdentifier.random = function unsafe() {
  return Hash256.random() as unknown as LivenessConfigurationIdentifier
}
