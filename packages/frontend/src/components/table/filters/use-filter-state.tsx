import { assertUnreachable } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { useReducer } from 'react'

type Filter = {
  id: string
  values: string[]
  reversed: boolean
}
export type FilterState = Filter[]

type FilterAction = AddFilterAction | RemoveFilterAction | ClearFilterAction

type AddFilterAction = {
  type: 'add'
  payload: Filter
}

type RemoveFilterAction = {
  type: 'remove'
  id: string
}

type ClearFilterAction = {
  type: 'clear'
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
                ...action.payload,
                values: uniq([
                  ...existingFilter.values,
                  ...action.payload.values,
                ]),
              }
            : filter,
        )
      }

      return [...state, action.payload]
    case 'remove':
      return state.filter((filter) => filter.id !== action.id)
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
