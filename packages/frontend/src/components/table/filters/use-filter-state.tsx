import { assertUnreachable } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { useReducer } from 'react'

type Filter = {
  id: string
  label: string
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
    id: string
    label: string
    value: string
  }
}

type RemoveFilterAction = {
  type: 'remove'
  id: string
}

type ClearFilterAction = {
  type: 'clear'
}

type SetReversedFilterAction = {
  type: 'setReversed'
  payload: {
    id: string
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
          label: action.payload.label,
          values: [action.payload.value],
          reversed: false,
        },
      ]
    case 'remove':
      return state.filter((filter) => filter.id !== action.id)
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
