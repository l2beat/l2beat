import { useMemo, useState } from 'react'
import type { Diff } from '../diffEditor'
import { splitCode } from '../utils/soliditySplitter'

export function useDiffState(
  leftCode: Record<string, string>,
  rightCode: Record<string, string>,
  removeUnchanged: boolean,
  removeComments: boolean,
  swapped: boolean,
) {
  const [diff, setDiff] = useState<Diff | undefined>(undefined)

  const [actualLeftCode, actualRightCode] = swapped
    ? [rightCode, leftCode]
    : [leftCode, rightCode]

  const [splitLeft, splitRight] = useMemo(() => {
    return splitCode(
      actualLeftCode,
      actualRightCode,
      removeUnchanged,
      removeComments,
    )
  }, [actualLeftCode, actualRightCode, removeUnchanged, removeComments])

  return {
    diff,
    setDiff,
    splitLeft,
    splitRight,
  }
}
