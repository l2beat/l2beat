import { notFound } from 'next/navigation'
import { db } from '~/db'
import { EditBridgePage } from './_components/edit-bridge-page'

export default async function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const bridge = isNew ? null : await db.externalBridge.findById(params.id)

  const bridgedTokens = await db.tokenBridge.getByExternalBridgeId(params.id)

  if (!isNew && !bridge) {
    return notFound()
  }

  return (
    <div>
      <EditBridgePage bridge={bridge} />
      <div>
        <h2>Bridged tokens</h2>
        <pre>{JSON.stringify(bridgedTokens, null, 2)}</pre>
      </div>
    </div>
  )
}
