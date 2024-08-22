import { decodeFunctionData, encodeFunctionData, parseAbiItem } from 'viem'

export function decode(data: `0x${string}`, abi: string[]) {
  for (const fn of abi) {
    try {
      const abiItem = parseAbiItem(fn)
      if (abiItem.type !== 'function') {
        continue
      }
      const decoded = decodeFunctionData({
        abi: [abiItem],
        data,
      })
      const encoded = encodeFunctionData({
        abi: [abiItem],
        ...decoded,
      })
      const extradata: `0x${string}` = `0x${data.slice(encoded.length)}`
      return {
        abiItem,
        decoded,
        extradata,
      }
    } catch (e) {
      console.error(e)
      continue
    }
  }
}
