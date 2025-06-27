import { useEffect, useState } from 'react'
import type { DiffViewProps } from './DiffView'
import type { Diff } from './diffEditor'
import { type LineSelection, LineSelector } from './line-selector'
import { splitCode } from './soliditySplitter'
import { useFlagFromQueryParam, useQueryParam } from './useFlagFromQueryParam'

function useQueryParams() {
  const foldFromQueryParam = useFlagFromQueryParam('fold')
  const swappedFromQueryParam = useFlagFromQueryParam('swapped')
  const removeUnchangedFromQueryParam = useFlagFromQueryParam('removeUnchanged')
  const removeCommentsFromQueryParam = useFlagFromQueryParam('removeComments')
  const linesFromQueryParam = useQueryParam('lines')

  return {
    lines: linesFromQueryParam,
    fold: foldFromQueryParam,
    swapped: swappedFromQueryParam,
    removeUnchanged: removeUnchangedFromQueryParam,
    removeComments: removeCommentsFromQueryParam,
  }
}

export function useDiffEditorSettings(props: DiffViewProps) {
  const queryParams = useQueryParams()

  const [url, setUrl] = useState<string | null>(null)
  const [selection, setSelection] = useState<LineSelection | null>(null)
  const [initialSelection, setInitialSelection] =
    useState<LineSelection | null>(null)

  const [fold, setFold] = useState(queryParams.fold)
  const [swapped, setSwapped] = useState(queryParams.swapped)
  const [removeUnchanged, setRemoveUnchanged] = useState(
    queryParams.removeUnchanged ??
      !codeIsTheSame(props.leftCode, props.rightCode),
  )
  const [removeComments, setRemoveComments] = useState(
    queryParams.removeComments,
  )
  const [diff, setDiff] = useState<Diff | undefined>(undefined)

  useEffect(() => {
    const encoded = queryParams.lines
    if (encoded) {
      const selection = LineSelector.decode(encoded)
      setSelection(selection)
      setInitialSelection(selection)
    }
  }, [])

  useEffect(() => {
    const encoded = selection ? LineSelector.encode(selection) : null
    const url = new URL(window.location.href)

    if (!encoded) {
      setUrl(null)
      return
    }

    url.searchParams.set('lines', encoded)
    if (fold) {
      url.searchParams.set('fold', fold.toString())
    }
    if (swapped) {
      url.searchParams.set('swapped', swapped.toString())
    }
    if (removeUnchanged) {
      url.searchParams.set('removeUnchanged', removeUnchanged.toString())
    }
    if (removeComments) {
      url.searchParams.set('removeComments', removeComments.toString())
    }

    setUrl(url.toString())
  }, [selection])

  return {
    initialSelection,
    fold,
    swapped,
    removeUnchanged,
    removeComments,
    diff,
    url,
    setSelection,
    setFold,
    setSwapped,
    setRemoveUnchanged,
    setRemoveComments,
    setDiff,
  }
}

function codeIsTheSame(
  left: Record<string, string>,
  right: Record<string, string>,
): boolean {
  const [leftCode, rightCode] = splitCode(left, right)
  return leftCode === rightCode
}
