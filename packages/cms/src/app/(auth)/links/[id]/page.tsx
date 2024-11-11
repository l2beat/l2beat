import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditLinkPage } from './_components/edit-link-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const link = isNew ? null : await db.externalBridge.findById(params.id)

  if (!isNew && !link) {
    return notFound()
  }

  const [entities, managingEntities] = await Promise.all([
    db.entity.getAll(),
    db.entityToExternalBridge.getEntityIdsByExternalBridgeId(params.id),
  ])

  return (
    <EditLinkPage
      link={
        link && {
          ...link,
          managingEntities: managingEntities.map((entityId) => ({
            entityId,
          })),
        }
      }
      entities={entities}
    />
  )
}
