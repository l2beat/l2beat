import { notFound } from 'next/navigation'
import { enableAssetRisks } from '~/flags'

// Needed for the flag override without middleware
export const dynamic = 'force-dynamic'

export default async function Page() {
  const enabled = await enableAssetRisks()

  if (!enabled) {
    return notFound()
  }

  return <div>Asset Risks</div>
}
