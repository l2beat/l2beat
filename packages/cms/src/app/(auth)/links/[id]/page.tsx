import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditLinkPage } from './_components/edit-link-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const link = isNew ? null : await db.externalBridge.findById(params.id)

  if (!isNew && !link) {
    return notFound()
  }

  return <EditLinkPage link={link} />
}
