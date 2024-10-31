import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getDefaultMetadata } from '~/utils/metadata'

export const metadata: Metadata = getDefaultMetadata({
  title: 'L2BEAT - Asset Risks',
  description: 'Get your asset risks report for your L2 assets.',
})

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  if (!env.FEATURE_FLAG_ASSET_RISKS) {
    return notFound()
  }

  return children
}
