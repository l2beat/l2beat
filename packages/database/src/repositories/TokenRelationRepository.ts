import type {
  InteropBridgeType,
  KnownInteropBridgeType,
} from '@l2beat/shared-pure'
import type {
  Expression,
  ExpressionBuilder,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DB, TokenRelation } from '../kysely/generated/types'
import type { DeployedTokenPrimaryKey } from './DeployedTokenRepository'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Which endpoint of a `lockAndMint` relation holds the locked (escrowed) token;
 * the other endpoint holds the minted representation.
 *
 * `null` for a `burnAndMint` relation, which is symmetric — nothing is locked —
 * and for a `lockAndMint` relation whose evidence has not identified a side.
 */
export type TokenRelationLockedToken = 'A' | 'B' | null

/**
 * A relation is a fact about an unordered pair of tokens. The endpoints are
 * named A and B rather than from/to because there is no direction between them:
 * which one is A is decided by lexicographic order (see
 * `normalizeTokenRelation`), and what distinguishes the two tokens is their
 * role, carried by `lockedToken`.
 */
export type TokenRelationRecord = {
  tokenAChain: string
  tokenAAddress: string
  tokenBChain: string
  tokenBAddress: string
  plugin: string
  bridgeType: InteropBridgeType
  lockedToken: TokenRelationLockedToken
  transfer: JsonValue
}

export type TokenRelationRoute = Omit<TokenRelationRecord, 'transfer'>

export interface MintingPluginRecord extends DeployedTokenPrimaryKey {
  plugin: string
  bridgeType: KnownInteropBridgeType
  relatedChain: string
}

// The identity and role columns come back re-derived, so their literal types
// widen; anything else the caller passed in (e.g. `transfer`) is preserved.
type NormalizedTokenRelation<T> = Omit<T, keyof TokenRelationRoute> &
  TokenRelationRoute

export type TokenRelationPrimaryKey = Pick<
  TokenRelationRecord,
  | 'tokenAChain'
  | 'tokenAAddress'
  | 'tokenBChain'
  | 'tokenBAddress'
  | 'plugin'
  | 'bridgeType'
>

export type TokenRelationUpdateable = Omit<
  Updateable<TokenRelationRecord>,
  keyof TokenRelationPrimaryKey
>

/**
 * Puts a relation's endpoints in the lexicographic order the table stores them
 * in, moving `lockedToken` with them so the role assignment survives the swap.
 *
 * Every write path must call this before handing a relation to the repository.
 * It is deliberately explicit rather than hidden inside the repository: the
 * command that lands in `TokenDbHistory` and the ingestion log line have to
 * describe the row exactly as stored. A `CHECK` constraint on the table turns a
 * missed call into a loud failure instead of a silently duplicated pair.
 */
export function normalizeTokenRelation<T extends TokenRelationRoute>(
  relation: T,
): NormalizedTokenRelation<T> {
  const a = {
    chain: relation.tokenAChain,
    address: relation.tokenAAddress.toLowerCase(),
  }
  const b = {
    chain: relation.tokenBChain,
    address: relation.tokenBAddress.toLowerCase(),
  }
  if (isOrdered(a, b)) {
    return {
      ...relation,
      tokenAAddress: a.address,
      tokenBAddress: b.address,
    }
  }

  return {
    ...relation,
    tokenAChain: b.chain,
    tokenAAddress: b.address,
    tokenBChain: a.chain,
    tokenBAddress: a.address,
    lockedToken:
      relation.lockedToken === null
        ? null
        : relation.lockedToken === 'A'
          ? 'B'
          : 'A',
  }
}

// Same order as the table's `CHECK` constraint, which compares the endpoints as
// `(chain, address)` rows under the `C` collation — byte order, like JavaScript.
function isOrdered(
  a: { chain: string; address: string },
  b: { chain: string; address: string },
): boolean {
  if (a.chain !== b.chain) return a.chain < b.chain
  return a.address <= b.address
}

function toRecord(row: Selectable<TokenRelation>): TokenRelationRecord {
  return {
    tokenAChain: row.tokenAChain,
    tokenAAddress: row.tokenAAddress,
    tokenBChain: row.tokenBChain,
    tokenBAddress: row.tokenBAddress,
    plugin: row.plugin,
    bridgeType: row.bridgeType as InteropBridgeType,
    lockedToken: row.lockedToken as TokenRelationLockedToken,
    transfer: row.transfer as JsonValue,
  }
}

