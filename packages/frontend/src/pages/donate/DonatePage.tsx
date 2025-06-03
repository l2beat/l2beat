import compact from 'lodash/compact'
import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'

const DONATE_ADDRESS = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
const GITCOIN_ROUND_URL =
  'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27'
const LAST_UPDATED = 'March 2025'

interface Props extends AppLayoutProps {
  gitcoinOption: boolean
  qrCodeUrl: string
}

export function DonatePage(props: Props) {
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
    props.gitcoinOption && {
      name: 'Gitcoin',
      linkURL: GITCOIN_ROUND_URL,
    },
  ])

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Donate</MainPageHeader>
        <Header networks={networks} qrCodeUrl={props.qrCodeUrl} />
        <FundingSourcesSection />
      </SideNavLayout>
    </AppLayout>
  )
}

interface HeaderProps {
  qrCodeUrl: string
  networks: {
    name: string
    linkURL: string
  }[]
}

function Header({ networks, qrCodeUrl }: HeaderProps) {
  return (
    <PrimaryCard className="overflow-hidden">
      <h1 className="mb-4 font-bold text-3xl md:hidden">Donate</h1>
      <div className="grid md:grid-cols-12">
        <div className="leading-normal md:col-span-7">
          <DonationDescription />
          <QrCodeSection
            mobile
            className="my-12 md:hidden"
            qrCodeUrl={qrCodeUrl}
          />
          <DonationNetworks networks={networks} />
        </div>
        <QrCodeSection
          className="col-span-5 hidden md:flex"
          qrCodeUrl={qrCodeUrl}
        />
      </div>
    </PrimaryCard>
  )
}

function QrCodeSection({
  mobile,
  qrCodeUrl,
  className,
}: {
  className: string
  mobile?: boolean
  qrCodeUrl: string
}) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="z-10 flex flex-col items-center justify-center">
        <div
          className={cn(
            'size-[200px] rounded-xl border border-divider bg-white p-3',
            mobile && 'size-[184px]',
          )}
        >
          <img
            alt="QR Code of donate address"
            src={qrCodeUrl}
            width={176}
            height={176}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>
        <p className="mx-auto mt-4 inline-block w-[21ch] break-all font-mono font-normal text-lg">
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
      <p className="font-bold text-xl">
        Thank you for supporting L2BEAT&apos;s mission to bring education and
        transparency to the blockchain space.
      </p>
      <p className="font-normal text-base">
        We&apos;re committed to delivering accurate and reliable information. We
        strive to be an impartial and independent watchdog that acts in the best
        interest of users and the broader ecosystem while always remaining
        credibly neutral and faithful to reality and facts. We deliver data and
        tools that allow our community to educate themselves, transact securely,
        and make well-informed decisions.
      </p>
      <p className="font-normal text-base">
        Your support means a lot to our small, independent team. Thank you!
      </p>
    </div>
  )
}

function DonationNetworks({ networks }: { networks: HeaderProps['networks'] }) {
  return (
    <div className="z-10 mt-4">
      <span className="font-medium text-purple-100 text-xs uppercase dark:text-pink-200">
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
    <PrimaryCard className="border-divider border-t md:mt-6 md:border-t-0">
      <h2 className="font-bold text-xl">Funding sources</h2>
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
      <ul className="mt-2 ml-6 list-disc">
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
          <tr className="h-8 border-divider border-b pt-2 pb-2.5 text-left font-semibold text-[13px] text-zinc-500 uppercase tracking-[-0.13px] dark:text-secondary">
            <th className="min-w-[300px] md:pl-4">Source / Project</th>
            <th className="md:pl-4">Tier</th>
            <th className="md:pl-4">Description</th>
          </tr>
        </thead>
        <tbody>
          {fundingSources.map((item) => (
            <tr
              key={item.source}
              className="h-14 border-divider border-b text-base last:border-b-0"
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

export const fundingSources = [
  {
    source: 'Ethereum Foundation',
    tier: 'Significant',
    description: 'Different grants in years 2021-2025',
  },
  {
    source:
      'Rewards & compensation for participating in L2 governance frameworks',
    tier: 'Medium',
    description:
      'We are participating in the governance of Arbitrum, Optimism, Hop, Polygon, Uniswap, Scroll, Connext, and more',
  },
  {
    source:
      'Processes and tooling around independent verification of ZK circuits',
    tier: 'Medium',
    description: 'Grant from Worldcoin Foundation',
  },
  {
    source: 'DA solutions risk framework & dashboard',
    tier: 'Medium',
    description: 'Grant from Celestia',
  },
  {
    source: 'Building infrastructure to count UOPS alongside TPS',
    tier: 'Medium',
    description: 'Grant from Starknet Foundation',
  },
  {
    source: 'Optimism RPGF',
    tier: 'Significant',
    description: 'March 2023, January 2024',
  },
  {
    source: 'Gitcoin',
    tier: 'Medium',
    description: 'Gitcoin rounds in 2022-2024',
  },
  {
    source: 'Direct community donations',
    tier: 'Small',
    description: 'Via this page',
  },
  {
    source: 'L2 Amsterdam (2022) conference sponsorships',
    tier: 'Small',
    description: (
      <span>
        <div>April 2022</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: 'L2 Warsaw (2023) conference sponsorships',
    tier: 'Small',
    description: (
      <span>
        <div>August 2023</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: 'L2DAYS Istanbul (2023) conference sponsorships',
    tier: 'Medium',
    description: (
      <span>
        <div>November 2023</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: '"Upgradeability of Ethereum L2s" report',
    tier: 'Small',
    description: 'Funded by Polygon Labs',
  },
  {
    source: 'Open-source explorer for StarkEx deployments',
    tier: 'Medium',
    description: (
      <span>
        Live at <a href="https://dydx.l2beat.com">dydx.l2beat.com</a>, view the
        code <a href="https://github.com/l2beat/starkex-explorer">here</a>.
        Funded by StarkWare and dYdX
      </span>
    ),
  },
  {
    source: 'Exploratory work around LayerZero transparency dashboard',
    tier: 'Medium',
    description: 'Funded by LayerZero',
  },
  {
    source: 'DAC memberships',
    tier: 'Small',
    description: 'Discontinued',
  },
]
