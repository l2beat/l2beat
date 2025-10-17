import { useState } from 'react'
import type { LineSelection } from '../extensions/lineSelector'
import { LineSelector } from '../extensions/lineSelector'

export function useLineSelection(linesParam: string | null) {
  const decoded = linesParam === null ? null : LineSelector.decode(linesParam)

  const [selection, setSelection] = useState<LineSelection | null>(decoded)
  const [initialSelection, setInitialSelection] =
    useState<LineSelection | null>(decoded)

  const clearSelection = () => {
    setSelection(null)
    setInitialSelection(null)
  }

  return {
    selection,
    initialSelection,
    setSelection,
    clearSelection,
  }
}
