import compact from 'lodash/compact'
import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { FundingSourcesSection } from './components/FundingSourcesSection'
import { PartnersSection } from './components/PartnersSection'
import { QrCodeSection } from './components/QrCodeSection'
import type { Partners } from './getDonateData'

export const DONATE_ADDRESS = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
const GITCOIN_ROUND_URL =
  'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27'
export const LAST_UPDATED = 'October 2025'

interface Props extends AppLayoutProps {
  partners: Partners | undefined
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
        {props.partners && <PartnersSection partners={props.partners} />}
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

export const fundingSources = [
  {
    source: 'Partnership Fund',
    tier: 'Significant',
    description:
      'A grant-based funding initiative where projects contribute financially to L2BEAT’s operations. Partners are listed above',
  },
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
