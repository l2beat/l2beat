import { useCallback } from 'react'
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
    buildShareableUrl,
    swapAddresses,
  }
}

function buildShareableUrl(
  selection: LineSelection | null,
  removeUnchanged: boolean,
  ignoreComments: boolean,
  fold: boolean,
): string | null {
  if (!selection) {
    return null
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

  return url.toString()
}
