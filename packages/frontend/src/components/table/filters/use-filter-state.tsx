import { assertUnreachable } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { useReducer } from 'react'
import { useTracking } from '~/hooks/use-tracking'
import type { FilterableValueId } from './types'

type Filter = {
  id: FilterableValueId
  values: string[]
  inversed: boolean
}
export type FilterState = Filter[]

type FilterAction =
  | AddFilterAction
  | RemoveFilterAction
  | ClearFilterAction
  | SetInversedFilterAction

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

type SetInversedFilterAction = {
  type: 'setInversed'
  payload: {
    id: FilterableValueId
    value: boolean
  }
}

// Our reducer function that uses a switch statement to handle our actions
function filterReducer(
  state: FilterState,
  action: FilterAction,
  track: ReturnType<typeof useTracking>['track'],
) {
  switch (action.type) {
    case 'add':
      const existingFilter = state.find(
        (filter) => filter.id === action.payload.id,
      )

      if (existingFilter) {
        const newValues = uniq([...existingFilter.values, action.payload.value])
        track('filterValueSelected', {
          props: {
            name: action.payload.id,
            value: action.payload.value,
            allValues: [...newValues].sort().join(','),
            additionalFilters: state.length - 1,
          },
        })
        return state.map((filter) =>
          filter.id === action.payload.id
            ? {
                ...filter,
                values: uniq([...newValues, action.payload.value]),
              }
            : filter,
        )
      }

      track('filterValueSelected', {
        props: {
          name: action.payload.id,
          value: action.payload.value,
          additionalFilters: state.length,
        },
      })
      return [
        ...state,
        {
          id: action.payload.id,
          values: [action.payload.value],
          inversed: false,
        },
      ]
    case 'remove':
      if (action.payload.value) {
        const updatedState = state.map((filter) =>
          filter.id === action.payload.id
            ? {
                ...filter,
                values: filter.values.filter((v) => v !== action.payload.value),
              }
            : filter,
        )
        const remainingFilters = updatedState.filter(
          (filter) => filter.values.length > 0,
        )
        if (remainingFilters.length === 0) {
          track('filterRemoved', {
            props: { name: action.payload.id },
          })
        }
        return remainingFilters
      }
      track('filterRemoved', {
        props: { name: action.payload.id },
      })
      return state.filter((filter) => filter.id !== action.payload.id)
    case 'setInversed':
      if (action.payload.value === true) {
        track('filterInversed', {
          props: {
            name: action.payload.id,
            allValues: [
              ...state.find((filter) => filter.id === action.payload.id)!
                .values,
            ]
              .sort()
              .join(','),
          },
        })
      }
      return state.map((filter) =>
        filter.id === action.payload.id
          ? { ...filter, inversed: action.payload.value }
          : filter,
      )
    case 'clear':
      return []
    default:
      assertUnreachable(action)
  }
}

export function useFilterState() {
  const { track } = useTracking()
  const [state, dispatch] = useReducer(
    (state: FilterState, action: FilterAction) =>
      filterReducer(state, action, track),
    [],
  )

  return {
    state,
    dispatch,
  }
}
