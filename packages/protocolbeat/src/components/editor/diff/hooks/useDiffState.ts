import { useMemo, useState } from 'react'
import type { Diff } from '../diffEditor'
import { splitCode } from '../utils/soliditySplitter'

export function useDiffState(
  leftCode: Record<string, string>,
  rightCode: Record<string, string>,
  leftAddress: string,
  rightAddress: string,
  removeUnchanged: boolean,
  removeComments: boolean,
  swapped: boolean,
) {
  const [diff, setDiff] = useState<Diff | undefined>(undefined)

  const [actualLeftAddress, actualRightAddress] = swapped
    ? [rightAddress, leftAddress]
    : [leftAddress, rightAddress]

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
    leftAddress: actualLeftAddress,
    rightAddress: actualRightAddress,
    setDiff,
    splitLeft,
    splitRight,
  }
}
