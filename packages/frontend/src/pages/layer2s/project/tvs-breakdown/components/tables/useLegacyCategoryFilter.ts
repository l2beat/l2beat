import { useEffect } from 'react'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'

/** The asset category's label, as stored in filter URLs before it was renamed. */
const LEGACY_LABELS: Record<string, string> = { Others: 'Other' }

/**
 * Filter values are the category labels and live in the page URL, so links
 * shared before "Others" became "Other" would match no token. Rewrites those
 * values once, on load.
 */
export function useLegacyCategoryFilter() {
  const { state, dispatch } = useTableFilterContext()

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once, on the filters read from the URL
  useEffect(() => {
    const category = state.category
    if (!category?.values.some((value) => value in LEGACY_LABELS)) return
    dispatch({
      type: 'set',
      payload: {
        filters: {
          ...state,
          category: {
            ...category,
            values: category.values.map(
              (value) => LEGACY_LABELS[value] ?? value,
            ),
          },
        },
      },
    })
  }, [])
}
