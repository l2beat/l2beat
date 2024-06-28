import { assert } from '@l2beat/backend-tools'
import { TrackedTxId } from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import {
  Liveness,
  toRecord,
  toRecordWithTimestampAndSubtype,
  toRow,
  toTransactionRecordWithTimestamp,
} from './entity'

export class LivenessRepository {
  constructor(private readonly db: PostgresDatabase) {}
  async getAll() {
    const rows = await this.db
      .selectFrom('public.liveness')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getWithSubtypeDistinctTimestamp(projectId: ProjectId) {
    const configRows = await this.db
      .selectFrom('public.indexer_configurations')
      .selectAll()
      .execute()
    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const livenessRows = await this.db
      .selectFrom('public.liveness')
      .select(['timestamp', 'configuration_id'])
      .where('configuration_id', 'in', Array.from(configsMap.keys()))
      .distinctOn('timestamp')
      .orderBy('timestamp', 'desc')
      .execute()

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
      }
    })

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  /**
   *
   * @param projectId Filter only transactions for a specific project.
   * @param subtype Filter only transactions of a specific subtype.
   * @param from Lower bound timestamp, inclusive.
   * @param to Upper bound timestamp, exclusive.
   * @returns An array of transactions that fall within the specified time range.
   */
  async getTransactionsWithinTimeRange(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    from: UnixTime,
    to: UnixTime,
  ) {
    assert(from.toNumber() < to.toNumber(), 'From must be less than to')

    const configRows = await this.db
      .selectFrom('public.indexer_configurations')
      .selectAll()
      .execute()

    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.subtype === subtype.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const rows = await this.db
      .selectFrom('public.liveness')
      .select(['timestamp', 'block_number', 'tx_hash', 'configuration_id'])
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', Array.from(configsMap.keys())),
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<', to.toDate()),
        ]),
      )
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getTransactionWithSubtypeDistinctTimestamp(
    projectId: ProjectId,
    since: UnixTime,
  ) {
    const configRows = await this.db
      .selectFrom('public.indexer_configurations')
      .selectAll()
      .execute()

    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const livenessRows = await this.db
      .selectFrom('public.liveness')
      .select(['timestamp', 'tx_hash', 'configuration_id'])
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', Array.from(configsMap.keys())),
          eb('timestamp', '>=', since.toDate()),
        ]),
      )
      .distinctOn('timestamp')
      .orderBy('timestamp', 'asc')
      .execute()

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
        tx_hash: row.tx_hash,
      }
    })

    return rows.map(toTransactionRecordWithTimestamp)
  }

  async getByProjectIdAndType(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    since: UnixTime,
  ) {
    const configRows = await this.db
      .selectFrom('public.indexer_configurations')
      .selectAll()
      .execute()

    const projectConfigs = configRows
      .map((c) => {
        const properties = JSON.parse(c.properties)

        if (
          properties.projectId === projectId.toString() &&
          properties.subtype === subtype.toString() &&
          properties.type === 'liveness'
        ) {
          return [c.id, properties.subtype]
        }
      })
      .filter(notUndefined) as [string, TrackedTxsConfigSubtype][]

    const configsMap = new Map<string, TrackedTxsConfigSubtype>(projectConfigs)

    const livenessRows = await this.db
      .selectFrom('public.liveness')
      .select(['timestamp', 'configuration_id'])
      .where((eb) =>
        eb.and([
          eb('configuration_id', 'in', Array.from(configsMap.keys())),
          eb('timestamp', '>=', since.toDate()),
        ]),
      )
      .distinctOn('timestamp')
      .orderBy('timestamp', 'desc')
      .execute()

    const rows = livenessRows.map((row) => {
      const subtype = configsMap.get(row.configuration_id)
      assert(subtype, `Cannot find subtype for ${row.configuration_id}`)
      return {
        timestamp: row.timestamp,
        subtype,
        project_id: projectId,
      }
    })

    return rows.map(toRecordWithTimestampAndSubtype)
  }

  async addMany(records: Liveness[]) {
    if (records.length === 0) {
      return 0
    }

    const rows = records.map(toRow)

    await this.db.insertInto('public.liveness').values(rows).execute()

    return rows.length
  }

  deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
    trx?: Transaction,
  ) {
    const scope = trx ?? this.db

    return scope
      .deleteFrom('public.liveness')
      .where((eb) =>
        eb.and([
          eb('configuration_id', '=', id.toString()),
          eb('timestamp', '>=', deleteFromInclusive.toDate()),
        ]),
      )
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('public.liveness').execute()
  }
}
