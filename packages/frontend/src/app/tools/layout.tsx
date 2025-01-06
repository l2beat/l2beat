import { notFound } from 'next/navigation'
import { featureFlags } from '~/consts/feature-flags'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!featureFlags.internalTools) {
    return notFound()
  }
  return <div className="p-4">{children}</div>
}
