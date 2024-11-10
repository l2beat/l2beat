import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditTokenPage } from './_components/edit-token-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const tokenEntity = isNew ? null : await db.token.findById(params.id)

  if (!isNew && !tokenEntity) {
    return notFound()
  }

  const [networks, bridges, tokens, entities] = await Promise.all([
    db.network.getAll(),
    db.externalBridge.getAll(),
    db.tokenMeta.getBasicAggregatedMeta(),
    db.entity.getAll(),
  ])

  const token =
    tokenEntity &&
    (await (async () => {
      const [relations, meta, managingEntities] = await Promise.all([
        db.tokenBridge.getByTokenId(tokenEntity.id),
        db.tokenMeta.getByTokenId(tokenEntity.id),
        db.entityToToken.getEntityIdsByTokenId(tokenEntity.id),
      ])
      return {
        ...tokenEntity,
        relations,
        meta,
        managingEntities: managingEntities.map((entityId) => ({
          entityId,
        })),
      }
    })())

  return (
    <EditTokenPage
      token={token ?? null}
      networks={networks.map((n) => ({ id: n.id, name: n.name }))}
      bridges={bridges.map((b) => ({ id: b.id, name: b.name }))}
      tokens={tokens}
      entities={entities}
    />
  )
}