function toRow(record: TokenRelationRecord): Insertable<TokenRelation> {
  return {
    ...record,
    tokenAAddress: record.tokenAAddress.toLowerCase(),
    tokenBAddress: record.tokenBAddress.toLowerCase(),
  }
}

// Keeps each query's composite-key tuple list small enough to avoid
// overflowing both the Kysely query compiler and the Postgres parser stack.
const BATCH_SIZE = 1000

function tokenKey(token: DeployedTokenPrimaryKey): string {
  return `${token.chain}|${token.address.toLowerCase()}`
}

function mintingPluginKey(
  record: DeployedTokenPrimaryKey &
    Pick<MintingPluginRecord, 'plugin' | 'bridgeType' | 'relatedChain'>,
): string {
  return `${tokenKey(record)}|${record.plugin}|${record.bridgeType}|${record.relatedChain}`
}

export class TokenRelationRepository extends BaseRepository {
  async insert(record: TokenRelationRecord): Promise<void> {
    await this.db.insertInto('TokenRelation').values(toRow(record)).execute()
  }

  async findByPrimaryKey(
    pk: TokenRelationPrimaryKey,
  ): Promise<TokenRelationRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where('tokenAChain', '=', pk.tokenAChain)
      .where('tokenAAddress', '=', pk.tokenAAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenBChain)
      .where('tokenBAddress', '=', pk.tokenBAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByPrimaryKeys(
    keys: TokenRelationPrimaryKey[],
  ): Promise<TokenRelationRecord[]> {
    const rows: Selectable<TokenRelation>[] = []

    await this.batch(keys, BATCH_SIZE, async (batch) => {
      const keysByBridgeType = new Map<
        InteropBridgeType,
        TokenRelationPrimaryKey[]
      >()
      for (const key of batch) {
        const matchingKeys = keysByBridgeType.get(key.bridgeType) ?? []
        matchingKeys.push(key)
        keysByBridgeType.set(key.bridgeType, matchingKeys)
      }
      rows.push(
        ...(await this.db
          .selectFrom('TokenRelation')
          .selectAll()
          .where((eb) =>
            eb.or(
              [...keysByBridgeType].map(([bridgeType, matchingKeys]) =>
                eb.and([
                  eb('bridgeType', '=', bridgeType),
                  eb(
                    eb.refTuple(
                      'tokenAChain',
                      'tokenAAddress',
                      'tokenBChain',
                      'tokenBAddress',
                      'plugin',
                    ),
                    'in',
                    matchingKeys.map((key) =>
                      eb.tuple(
                        key.tokenAChain,
                        key.tokenAAddress.toLowerCase(),
                        key.tokenBChain,
                        key.tokenBAddress.toLowerCase(),
                        key.plugin,
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          )
          .execute()),
      )
    })

    return rows.map(toRecord)
  }

  async updateByPrimaryKey(
    pk: TokenRelationPrimaryKey,
    patch: TokenRelationUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('TokenRelation')
      .set(patch)
      .where('tokenAChain', '=', pk.tokenAChain)
      .where('tokenAAddress', '=', pk.tokenAAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenBChain)
      .where('tokenBAddress', '=', pk.tokenBAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async getAll(): Promise<TokenRelationRecord[]> {
    const rows = await this.db.selectFrom('TokenRelation').selectAll().execute()
    return rows.map(toRecord)
  }

  async getAllRoutes(): Promise<TokenRelationRoute[]> {
    const rows = await this.db
      .selectFrom('TokenRelation')
      .select([
        'tokenAChain',
        'tokenAAddress',
        'tokenBChain',
        'tokenBAddress',
        'plugin',
        'bridgeType',
        'lockedToken',
      ])
      .execute()

    return rows.map((row) => ({
      ...row,
      bridgeType: row.bridgeType as InteropBridgeType,
      lockedToken: row.lockedToken as TokenRelationLockedToken,
    }))
  }

  /**
   * Every relation mentioning this token, on either endpoint. Endpoint order is
   * lexicographic rather than a direction, so there is nothing to split into
   * inbound and outbound — `lockedToken` tells the caller the token's role.
   */
  async getRelationsFor(
    token: DeployedTokenPrimaryKey,
  ): Promise<TokenRelationRecord[]> {
    const address = token.address.toLowerCase()
    const rows = await this.db
      .selectFrom('TokenRelation')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and([
            eb('tokenAChain', '=', token.chain),
            eb('tokenAAddress', '=', address),
          ]),
          eb.and([
            eb('tokenBChain', '=', token.chain),
            eb('tokenBAddress', '=', address),
          ]),
        ]),
      )
      .execute()

    return rows.map(toRecord)
  }

  /**
   * Distinct names of the plugins observed minting this token — the plugins
   * of every relation in which this token is minted:
   *
   * - a `lockAndMint` relation whose locked endpoint is the *other* one,
   *   making this token the minted representation, or
   * - a `burnAndMint` relation mentioning the token — the pair is symmetric,
   *   so both endpoints are minted.
   *
   * A `lockAndMint` relation whose locked endpoint is not identified
   * (`lockedToken` null) names no minter: one of its endpoints is minted, but
   * nothing says it is this one.
   */
  async getMintingPluginsFor(
    token: DeployedTokenPrimaryKey,
  ): Promise<string[]> {
    return [
      ...new Set(
        (await this.getMintingPluginsForMany([token])).map(
          (record) => record.plugin,
        ),
      ),
    ].sort((a, b) => a.localeCompare(b))
  }

  /**
   * Batch variant of {@link getMintingPluginsFor}: one distinct
   * (token, plugin, bridgeType, relatedChain) record per qualifying relation
   * in which this token is minted. `relatedChain` is the other endpoint of
   * that relation, used with this token's chain as plugin chain qualifiers.
   *
   * Input addresses are matched case-insensitively; returned addresses are
   * as stored, lowercase — group results by lowercased address, not by
   * comparing against the input.
   */
  async getMintingPluginsForMany(
    tokens: DeployedTokenPrimaryKey[],
  ): Promise<MintingPluginRecord[]> {
    const result = new Map<string, MintingPluginRecord>()

    await this.batch(tokens, BATCH_SIZE, async (batch) => {
      const normalizedTokens = batch.map((token) => ({
        chain: token.chain,
        address: token.address.toLowerCase(),
      }))
      const mintedAtA = this.db
        .selectFrom('TokenRelation')
        .select([
          'tokenAChain as chain',
          'tokenAAddress as address',
          'tokenBChain as relatedChain',
          'plugin',
          'bridgeType',
        ])
        .where((eb) =>
          eb(
            eb.refTuple('tokenAChain', 'tokenAAddress'),
            'in',
            normalizedTokens.map((token) =>
              eb.tuple(token.chain, token.address),
            ),
          ),
        )
        .where((eb) => this.mintedAtEndpoint(eb, 'A'))
      const mintedAtB = this.db
        .selectFrom('TokenRelation')
        .select([
          'tokenBChain as chain',
          'tokenBAddress as address',
          'tokenAChain as relatedChain',
          'plugin',
          'bridgeType',
        ])
        .where((eb) =>
          eb(
            eb.refTuple('tokenBChain', 'tokenBAddress'),
            'in',
            normalizedTokens.map((token) =>
              eb.tuple(token.chain, token.address),
            ),
          ),
        )
        .where((eb) => this.mintedAtEndpoint(eb, 'B'))

      const rows = await mintedAtA.union(mintedAtB).execute()
      for (const row of rows) {
        const record: MintingPluginRecord = {
          chain: row.chain,
          address: row.address,
          plugin: row.plugin,
          bridgeType: row.bridgeType as KnownInteropBridgeType,
          relatedChain: row.relatedChain,
        }
        result.set(mintingPluginKey(record), record)
      }
    })

    return [...result.values()].sort(
      (a, b) =>
        a.chain.localeCompare(b.chain) ||
        a.address.localeCompare(b.address) ||
        a.plugin.localeCompare(b.plugin) ||
        a.bridgeType.localeCompare(b.bridgeType) ||
        a.relatedChain.localeCompare(b.relatedChain),
    )
  }

  private mintedAtEndpoint(
    eb: ExpressionBuilder<DB, 'TokenRelation'>,
    slot: 'A' | 'B',
  ): Expression<SqlBool> {
    const otherSlot = slot === 'A' ? 'B' : 'A'
    return eb.or([
      eb('bridgeType', '=', 'burnAndMint' satisfies InteropBridgeType),
      eb.and([
        eb('bridgeType', '=', 'lockAndMint' satisfies InteropBridgeType),
        eb('lockedToken', '=', otherSlot),
      ]),
    ])
  }

  async deleteByPrimaryKey(pk: TokenRelationPrimaryKey): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenRelation')
      .where('tokenAChain', '=', pk.tokenAChain)
      .where('tokenAAddress', '=', pk.tokenAAddress.toLowerCase())
      .where('tokenBChain', '=', pk.tokenBChain)
      .where('tokenBAddress', '=', pk.tokenBAddress.toLowerCase())
      .where('plugin', '=', pk.plugin)
      .where('bridgeType', '=', pk.bridgeType)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenRelation').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
