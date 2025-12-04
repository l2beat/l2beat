import { useEffect } from 'react'
import { useCodeStore } from '../../store'
import { useLineSelection } from './useLineSelection'
import { useUrlState } from './useUrlState'

export function useCodeSettings() {
  const { resetRange } = useCodeStore()

  const { queryParams, shareableUrl, buildShareableUrl, getCleanUrl } =
    useUrlState()

  const { selection, initialSelection, setSelection, clearSelection } =
    useLineSelection(queryParams.lines)

  useEffect(() => {
    buildShareableUrl(selection)
  }, [selection, buildShareableUrl])

  useEffect(() => {
    if (shareableUrl) {
      window.history.pushState(null, '', shareableUrl)
    } else {
      const url = getCleanUrl()
      window.history.pushState(null, '', url)
    }
  }, [shareableUrl])

  return {
    initialSelection,
    setSelection,
    clearSelection,
    resetRange,
  }
}
