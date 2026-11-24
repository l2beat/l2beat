import { useEffect } from 'react'
import { useCodeStore } from '../../store'
import { useLineSelection } from './useLineSelection'
import { useUrlState } from './useUrlState'

export function useCodeSettings() {
  const { resetRange } = useCodeStore()

  const { queryParams, buildShareableUrl } = useUrlState()

  const { selection, initialSelection, setSelection, clearSelection } =
    useLineSelection(queryParams.lines)

  useEffect(() => {
    window.history.replaceState(null, '', buildShareableUrl(selection))
  }, [selection, buildShareableUrl])

  return {
    initialSelection,
    setSelection,
    clearSelection,
    resetRange,
  }
}
