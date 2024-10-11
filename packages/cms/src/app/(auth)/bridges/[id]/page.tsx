import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditBridgePage } from './_components/edit-bridge-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const bridge = isNew ? null : await db.externalBridge.findById(params.id)

  if (!isNew && !bridge) {
    return notFound()
  }

  return <EditBridgePage bridge={bridge} />
}
