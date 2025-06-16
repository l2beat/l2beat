import { assertUnreachable } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import { useEffect, useReducer } from 'react'
import { z } from 'zod'
import { useQueryParam } from '~/hooks/useQueryParam'
import { useTracking } from '~/hooks/useTracking'
import { FilterableValueId } from './filterableValue'

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

  const [filters, setFilters] = useQueryParam('filters', '{}', {
    replaceState: true,
  })

  const [state, dispatch] = useReducer(
    (state: FilterState, action: FilterAction) =>
      filterReducer(state, action, track),
    safeParse(filters),
  )

  useEffect(() => {
    setFilters(Object.keys(state).length > 0 ? JSON.stringify(state) : '{}')
  }, [state, setFilters])

  return {
    state,
    dispatch,
  }
}

function safeParse(filters: string) {
  try {
    return JSON.parse(filters)
  } catch (_) {
    return {}
  }
}
