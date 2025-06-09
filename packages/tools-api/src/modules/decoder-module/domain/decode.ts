import { assertUnreachable } from '@l2beat/shared-pure'
import type { Chain } from '../../../config/types'
import type { DecodedCall, Value } from './DecodedResult'
import { type AbiValue, decodeType } from './encoding'

export function decode(signature: string, data: `0x${string}`, chain: Chain) {
  if (!signature.startsWith('function ')) {
    throw new Error('Abi provided is not a function')
  }
  const { decoded } = decodeType(signature, data)
  if (decoded.type !== 'call') {
    throw new Error('Programmer error, decoding failed')
  }
  const result: DecodedCall = {
    type: 'call',
    abi: signature,
    selector: decoded.selector,
    arguments: decoded.parameters.map((x) => toResultValue(x, chain)),
    extra: decoded.extra !== '0x' ? decoded.extra : undefined,
  }
  return result
}

export function toResultValue(value: AbiValue, chain: Chain): Value {
  const common = {
    abi: value.abi,
    name: value.name,
    encoded: value.encoded,
  }
  if (value.decoded.type === 'address') {
    return {
      ...common,
      decoded: {
        type: 'address',
        value: `${chain.shortName}:${value.decoded.value}`,
        explorerLink: `${chain.explorerUrl}/address/${value.decoded.value}`,
      },
    }
  }
  if (value.decoded.type === 'number') {
    return {
      ...common,
      decoded: { type: 'number', value: value.decoded.value },
    }
  }
  if (value.decoded.type === 'string') {
    return {
      ...common,
      decoded: {
        type: 'string',
        value: value.decoded.value,
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'bytes') {
    return {
      ...common,
      decoded: {
        type: 'bytes',
        dynamic: value.decoded.dynamic,
        value: value.decoded.value,
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'bool') {
    return {
      ...common,
      decoded: { type: 'boolean', value: value.decoded.value },
    }
  }
  if (value.decoded.type === 'array') {
    return {
      ...common,
      decoded: {
        type: 'array',
        values: value.decoded.value.map((x) => toResultValue(x, chain)),
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'call') {
    return {
      ...common,
      decoded: {
        type: 'call',
        abi: value.abi,
        selector: value.decoded.selector,
        arguments: value.decoded.parameters.map((x) => toResultValue(x, chain)),
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  assertUnreachable(value.decoded)
}
