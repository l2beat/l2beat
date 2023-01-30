import { utils } from 'ethers'

export function jsonToHumanReadableAbi(json: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return new utils.Interface(JSON.parse(json)).format(
      utils.FormatTypes.full,
    ) as string[]
  } catch {
    return []
  }
}
