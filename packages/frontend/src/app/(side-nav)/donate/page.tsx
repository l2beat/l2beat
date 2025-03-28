import type { Metadata } from 'next'
import { env } from '~/env'
import { getDefaultMetadata } from '~/utils/metadata'
import { DonatePage } from './donate-page'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Donate - L2BEAT',
  openGraph: {
    url: '/donate',
  },
})

export default async function Page() {
  const gitcoinOption = env.NEXT_PUBLIC_GITCOIN_ROUND_LIVE

  return (
    <DonatePage
      gitcoinOption={gitcoinOption}
      qrCodeUrl={'/images/qr-codes/donate.png'}
    />
  )
}
