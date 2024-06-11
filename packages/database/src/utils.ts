import { ColumnType } from 'kysely'

export type Clean<T> = {
  [K in keyof T]-?: T[K] extends ColumnType<infer S> ? S : T[K]
}
