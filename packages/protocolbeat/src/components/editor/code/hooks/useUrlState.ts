import { useCallback, useState } from 'react'
import { useQueryParam } from '../../../../hooks/useFlagFromQueryParam'
import type { LineSelection } from '../plugins/lineSelector'
import { LineSelector } from '../plugins/lineSelector'

const SEARCH_PARAMS = {
  lines: 'lines',
}

export function useUrlState() {
  const linesParam = useQueryParam(SEARCH_PARAMS.lines)

  const [shareableUrl, setShareableUrl] = useState<string | null>(null)

  const buildShareableUrl = useCallback((selection: LineSelection | null) => {
    if (!selection) {
      setShareableUrl(null)
      return
    }

    const url = getCleanUrl()

    url.searchParams.set(SEARCH_PARAMS.lines, LineSelector.encode(selection))

    setShareableUrl(url.toString())
  }, [])

  const getCleanUrl = () => {
    const url = new URL(window.location.href)
    for (const param of Object.values(SEARCH_PARAMS)) {
      url.searchParams.delete(param)
    }
    return url
  }

  return {
    queryParams: {
      lines: linesParam,
    },
    getCleanUrl,
    shareableUrl,
    buildShareableUrl,
  }
}
