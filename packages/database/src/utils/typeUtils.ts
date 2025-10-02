import type { Selectable, Updateable } from 'kysely'

// Drops optional/undefined from a given set of fields
type WithPrimaryKey<T, K extends keyof T> = {
  [P in K]-?: Exclude<T[P], undefined>
} & {
  [P in Exclude<keyof T, K>]: T[P]
}

// Turn "X | null" into "X | undefined"
// Useful when undefined means "don't change", null means "set to NULL"
type ReplaceNulls<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K]
}

// AsRecord serves both as Selectable and Insertable
// It combines Selectable with ReplaceNulls
export type AsRecord<T> = Selectable<ReplaceNulls<T>>

// AsUpdateable is the patch/SET shape for updates
// It combines WithPrimaryKey (so that PK can't be undefined) with Updateable
export type AsUpdate<T, K extends keyof Updateable<T>> = WithPrimaryKey<
  Updateable<T>,
  K
>

export function toRecord<T extends object>(obj: T): ReplaceNulls<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as ReplaceNulls<T>
}
