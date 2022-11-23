import { utils } from 'ethers'
import { FormatTypes } from 'ethers/lib/utils'

export function jsonToHumanReadableAbi(json: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return new utils.Interface(JSON.parse(json)).format(
      FormatTypes.full,
    ) as string[]
  } catch {
    return []
  }
}
