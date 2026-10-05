import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

type StoredRecord = Omit<PrivacyAnonymitySetEventRecord, 'amount'> & {
  amount: string
}

/**
 * Prototype stand-in for PrivacyAnonymitySetEventRepository. Keeps the same
 * record shape and upsert/delete semantics, but persists to a JSON file so
 * Starknet data can be collected without a schema change (senders are 66
 * characters, the DB column fits 42).
 */
export class StarknetAnonymitySetFileStore {
  private records: Map<string, PrivacyAnonymitySetEventRecord> | undefined

  constructor(readonly filePath: string) {}

  async upsertMany(records: PrivacyAnonymitySetEventRecord[]): Promise<number> {
    if (records.length === 0) return 0
    const current = await this.load()
    for (const record of records) {
      current.set(recordKey(record), record)
    }
    await this.save()
    return records.length
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    const ids = new Set(configurationIds)
    return await this.deleteWhere((record) => ids.has(record.configurationId))
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    return await this.deleteWhere(
      (record) =>
        record.configurationId === configurationId &&
        record.timestamp >= fromInclusive &&
        record.timestamp <= toInclusive,
    )
  }

  async getAll(): Promise<PrivacyAnonymitySetEventRecord[]> {
    return Array.from((await this.load()).values())
  }

  private async deleteWhere(
    predicate: (record: PrivacyAnonymitySetEventRecord) => boolean,
  ): Promise<number> {
    const current = await this.load()
    let deleted = 0
    for (const [key, record] of current) {
      if (predicate(record)) {
        current.delete(key)
        deleted++
      }
    }
    if (deleted > 0) await this.save()
    return deleted
  }

  private async load(): Promise<Map<string, PrivacyAnonymitySetEventRecord>> {
    if (this.records) return this.records

    this.records = new Map()
    if (existsSync(this.filePath)) {
      const stored = JSON.parse(
        await readFile(this.filePath, 'utf8'),
      ) as StoredRecord[]
      for (const record of stored) {
        const parsed = {
          ...record,
          timestamp: UnixTime(record.timestamp),
          amount: BigInt(record.amount),
        }
        this.records.set(recordKey(parsed), parsed)
      }
    }
    return this.records
  }

  private async save(): Promise<void> {
    const records = Array.from((await this.load()).values()).sort(
      (a, b) =>
        a.timestamp - b.timestamp ||
        a.blockNumber - b.blockNumber ||
        a.logIndex - b.logIndex ||
        a.configurationId.localeCompare(b.configurationId),
    )
    const stored: StoredRecord[] = records.map((record) => ({
      ...record,
      amount: record.amount.toString(),
    }))

    await mkdir(dirname(this.filePath), { recursive: true })
    const tmpPath = `${this.filePath}.tmp`
    await writeFile(tmpPath, `${JSON.stringify(stored, null, 2)}\n`)
    await rename(tmpPath, this.filePath)
  }
}

function recordKey(record: PrivacyAnonymitySetEventRecord): string {
  return `${record.configurationId}:${record.txHash}:${record.logIndex}`
}
