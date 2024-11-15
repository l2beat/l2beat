import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditNetworkPage } from './_components/edit-network-page'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const isNew = id === 'new'
  const network = isNew ? null : await db.network.findByIdWithConfigs(id)

  if (!isNew && !network) {
    return notFound()
  }

  return <EditNetworkPage network={network ?? null} />
}
