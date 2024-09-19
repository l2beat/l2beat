import { Database } from '@l2beat/database'
import { UpsertableTokenMetaRecord } from '@l2beat/database/src/token-db/token-meta/entity.js'
import { UpsertableTokenRecord } from '@l2beat/database/src/token-db/token/entity.js'
import { nanoid } from 'nanoid'
import { Simplify } from 'type-fest'
import { SourceTagParams, sourceTag } from '../utils/sourceTag.js'

export type UpsertTokenMetaInput = Simplify<
  Omit<UpsertableTokenMetaRecord, 'source'> & {
    source: SourceTagParams
  }
>

export async function upsertTokenMeta(
  db: Database,
  { source, ...meta }: UpsertTokenMetaInput,
) {
  return await db.tokenMeta.upsert({
    ...meta,
    source: sourceTag(source),
  })
}

export type UpsertTokenWithMetaInput = Simplify<
  Omit<UpsertableTokenRecord, 'id'> &
    Omit<UpsertableTokenMetaRecord, 'tokenId' | 'source'> & {
      source: SourceTagParams
    }
>

export async function upsertTokenWithMeta(
  db: Database,
  { networkId, address, source, ...meta }: UpsertTokenWithMetaInput,
) {
  const token = { networkId, address }

  const { id: tokenId } = await db.token.upsert(token)

  const { id: tokenMetaId } = await upsertTokenMeta(db, {
    source,
    tokenId,
    ...meta,
  })

  return { tokenId, tokenMetaId }
}

export async function upsertManyTokenMeta(
  db: Database,
  metas: UpsertTokenMetaInput[],
) {
  await db.tokenMeta.upsertMany(
    metas.map(({ source, ...meta }) => ({
      source: sourceTag(source),
      ...meta,
    })),
  )
}

export async function upsertManyTokensWithMeta(
  db: Database,
  tokens: UpsertTokenWithMetaInput[],
) {
  await db.token.upsertMany(
    tokens.map((token) => ({
      id: nanoid(),
      networkId: token.networkId,
      address: token.address,
    })),
  )

  const tokenEntities = await db.token.getByNetworks(
    tokens.map((token) => ({
      networkId: token.networkId,
      address: token.address,
    })),
  )

  const tokenIds = Object.fromEntries(
    tokenEntities.map((token) => [
      `${token.networkId}_${token.address}`,
      token.id,
    ]),
  )

  await db.tokenMeta.upsertMany(
    tokens.map(({ networkId, address, source, ...meta }) => ({
      tokenId: tokenIds[`${networkId}_${address}`] ?? '',
      source: sourceTag(source),
      ...meta,
    })),
  )

  return tokenEntities.map((token) => token.id)
}
