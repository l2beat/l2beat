import type { ComputedDiff } from './computeDiff'

export type DiffVerdict =
  | 'different'
  | 'identical'
  | 'formattingDiffers'
  | 'sameIgnoringComments'

// Comments ignored by the filter may also be hidden earlier, with whole
// declarations that differ only in comments, so the verdict can't claim
// more than the code being the same.
export function getDiffVerdict(
  computed: ComputedDiff,
  ignoreComments: boolean,
): DiffVerdict {
  if (computed.lineChanges.length > 0) {
    return 'different'
  }
  if (ignoreComments) {
    return 'sameIgnoringComments'
  }
  if (computed.filteredChanges.length > 0) {
    return 'formattingDiffers'
  }
  return 'identical'
}
