import { useCallback, useState } from 'react'
import {
  useFlagFromQueryParam,
  useQueryParam,
} from '../../../../hooks/useFlagFromQueryParam'
import type { LineSelection } from '../plugins/lineSelector'
import { LineSelector } from '../plugins/lineSelector'

const SEARCH_PARAMS = {
  lines: 'lines',
  removeUnchanged: 'removeUnchanged',
  ignoreComments: 'ignoreComments',
  fold: 'fold',
}

export function useUrlState() {
  const foldParam = useFlagFromQueryParam(SEARCH_PARAMS.fold)
  const removeUnchangedParam = useFlagFromQueryParam(
    SEARCH_PARAMS.removeUnchanged,
  )
  const ignoreCommentsParam = useFlagFromQueryParam(
    SEARCH_PARAMS.ignoreComments,
  )
  const linesParam = useQueryParam(SEARCH_PARAMS.lines)

  const [shareableUrl, setShareableUrl] = useState<string | null>(null)

  const buildShareableUrl = useCallback(
    (
      selection: LineSelection | null,
      removeUnchanged: boolean,
      ignoreComments: boolean,
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

      if (ignoreComments) {
        url.searchParams.set(SEARCH_PARAMS.ignoreComments, 'true')
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
      ignoreComments: ignoreCommentsParam,
      lines: linesParam,
      fold: foldParam,
    },
    shareableUrl,
    buildShareableUrl,
    swapAddresses,
  }
}
