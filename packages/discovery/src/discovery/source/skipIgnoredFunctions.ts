import { makeFragment } from './deduplicateAbi.js'

export function skipIgnoredFunctions(
  abi: string[],
  ignoreInWatchMode?: string[],
): string[] {
  if (!ignoreInWatchMode) {
    return abi
  }
  const relevantAbi = []
  for (const entry of abi) {
    const fragment = makeFragment(entry)
    if (!fragment) {
      continue
    }
    const name = fragment.name
    if (!ignoreInWatchMode.includes(name)) {
      relevantAbi.push(entry)
    }
  }
  return relevantAbi
}
