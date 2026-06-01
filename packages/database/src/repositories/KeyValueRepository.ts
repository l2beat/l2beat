import { UnixTime } from '@l2beat/shared-pure'
import { type Parser, v } from '@l2beat/validate'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { KeyValue } from '../kysely/generated/types'

const KEYS = ['interopAggregatesTimestampOverride', 'example'] as const

export type KeyValueKey = v.infer<typeof KeyValueKey>
export const KeyValueKey = v.enum(KEYS)

export type KeyValuePair = v.infer<typeof KeyValuePair>
export const KeyValuePair = v.union([
  v.object({
    key: v.literal('interopAggregatesTimestampOverride'),
    value: v.union([v.string().transform((v) => Number(v)), v.number()]),
  }),
  v.object({
    key: v.literal('example'),
    value: v.string(),
  }),
]) satisfies Parser<{
  key: KeyValueKey
  value: unknown
}>

type ValueForKey<K extends KeyValuePair['key']> = Extract<
  KeyValuePair,
  { key?: K }
>['value']

export interface KeyValueRecord<
  T extends KeyValuePair['key'] = KeyValuePair['key'],
> {
  key: T
  value: ValueForKey<T>
  updatedAt: UnixTime
  updatedBy: string
}

export class KeyValueRepository extends BaseRepository {
  async set<T extends KeyValuePair['key']>(
    record: Omit<KeyValueRecord<T>, 'updatedAt'>,
  ): Promise<void> {
    const row = toRow({ ...record, updatedAt: UnixTime.now() })
    await this.db
      .insertInto('KeyValue')
      .values(row)
      .onConflict((oc) => oc.column('key').doUpdateSet(row))
      .execute()
  }

  async get<T extends KeyValuePair['key']>(
    key: T,
  ): Promise<KeyValueRecord<T> | undefined> {
    const row = await this.db
      .selectFrom('KeyValue')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('KeyValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function toRecord<T extends KeyValuePair['key']>(
  row: Selectable<KeyValue>,
): KeyValueRecord<T> {
  const parsed = KeyValuePair.parse({ key: row.key, value: row.value })
  return {
    key: parsed.key as T,
    value: parsed.value as ValueForKey<T>,
    updatedAt: UnixTime.fromDate(row.updatedAt),
    updatedBy: row.updatedBy,
  }
}

function toRow<T extends KeyValuePair['key']>(
  record: Omit<KeyValueRecord<T>, 'id'>,
): Insertable<KeyValue> {
  return {
    key: record.key,
    value: record.value.toString(),
    updatedAt: UnixTime.toDate(record.updatedAt),
    updatedBy: record.updatedBy,
  }
}
