import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditNetworkPage } from './_components/edit-network-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const network = isNew ? null : await db.network.findByIdWithConfigs(params.id)

  if (!isNew && !network) {
    return notFound()
  }

  return <EditNetworkPage network={network ?? null} />
}
