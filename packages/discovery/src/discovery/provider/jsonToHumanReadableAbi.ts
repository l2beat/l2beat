import { utils } from 'ethers'

export function jsonToHumanReadableAbi(json: string): string[] {
  try {
    return new utils.Interface(JSON.parse(json)).format(
      utils.FormatTypes.full,
    ) as string[]
  } catch {
    return []
  }
}
