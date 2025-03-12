import { assertUnreachable } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { useReducer } from 'react'
import type { FilterableValueId } from './new-types'

type Filter = {
  id: FilterableValueId
  values: string[]
  reversed: boolean
}
export type FilterState = Filter[]

type FilterAction =
  | AddFilterAction
  | RemoveFilterAction
  | ClearFilterAction
  | SetReversedFilterAction

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

type SetReversedFilterAction = {
  type: 'setReversed'
  payload: {
    id: FilterableValueId
    value: boolean
  }
}

// Our reducer function that uses a switch statement to handle our actions
function filterReducer(state: FilterState, action: FilterAction) {
  switch (action.type) {
    case 'add':
      const existingFilter = state.find(
        (filter) => filter.id === action.payload.id,
      )
      if (existingFilter) {
        return state.map((filter) =>
          filter.id === action.payload.id
            ? {
                ...filter,
                values: uniq([...existingFilter.values, action.payload.value]),
              }
            : filter,
        )
      }

      return [
        ...state,
        {
          id: action.payload.id,
          values: [action.payload.value],
          reversed: false,
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
        return updatedState.filter((filter) => filter.values.length > 0)
      }
      return state.filter((filter) => filter.id !== action.payload.id)
    case 'setReversed':
      return state.map((filter) =>
        filter.id === action.payload.id
          ? { ...filter, reversed: action.payload.value }
          : filter,
      )
    case 'clear':
      return []
    default:
      assertUnreachable(action)
  }
}

export function useFilterState() {
  const [state, dispatch] = useReducer(filterReducer, [])

  return {
    state,
    dispatch,
  }
}
