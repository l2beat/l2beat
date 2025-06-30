import { useCallback, useState } from 'react'
import type { LineSelection } from '../extensions/lineSelector'
import { LineSelector } from '../extensions/lineSelector'
import { useFlagFromQueryParam, useQueryParam } from './useFlagFromQueryParam'

export function useUrlState() {
  const foldParam = useFlagFromQueryParam('fold')
  const removeUnchangedParam = useFlagFromQueryParam('removeUnchanged')
  const removeCommentsParam = useFlagFromQueryParam('removeComments')
  const linesParam = useQueryParam('lines')

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
      url.searchParams.set('lines', LineSelector.encode(selection))

      if (removeUnchanged) {
        url.searchParams.set('removeUnchanged', 'true')
      }

      if (removeComments) {
        url.searchParams.set('removeComments', 'true')
      }

      if (fold) {
        url.searchParams.set('fold', 'true')
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
