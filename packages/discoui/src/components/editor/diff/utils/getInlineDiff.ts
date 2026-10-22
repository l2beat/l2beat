import type { Diff } from '../diffEditor'

export function getInlineDiff(diff: Diff, left: string, right: string): string {
  const result: string[] = []

  const leftLines = left.split('\n')
  const rightLines = right.split('\n')

  let lastCommonIndex = 0
  for (const change of diff.changes) {
    const [lStart, lEnd] = change.left
    const [rStart, rEnd] = change.right

    // A side without lines starts on the line before the change.
    const firstChangedIndex = lEnd > 0 ? lStart - 1 : lStart
    result.push(
      ...leftLines
        .slice(lastCommonIndex, firstChangedIndex)
        .map((l) => ` ${l}`),
    )

    if (lEnd > 0) {
      result.push(...leftLines.slice(lStart - 1, lEnd).map((l) => `-${l}`))
      lastCommonIndex = lEnd
    } else {
      lastCommonIndex = lStart
    }

    if (rEnd > 0) {
      result.push(...rightLines.slice(rStart - 1, rEnd).map((l) => `+${l}`))
    }
  }

  result.unshift('```diff')
  result.push('```')

  return result.join('\n')
}
