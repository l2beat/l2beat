import type { DecodedResult } from './DecodedResult'
import { decodeFunction } from './decodeFunction'
import { decodeMultisend } from './decodeMultisend'
import { decodeParameters } from './decodeParameters'

export function decode(data: `0x${string}`, abi: string[]): DecodedResult {
  for (const item of abi) {
    const abiItem = item.trim()
    try {
      if (abiItem.startsWith('function')) {
        return decodeFunction(data, abiItem)
      }
      if (abiItem === 'plugin:multisend') {
        return decodeMultisend(data)
      }
      return decodeParameters(data, abiItem)
    } catch (e) {
      console.error(`Error while decoding: ${abiItem}`, e)
      continue
    }
  }
  return {
    type: 'error',
    error: 'Cannot decode data. See console for details.',
  }
}
