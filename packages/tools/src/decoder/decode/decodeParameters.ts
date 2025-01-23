import {
  decodeAbiParameters,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'
import type { DecodedResult } from './DecodedResult'
import { mix } from './mix'

export function decodeParameters(
  data: `0x${string}`,
  abi: string,
): DecodedResult {
  const parameters = parseAbiParameters(abi.slice(1, -1))

  const decoded = decodeAbiParameters(parameters, data)
  const values = mix(parameters, decoded)

  const encoded = encodeAbiParameters(parameters, decoded)
  const extra = data.slice(encoded.length).toLowerCase()
  if (extra.length > 0) {
    values.push({
      stack: ['unexpected extra data'],
      type: 'bytes',
      value: `0x${extra}`,
    })
  }

  return {
    type: 'parameters',
    abi: abi,
    values,
  }
}
