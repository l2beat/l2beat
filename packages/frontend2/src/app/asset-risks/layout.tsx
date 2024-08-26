import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getDefaultMetadata } from '~/utils/metadata'
import { Web3Provider } from './_components/web3-provider'

export const metadata: Metadata = getDefaultMetadata({
  title: 'L2BEAT - Asset Risks',
  description: 'Get your asset risks report for your L2 assets.',
})

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_ASSET_RISKS) {
    return notFound()
  }

  return <Web3Provider>{children}</Web3Provider>
}
