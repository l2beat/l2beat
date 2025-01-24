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
      } else if (abiItem === 'plugin:multisend') {
        return decodeMultisend(data)
      } else if (abiItem.startsWith('(')) {
        return decodeParameters(data, abiItem)
      } else {
        return {
          type: 'error',
          error: 'Cannot decode data. See console for details.',
        }
      }
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
