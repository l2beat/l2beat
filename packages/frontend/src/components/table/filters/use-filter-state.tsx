import { assertUnreachable } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import { usePathname } from 'next/navigation'
import { useEffect, useReducer } from 'react'
import { z } from 'zod'
import { useTracking } from '~/hooks/use-tracking'
import { FilterableValueId } from './filterable-value'
import { getFilterSearchParams } from './utils/get-filter-search-params'

export type FilterValue = z.infer<typeof FilterValue>
export const FilterValue = z.object({
  values: z.array(z.string()),
  inversed: z.boolean().optional(),
})

export type FilterState = Partial<Record<FilterableValueId, FilterValue>>
export const FilterState = z.record(FilterableValueId, FilterValue)

type FilterAction =
  | AddFilterAction
  | RemoveFilterAction
  | ClearFilterAction
  | SetInversedFilterAction
  | SetFiltersAction
type AddFilterAction = {
  type: 'add'
  payload: {
    id: FilterableValueId
    value: string
  }
}

type RemoveFilterAction = {
  type: 'remove'
  payload: {
    id: FilterableValueId
    value?: string
  }
}

type ClearFilterAction = {
  type: 'clear'
}

type SetFiltersAction = {
  type: 'set'
  payload: {
    filters: FilterState
  }
}

type SetInversedFilterAction = {
  type: 'setInversed'
  payload: {
    id: FilterableValueId
    value: boolean
  }
}

function filterReducer(
  state: FilterState,
  action: FilterAction,
  track: ReturnType<typeof useTracking>['track'],
): FilterState {
  switch (action.type) {
    case 'add': {
      const existingFilter = state[action.payload.id]
      const newValues = existingFilter
        ? uniq([...existingFilter.values, action.payload.value])
        : [action.payload.value]

      track('filterValueSelected', {
        props: {
          name: action.payload.id,
          value: action.payload.value,
          allValues: [...newValues].sort().join(','),
          additionalFilters:
            Object.keys(state).length - (existingFilter ? 1 : 0),
        },
      })

      return {
        ...state,
        [action.payload.id]: {
          ...existingFilter,
          values: newValues,
        },
      }
    }

    case 'remove': {
      const newState = { ...state }

      if (action.payload.value) {
        const filter = state[action.payload.id]
        if (!filter) return state

        const newValues = filter.values.filter(
          (v) => v !== action.payload.value,
        )

        if (newValues.length === 0) {
          delete newState[action.payload.id]
          track('filterRemoved', {
            props: { name: action.payload.id },
          })
        } else {
          newState[action.payload.id] = {
            ...filter,
            values: newValues,
          }
        }
      } else {
        delete newState[action.payload.id]
        track('filterRemoved', {
          props: { name: action.payload.id },
        })
      }

      return newState
    }

    case 'setInversed': {
      const filter = state[action.payload.id]
      if (!filter) return state

      if (action.payload.value === true) {
        track('filterInversed', {
          props: {
            name: action.payload.id,
            allValues: [...filter.values].sort().join(','),
          },
        })
      }

      return {
        ...state,
        [action.payload.id]: {
          ...filter,
          inversed: action.payload.value,
        },
      }
    }

    case 'set': {
      return action.payload.filters
    }

    case 'clear':
      return {}

    default:
      assertUnreachable(action)
  }
}

export function useFilterState() {
  const { track } = useTracking()
  const pathname = usePathname()

  const [state, dispatch] = useReducer(
    (state: FilterState, action: FilterAction) =>
      filterReducer(state, action, track),
    {},
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const filters = params.get('filters')
    if (!filters) return
    dispatch({
      type: 'set',
      payload: {
        filters: FilterState.catch({}).parse(
          JSON.parse(decodeURIComponent(filters)),
        ),
      },
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (Object.keys(state).length > 0) {
      params.set('filters', getFilterSearchParams(state))
    } else {
      params.delete('filters')
    }

    if (params.size === 0) {
      window.history.replaceState(null, '', pathname)
    } else {
      window.history.replaceState(null, '', `${pathname}?${params.toString()}`)
    }
  }, [pathname, state])

  return {
    state,
    dispatch,
  }
}
