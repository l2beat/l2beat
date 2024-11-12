import { redirect } from 'next/navigation'
import type { SetOptional } from 'type-fest'
import { http, type Hex, createPublicClient, isAddress } from 'viem'

import { type ScalingProjectRisk } from '@l2beat/config'
import { mainnet } from 'viem/chains'
import { db } from '~/server/database'
import { ClientsideLogic } from './_components/clientside-logic'
import { DetailsHeader } from './_components/details-header'
import { GeneratingReport } from './_components/generating-report'
import { ReportProvider } from './_components/report-context'
import { TokensTable } from './_components/table/tokens-table'

export type Risk = SetOptional<ScalingProjectRisk, 'category'>

interface Props {
  params: Promise<{ address: string }>
}

async function getAddressDisplayName(address: Hex) {
  const network = await db.network.findByChainIdWithConfigs(1)

  const ethereum = createPublicClient({
    chain: mainnet,
    transport: http(network?.rpcs?.[0]?.url),
  })

  const resolvedEnsDomain = await ethereum.getEnsName({
    address,
  })

  return resolvedEnsDomain ?? address
}

export async function generateMetadata(props: Props) {
  const params = await props.params

  const { address } = params

  if (!isAddress(address)) return {}
  return {
    title: `${await getAddressDisplayName(
      address,
    )}'s Asset Risk Report – L2BEAT`,
    description: 'Detailed risk assessment for your L2 assets.',
  }
}

export default async function Page(props: Props) {
  const params = await props.params

  const { address } = params

  if (!isAddress(address)) {
    return redirect('/')
  }

  // TODO: Check if address is blocklisted

  const vanityAddress = await getAddressDisplayName(address)

  return (
    <main className="mx-auto w-screen max-w-[1176px] grow px-0 pt-10 sm:px-4 md:px-12">
      <ClientsideLogic address={address} />
      <ReportProvider address={address} placeholder={<GeneratingReport />}>
        <div className="flex grow flex-col gap-6">
          <DetailsHeader vanityAddress={vanityAddress} />
          <TokensTable />
          {/* <Disclaimer /> */}
        </div>
      </ReportProvider>
    </main>
  )
}
