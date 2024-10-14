import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditTokenPage } from './_components/edit-token-page'
import { type TokenBridgeRecord } from '@l2beat/database'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const networks = await db.network.getAll()
  const bridges = await db.externalBridge.getAll()
  const tokens = await db.tokenMeta.getBasicAggregatedMeta()
  const tokenEntity = isNew ? null : await db.token.findById(params.id)

  if (!isNew && !tokenEntity) {
    return notFound()
  }

  const token =
    tokenEntity &&
    (await (async () => {
      let relations = await db.tokenBridge.getByTokenId(tokenEntity.id)
      let relationsBatch: TokenBridgeRecord[] = relations

      // TODO: handle circular relations
      while (
        relationsBatch.filter((r) => r.targetTokenId === tokenEntity.id)
          .length > 0
      ) {
        relationsBatch = await db.tokenBridge.getByTargetTokenIds(
          relations
            .filter((r) => r.targetTokenId === tokenEntity.id)
            .map((r) => r.targetTokenId),
        )
        relations = [...relations, ...relationsBatch]
      }

      return {
        ...tokenEntity,
        relations,
        meta: await db.tokenMeta.getByTokenId(tokenEntity.id),
      }
    })())

  return (
    <EditTokenPage
      token={token ?? null}
      networks={networks.map((n) => ({ id: n.id, name: n.name }))}
      bridges={bridges.map((b) => ({ id: b.id, name: b.name }))}
      tokens={tokens}
    />
  )
}
