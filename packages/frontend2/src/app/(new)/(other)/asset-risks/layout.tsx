import { type Metadata } from 'next'
import { Web3Provider } from './_components/web3-provider'

export const metadata: Metadata = {
  title: 'L2BEAT – Asset Risks',
  description: 'Get your asset risks report for your L2 assets.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>
}
