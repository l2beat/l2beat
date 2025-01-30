import { compact } from 'lodash'
import type { Metadata } from 'next'
import Image from 'next/image'
import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { env } from '~/env'
import { CustomLinkIcon } from '~/icons/outlink'
import { cn } from '~/utils/cn'
import { getDefaultMetadata } from '~/utils/metadata'
import { fundingSources } from './funding-sources'

const DONATE_ADDRESS = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
const GITCOIN_ROUND_URL =
  'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27'
const LAST_UPDATED = 'January 2024'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Donate - L2BEAT',
  openGraph: {
    url: '/donate',
  },
})

export default async function Page() {
  const gitcoinOption = env.NEXT_PUBLIC_GITCOIN_ROUND_LIVE

  const networks = compact([
    {
      name: 'Ethereum',
      linkURL: `https://etherscan.io/address/${DONATE_ADDRESS}`,
    },
    {
      name: 'Arbitrum One',
      linkURL: `https://arbiscan.io/address/${DONATE_ADDRESS}`,
    },
    {
      name: 'OP Mainnet',
      linkURL: `https://optimistic.etherscan.io/address/${DONATE_ADDRESS}`,
    },
    {
      name: 'ZKsync Lite',
      linkURL: `https://zkscan.io/explorer/accounts/${DONATE_ADDRESS}`,
    },
    gitcoinOption && {
      name: 'Gitcoin',
      linkURL: GITCOIN_ROUND_URL,
    },
  ])

  return (
    <>
      <MainPageHeader>Donate</MainPageHeader>
      <Header networks={networks} />
      <FundingSourcesSection />
    </>
  )
}

interface HeaderProps {
  networks: {
    name: string
    linkURL: string
  }[]
}

function Header({ networks }: HeaderProps) {
  return (
    <PrimaryCard className="overflow-hidden">
      <h1 className="mb-4 text-3xl font-bold md:hidden">Donate</h1>
      <div className="grid md:grid-cols-12">
        <div className="leading-normal md:col-span-7">
          <DonationDescription />
          <QrCodeSection mobile className="my-12 md:hidden" />
          <DonationNetworks networks={networks} />
        </div>
        <QrCodeSection className="col-span-5 hidden md:flex" />
      </div>
    </PrimaryCard>
  )
}

function QrCodeSection({
  mobile,
  className,
}: { className: string; mobile?: boolean }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="z-10 flex flex-col items-center justify-center">
        <div
          className={cn(
            'size-[200px] rounded-xl border border-divider bg-white p-3',
            mobile && 'size-[184px]',
          )}
        >
          <Image
            alt="QR Code of donate address"
            src="/images/qr-codes/donate.png"
            width={176}
            height={176}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>
        <p className="mx-auto mt-4 inline-block w-[21ch] break-all font-mono text-lg font-normal">
          {DONATE_ADDRESS}
        </p>
      </div>
      <div className="absolute flex size-full items-center justify-center">
        <div
          className={cn(
            'size-[300px] rounded-full bg-[#FFC2FD] blur-3xl dark:bg-[#7C387A]',
            mobile && 'size-[250px]',
          )}
        />
      </div>
    </div>
  )
}

function DonationDescription() {
  return (
    <div className="space-y-4 text-primary">
      <p className="text-xl font-bold">
        Thank you for supporting L2BEAT&apos;s mission to bring education and
        transparency to the blockchain space.
      </p>
      <p className="text-base font-normal">
        We&apos;re committed to delivering accurate and reliable information. We
        strive to be an impartial and independent watchdog that acts in the best
        interest of users and the broader ecosystem while always remaining
        credibly neutral and faithful to reality and facts. We deliver data and
        tools that allow our community to educate themselves, transact securely,
        and make well-informed decisions.
      </p>
      <p className="text-base font-normal">
        Your support means a lot to our small, independent team. Thank you!
      </p>
    </div>
  )
}

function DonationNetworks({ networks }: { networks: HeaderProps['networks'] }) {
  return (
    <div className="z-10 mt-4">
      <span className="text-xs font-medium uppercase text-purple-100 dark:text-pink-200">
        Donate through
      </span>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
        {networks.map((network) => (
          <CustomLink
            key={network.name}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-secondary py-3 text-sm transition-colors duration-200 hover:bg-surface-secondary/50 md:w-max md:px-3 md:py-1"
            href={network.linkURL}
            underline={false}
          >
            {network.name}
            <CustomLinkIcon className="fill-current" />
          </CustomLink>
        ))}
      </div>
    </div>
  )
}

function FundingSourcesSection() {
  return (
    <PrimaryCard className="border-t border-divider md:mt-6 md:border-t-0">
      <h2 className="text-xl font-bold">Funding sources</h2>
      <p className="mt-4 text-base leading-5">
        As a public goods company, L2BEAT is financed in the open by the
        community. For transparency, we are providing L2BEAT&apos;s funding
        sources below.
      </p>
      <FundingTierDescriptions />
      <FundingSourcesTable />
      <div className="mt-8 font-bold">Last updated: {LAST_UPDATED}</div>
    </PrimaryCard>
  )
}
function FundingTierDescriptions() {
  return (
    <div className="mt-6 text-base leading-normal">
      <p>
        Those funding sources have been categorized based on the contribution
        amounts:
      </p>
      <ul className="ml-6 mt-2 list-disc">
        <li>
          <strong>Significant</strong>: Above 500,000 USD
        </li>
        <li>
          <strong>Medium</strong>: Between 100,000 USD and 500,000 USD
        </li>
        <li>
          <strong>Small</strong>: Below 100,000 USD
        </li>
      </ul>
    </div>
  )
}

function FundingSourcesTable() {
  return (
    <div className="mt-4 overflow-x-auto pb-3">
      <table>
        <thead>
          <tr className="h-8 border-b border-divider pb-2.5 pt-2 text-left text-[13px] font-semibold uppercase tracking-[-0.13px] text-zinc-500 dark:text-secondary">
            <th className="min-w-[300px] md:pl-4">Source / Project</th>
            <th className="md:pl-4">Tier</th>
            <th className="md:pl-4">Description</th>
          </tr>
        </thead>
        <tbody>
          {fundingSources.map((item) => (
            <tr
              key={item.source}
              className="h-14 border-b border-divider text-base last:border-b-0"
            >
              <td className="pr-4 md:px-4">{item.source}</td>
              <td className="pr-4 md:px-4">{item.tier}</td>
              <td className="whitespace-pre pr-4 md:whitespace-normal md:px-4">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
