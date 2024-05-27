import { notFound } from 'next/navigation'
import { showAssetRisks } from '~/flags'

// Needed for the flag override without middleware
export const dynamic = 'force-dynamic'

export default async function Page() {
  const enabled = await showAssetRisks()

  if (!enabled) {
    return notFound()
  }

  return <div>Asset Risks</div>
}
