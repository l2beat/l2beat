import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { showAssetRisks } from '~/flags'
import { Web3Provider } from './_components/web3-provider'

export const metadata: Metadata = {
  title: 'L2BEAT – Asset Risks',
  description: 'Get your asset risks report for your L2 assets.',
}

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const enabled = await showAssetRisks()

  if (!enabled) {
    return notFound()
  }

  return <Web3Provider>{children}</Web3Provider>
}
