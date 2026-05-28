import { UnixTime } from '@l2beat/shared-pure'
import { type Parser, v } from '@l2beat/validate'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { KeyValue } from '../kysely/generated/types'

const KEY_VALUE_SCHEMAS = {
  'interop-aggregate-timestamp-override': v.union([
    v.number(),
    v
      .string()
      .transform((s) => Number(s))
      .check((n) => !isNaN(n) && Number.isSafeInteger(n)),
  ]),
} as const satisfies Record<string, Parser<unknown>>

type KeyValueSchemas = typeof KEY_VALUE_SCHEMAS

export type KeyValueKey = keyof KeyValueSchemas & string
export type KeyValuePair = {
  [K in KeyValueKey]: { key: K; value: v.infer<KeyValueSchemas[K]> }
}[KeyValueKey]

const keys = Object.keys(KEY_VALUE_SCHEMAS) as [KeyValueKey, ...KeyValueKey[]]

function unionOf<T>(items: readonly [Parser<T>, ...Parser<T>[]]): Parser<T> {
  if (items.length === 1) return items[0]
  return v.union(items as unknown as [Parser<T>, Parser<T>, ...Parser<T>[]])
}

export const KeyValueKey: Parser<KeyValueKey> = unionOf(
  keys.map((k) => v.literal(k)) as unknown as [
    Parser<KeyValueKey>,
    ...Parser<KeyValueKey>[],
  ],
)

export const KeyValuePair: Parser<KeyValuePair> = unionOf(
  keys.map((k) =>
    v.object({ key: v.literal(k), value: KEY_VALUE_SCHEMAS[k] }),
  ) as unknown as [Parser<KeyValuePair>, ...Parser<KeyValuePair>[]],
)

type KeyToValue = {
  [K in KeyValuePair['key']]: Extract<KeyValuePair, { key: K }>['value']
}

export interface KeyValueRecord<T extends KeyValuePair['key']> {
  key: T
  value: KeyToValue[T]
  updatedAt: UnixTime
  updatedBy: string
}

export function toRecord<T extends KeyValuePair['key']>(
  row: Selectable<KeyValue>,
): KeyValueRecord<T> {
  const parsed = KeyValuePair.parse({ key: row.key, value: row.value })
  return {
    key: parsed.key as T,
    value: parsed.value,
    updatedAt: UnixTime.fromDate(row.updatedAt),
    updatedBy: row.updatedBy,
  }
}

export function toRow<T extends KeyValuePair['key']>(
  record: Omit<KeyValueRecord<T>, 'id'>,
): Insertable<KeyValue> {
  return {
    key: record.key,
    value: record.value.toString(),
    updatedAt: UnixTime.toDate(record.updatedAt),
    updatedBy: record.updatedBy,
  }
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
