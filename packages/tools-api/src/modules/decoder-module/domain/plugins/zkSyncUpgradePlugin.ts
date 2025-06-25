import { toFunctionSelector } from 'viem'
import type { Chain } from '../../../../config/types'
import type { DecodedCall } from '../DecodedResult'
import { toResultValue } from '../decode'
import { type AbiValue, decodeType, sliceBytes } from '../encoding'
import type { NestedCall } from './types'

const selectors = {
  sendToL1: toFunctionSelector('function sendToL1(bytes)'),
}

export function zkSyncUpgradePlugin(
  call: DecodedCall,
  chain: Chain,
): NestedCall[] | false {
  if (call.selector !== selectors.sendToL1 || chain.shortName !== 'zksync') {
    return false
  }
  const bytes = call.arguments[0]
  if (bytes?.decoded?.type !== 'bytes') {
    return false
  }

  // See: https://github.com/Cyfrin/zksync-upgrade-verification-rs/blob/97873df6671d484554351140abc456546e77638f/src/main.rs#L344

  let decoded: AbiValue
  try {
    decoded = decodeType(
      '((address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)',
      sliceBytes(bytes.decoded.value, 32),
    )
  } catch {
    return false
  }
  call.arguments[0] = toResultValue(decoded, chain)

  const tuple = call.arguments[0].decoded
  if (tuple?.type !== 'array') return false
  const array = tuple.values[0]?.decoded
  if (array?.type !== 'array') return false
  const calls = array.values.map((v): NestedCall => {
    if (v.decoded?.type !== 'array') throw new Error('Decoding failed')
    const target = v.decoded.values[0]?.decoded
    if (target?.type !== 'address') throw new Error('Decoding failed')
    const data = v.decoded.values[2]
    if (!data) throw new Error('Decoding failed')
    return { to: target.value, data }
  })

  return calls
}
