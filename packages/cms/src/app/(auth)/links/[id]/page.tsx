import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditLinkPage } from './_components/edit-link-page'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const isNew = id === 'new'
  const link = isNew ? null : await db.externalBridge.findById(id)

  if (!isNew && !link) {
    return notFound()
  }

  const [entities, managingEntities] = await Promise.all([
    db.entity.getAll(),
    db.entityToExternalBridge.getEntityIdsByExternalBridgeId(id),
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
