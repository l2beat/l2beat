import { UnixTime } from '@l2beat/shared-pure'
import { type Parser, v } from '@l2beat/validate'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AppState } from '../kysely/generated/types'

const KEYS = ['interopAggregatesTimestampOverride', 'example'] as const

export type AppStateKey = v.infer<typeof AppStateKey>
export const AppStateKey = v.enum(KEYS)

export type AppStatePair = v.infer<typeof AppStatePair>
export const AppStatePair = v.union([
  v.object({
    key: v.literal('interopAggregatesTimestampOverride'),
    value: v.union([v.string().transform((v) => Number(v)), v.number()]),
  }),
  v.object({
    key: v.literal('example'),
    value: v.string(),
  }),
]) satisfies Parser<{
  key: AppStateKey
  value: unknown
}>

type ValueForKey<K extends AppStatePair['key']> = Extract<
  AppStatePair,
  { key?: K }
>['value']

export interface AppStateRecord<
  T extends AppStatePair['key'] = AppStatePair['key'],
> {
  key: T
  value: ValueForKey<T>
  updatedAt: UnixTime
  updatedBy: string
}

export class AppStateRepository extends BaseRepository {
  async set<T extends AppStatePair['key']>(
    record: Omit<AppStateRecord<T>, 'updatedAt'>,
  ): Promise<void> {
    const row = toRow({ ...record, updatedAt: UnixTime.now() })
    await this.db
      .insertInto('AppState')
      .values(row)
      .onConflict((oc) => oc.column('key').doUpdateSet(row))
      .execute()
  }

  async get<T extends AppStatePair['key']>(
    key: T,
  ): Promise<AppStateRecord<T> | undefined> {
    const row = await this.db
      .selectFrom('AppState')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('AppState').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function toRecord<T extends AppStatePair['key']>(
  row: Selectable<AppState>,
): AppStateRecord<T> {
  const parsed = AppStatePair.parse({ key: row.key, value: row.value })
  return {
    key: parsed.key as T,
    value: parsed.value as ValueForKey<T>,
    updatedAt: UnixTime.fromDate(row.updatedAt),
    updatedBy: row.updatedBy,
  }
}

function toRow<T extends AppStatePair['key']>(
  record: Omit<AppStateRecord<T>, 'id'>,
): Insertable<AppState> {
  return {
    key: record.key,
    value: record.value.toString(),
    updatedAt: UnixTime.toDate(record.updatedAt),
    updatedBy: record.updatedBy,
  }
}
