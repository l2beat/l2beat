import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditEntityPage } from './_components/edit-entity-page'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const isNew = id === 'new'
  const entity = isNew ? null : await db.entity.findById(id)

  if (!isNew && !entity) {
    return notFound()
  }

  return <EditEntityPage entity={entity} />
}
