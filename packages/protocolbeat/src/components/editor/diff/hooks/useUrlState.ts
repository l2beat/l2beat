import { useCallback, useState } from 'react'
import {
  useFlagFromQueryParam,
  useQueryParam,
} from '../../../../hooks/useFlagFromQueryParam'
import type { LineSelection } from '../extensions/lineSelector'
import { LineSelector } from '../extensions/lineSelector'

const SEARCH_PARAMS = {
  lines: 'lines',
  removeUnchanged: 'removeUnchanged',
  removeComments: 'removeComments',
  fold: 'fold',
}

export function useUrlState() {
  const foldParam = useFlagFromQueryParam(SEARCH_PARAMS.fold)
  const removeUnchangedParam = useFlagFromQueryParam(
    SEARCH_PARAMS.removeUnchanged,
  )
  const removeCommentsParam = useFlagFromQueryParam(
    SEARCH_PARAMS.removeComments,
  )
  const linesParam = useQueryParam(SEARCH_PARAMS.lines)

  const [shareableUrl, setShareableUrl] = useState<string | null>(null)

  const buildShareableUrl = useCallback(
    (
      selection: LineSelection | null,
      removeUnchanged: boolean,
      removeComments: boolean,
      fold: boolean,
    ) => {
      if (!selection) {
        setShareableUrl(null)
        return
      }

      const url = new URL(window.location.href)

      for (const param of Object.values(SEARCH_PARAMS)) {
        url.searchParams.delete(param)
      }

      url.searchParams.set(SEARCH_PARAMS.lines, LineSelector.encode(selection))

      if (removeUnchanged) {
        url.searchParams.set(SEARCH_PARAMS.removeUnchanged, 'true')
      }

      if (removeComments) {
        url.searchParams.set(SEARCH_PARAMS.removeComments, 'true')
      }

      if (fold) {
        url.searchParams.set(SEARCH_PARAMS.fold, 'true')
      }

      setShareableUrl(url.toString())
    },
    [],
  )

  const swapAddresses = useCallback(
    (leftAddress: string, rightAddress: string) => {
      const currentUrl = new URL(window.location.href)
      const queryParams = currentUrl.searchParams.toString()
      const newPath = `/diff/${rightAddress}/${leftAddress}`
      const newUrl = queryParams ? `${newPath}?${queryParams}` : newPath
      window.history.replaceState(null, '', newUrl)
    },
    [],
  )

  return {
    queryParams: {
      removeUnchanged: removeUnchangedParam,
      removeComments: removeCommentsParam,
      lines: linesParam,
      fold: foldParam,
    },
    shareableUrl,
    buildShareableUrl,
    swapAddresses,
  }
}
