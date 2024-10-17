import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditTokenPage } from './_components/edit-token-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const networks = await db.network.getAll()
  const bridges = await db.externalBridge.getAll()
  const tokens = await db.tokenMeta.getBasicAggregatedMeta()
  const tokenEntity = isNew ? null : await db.token.findById(params.id)

  if (!isNew && !tokenEntity) {
    return notFound()
  }

  const token = tokenEntity && {
    ...tokenEntity,
    relations: await db.tokenBridge.getByTokenId(tokenEntity.id),
    meta: await db.tokenMeta.getByTokenId(tokenEntity.id),
  }

  return (
    <EditTokenPage
      token={token ?? null}
      networks={networks.map((n) => ({ id: n.id, name: n.name }))}
      bridges={bridges.map((b) => ({ id: b.id, name: b.name }))}
      tokens={tokens}
    />
  )
}
