import { decodeFunctionData, encodeFunctionData, parseAbiItem } from 'viem'
import type { DecodedResult } from './DecodedResult'
import { mix } from './mix'

export function decodeFunction(
  data: `0x${string}`,
  abi: string,
): DecodedResult {
  const selector = data.slice(0, 10).toLowerCase()
  const abiItem = parseAbiItem(abi)
  if (abiItem.type !== 'function') {
    throw new Error('Abi provided is not a function')
  }
  const decoded = decodeFunctionData({
    abi: [abiItem],
    data,
  })

  const encoded = encodeFunctionData({
    abi: [abiItem],
    ...decoded,
  })
  const extra = data.slice(encoded.length).toLowerCase()

  const values = mix(abiItem.inputs, decoded.args)
  if (extra.length > 0) {
    values.push({
      stack: ['unexpected extra data'],
      type: 'bytes',
      value: `0x${extra}`,
    })
  }

  return {
    type: 'function',
    name: abiItem.name,
    selector: selector as `0x${string}`,
    values,
  }
}
