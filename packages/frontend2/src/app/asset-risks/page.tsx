import { notFound } from 'next/navigation'
import { enableAssetRisks } from '~/flags'

export default async function Page() {
  const enabled = await enableAssetRisks()

  if (!enabled) {
    return notFound()
  }

  return <div>Asset Risks</div>
}
