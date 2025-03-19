import { assertUnreachable } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { useReducer } from 'react'
import { useTracking } from '~/hooks/use-tracking'
import type { FilterableValueId } from './types'

export interface FilterValue {
  values: string[]
  inversed: boolean
}

export type FilterState = Partial<Record<FilterableValueId, FilterValue>>

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
          values: newValues,
          inversed: existingFilter?.inversed ?? false,
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

    case 'clear':
      return {}

    default:
      assertUnreachable(action)
  }
}

export function useFilterState() {
  const { track } = useTracking()
  const [state, dispatch] = useReducer(
    (state: FilterState, action: FilterAction) =>
      filterReducer(state, action, track),
    {},
  )

  return {
    state,
    dispatch,
  }
}
