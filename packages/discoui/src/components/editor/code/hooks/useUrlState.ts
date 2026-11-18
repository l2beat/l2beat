import { useQueryParam } from '../../../../hooks/useFlagFromQueryParam'
import type { LineSelection } from '../plugins/lineSelector'
import { LineSelector } from '../plugins/lineSelector'

const SEARCH_PARAMS = {
  lines: 'lines',
}

export function useUrlState() {
  const linesParam = useQueryParam(SEARCH_PARAMS.lines)

  return {
    queryParams: {
      lines: linesParam,
    },
    buildShareableUrl,
  }
}

// Without a selection, the URL loses only the parameters this view owns.
function buildShareableUrl(selection: LineSelection | null): string {
  const url = new URL(window.location.href)
  for (const param of Object.values(SEARCH_PARAMS)) {
    url.searchParams.delete(param)
  }
  if (selection !== null) {
    url.searchParams.set(SEARCH_PARAMS.lines, LineSelector.encode(selection))
  }
  return url.toString()
}
