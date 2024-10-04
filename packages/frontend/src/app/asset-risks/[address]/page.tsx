import { redirect } from 'next/navigation'
import type { SetOptional } from 'type-fest'
import { http, type Hex, createPublicClient, isAddress } from 'viem'

import { type ScalingProjectRisk } from '@l2beat/config'
import {
  getChain,
} from '~/server/features/asset-risks/utils/chains'
import { Footer } from '../_components/footer'
import { DetailsHeader } from './_components/details-header'
import { Disclaimer } from './_components/disclaimer'
import { TokensTable } from './_components/table/tokens-table'

export type Risk = SetOptional<ScalingProjectRisk, 'category'>

interface Props {
  params: { address: string }
}

async function getAddressDisplayName(address: Hex) {
  const ethereumChain = getChain(1)
  if (!ethereumChain) return address

  const ethereum = createPublicClient({
    chain: ethereumChain,
    transport: http(),
  })

  const resolvedEnsDomain = await ethereum.getEnsName({
    address,
  })

  return resolvedEnsDomain ?? address
}

export async function generateMetadata({ params: { address } }: Props) {
  if (!isAddress(address)) return {}
  return {
    title: `${await getAddressDisplayName(
      address,
    )}'s Asset Risk Report – L2BEAT`,
    description: 'Detailed risk assessment for your L2 assets.',
  }
}

export default async function Page({ params: { address } }: Props) {
  if (!isAddress(address)) {
    return redirect('/')
  }

  const vanityAddress = await getAddressDisplayName(address)

  return (
    <main className="mx-auto w-screen max-w-[1176px] px-0 pt-10 sm:px-4 md:px-12">
      <div className="mb-10 flex flex-col gap-6">
        <DetailsHeader
          // TODO: Replace with real data when we have it
          dolarValue={0}
          tokens={[]}
          walletAddress={vanityAddress}
        />
        <TokensTable tokens={[]} />
        <Disclaimer />
      </div>
      <Footer />
    </main>
  )
}
