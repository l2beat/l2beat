import type { Insertable, Selectable, Updateable } from 'kysely'

// Turn "X | null" into "X | undefined"
// Useful when undefined means "don't change", null means "set to NULL"
type ReplaceNulls<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K]
}

export type AsInsertable<T> = UndefinedToOptional<Insertable<T>>
export type AsSelectable<T> = UndefinedToOptional<Selectable<ReplaceNulls<T>>>

// AsUpdateable is the patch/SET shape for updates
// It allows all fields to be optional/undefined, and removes primary key
export type AsPatch<
  T,
  PrimaryKey extends keyof Updateable<T>,
> = UndefinedToOptional<Omit<Updateable<T>, PrimaryKey>>

// Allows not passing the fields which are defined as "X | undefined"
type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export function toRecord<T extends object>(obj: T): ReplaceNulls<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as ReplaceNulls<T>
}
