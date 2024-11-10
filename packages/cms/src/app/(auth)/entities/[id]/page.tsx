import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditEntityPage } from './_components/edit-entity-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const entity = isNew ? null : await db.entity.findById(params.id)

  if (!isNew && !entity) {
    return notFound()
  }

  return <EditEntityPage entity={entity} />
}
