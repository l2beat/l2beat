import { useEffect, useState } from 'react'
import type { LineSelection } from '../extensions/lineSelector'
import { LineSelector } from '../extensions/lineSelector'

export function useLineSelection(linesParam: string | null) {
  const [selection, setSelection] = useState<LineSelection | null>(null)
  const [initialSelection, setInitialSelection] =
    useState<LineSelection | null>(null)

  useEffect(() => {
    if (linesParam) {
      const decoded = LineSelector.decode(linesParam)
      setSelection(decoded)
      setInitialSelection(decoded)
    }
  }, [linesParam])

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
