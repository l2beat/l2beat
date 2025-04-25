import type { DecodedResult } from './DecodedResult'
import { decodeFunction } from './decodeFunction'

export function decode(data: `0x${string}`, abi: string[]): DecodedResult {
  for (const item of abi) {
    try {
      return decodeFunction(data, item)
    } catch (e) {
      console.error(`Error while decoding: ${item}`, e)
      continue
    }
  }
  return {
    type: 'error',
    error: 'Cannot decode data. See console for details.',
  }
}
