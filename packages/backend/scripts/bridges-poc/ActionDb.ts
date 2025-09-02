import type { Action, ActionDb, ActionType } from './plugins/types'

export class ActionDbImpl implements ActionDb {
  constructor(public actions: Action[]) {}

  find<T>(type: ActionType<T>, query?: Partial<T>): Action<T> | undefined {
    return this.actions.find((a): a is Action<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.payload, query)
    })
  }

  findAll<T>(type: ActionType<T>, query?: Partial<T>): Action<T>[] {
    return this.actions.filter((a): a is Action<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.payload, query)
    })
  }
}

function matchesQuery<T>(payload: T, query: Partial<T>): boolean {
  return Object.entries(query).every(([key, value]) => {
    // biome-ignore lint/suspicious/noExplicitAny: We want to do it old school
    return (payload as any)[key] === value
  })
}
