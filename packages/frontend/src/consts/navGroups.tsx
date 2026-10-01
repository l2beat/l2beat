import compact from 'lodash/compact'
import type { NavGroup, NavLink } from '~/components/nav/types'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { DefiIcon } from '~/icons/pages/Defi'
import { HomeIcon } from '~/icons/pages/Home'
import { L2Icon } from '~/icons/pages/L2'
import { LiquidStakingIcon } from '~/icons/pages/LiquidStaking'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { TokensIcon } from '~/icons/pages/Tokens'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'

export const navGroups: NavGroup[] = compact<NavGroup>([
  {
    type: 'single',
    title: 'Home',
    match: 'home',
    href: '/',
    icon: (
      <HomeIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'single',
    title: 'Privacy',
    match: 'privacy',
    href: '/privacy',
    icon: (
      <PrivacyIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'multiple',
    title: 'Layer 2s',
    match: 'layer2s',
    icon: (
      <L2Icon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: compact<NavLink[]>([
      [
        {
          title: 'Summary',
          href: '/layer2s/summary',
        },
        {
          title: 'Risk Analysis',
          shortTitle: 'Risks',
          href: '/layer2s/risk',
          subLinks: [
            {
              title: 'Overview',
              href: '/layer2s/risk',
              exactMatch: true,
            },
            {
              title: 'State Validation',
              href: '/layer2s/risk/state-validation',
            },
            {
              title: 'Data Availability',
              shortTitle: 'DA',
              href: '/layer2s/risk/data-availability',
            },
            {
              title: 'Sequencing',
              href: '/layer2s/risk/sequencing',
            },
          ],
        },
        {
          title: 'Value Secured',
          shortTitle: 'Value',
          href: '/layer2s/tvs',
        },
        {
          title: 'Activity',
          href: '/layer2s/activity',
        },
        {
          title: 'Liveness',
          href: '/layer2s/liveness',
        },
        {
          title: 'Costs',
          href: '/layer2s/costs',
        },
      ],
      [
        {
          title: 'Archived',
          href: '/layer2s/archived',
        },
      ],
      [
        {
          title: 'Compare',
          href: '/layer2s/compare',
        },
      ],
    ]),
  },
  {
    type: 'single',
    title: 'Liquid staking',
    match: 'liquid-staking',
    href: '/liquid-staking',
    // Not built yet: shown so the domain is visible, but not a link.
    disabled: true,
    icon: <LiquidStakingIcon />,
  },
  {
    type: 'multiple',
    section: 'more',
    title: 'Interop',
    match: 'interop',
    icon: (
      <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
      [
        {
          title: 'Summary',
          href: '/interop/summary',
        },
        {
          title: 'Token frameworks',
          href: '/interop/token-frameworks',
        },
        {
          title: 'Intent bridges',
          href: '/interop/intent-bridges',
        },
      ],
    ],
  },
  env.CLIENT_SIDE_TOKENS_PAGE && {
    type: 'single',
    section: 'more',
    title: 'Tokens',
    match: 'tokens',
    href: '/tokens',
    icon: (
      <TokensIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  env.CLIENT_SIDE_DEFI_ENABLED && {
    type: 'single',
    section: 'more',
    title: 'DeFi',
    match: 'defi',
    href: '/defi',
    icon: (
      <DefiIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'multiple',
    section: 'more',
    title: 'Blobs',
    match: 'data-availability',
    icon: (
      <DataAvailabilityIcon className="transition-colors duration-300 group-data-[active=true]:fill-brand" />
    ),
    links: [
      [
        {
          title: 'Summary',
          href: '/data-availability/summary',
        },
        {
          title: 'Risk Analysis',
          shortTitle: 'Risks',
          href: '/data-availability/risk',
        },
        {
          title: 'Throughput',
          shortTitle: 'Throughput',
          href: '/data-availability/throughput',
        },
        {
          title: 'Liveness',
          shortTitle: 'Liveness',
          href: '/data-availability/liveness',
        },
      ],
      [
        {
          title: 'Archived',
          href: '/data-availability/archived',
        },
      ],
    ],
  },
  {
    type: 'multiple',
    section: 'more',
    title: 'Security',
    // ZK Catalog is its only page so far.
    match: 'zk-catalog',
    // One page to switch between is no tab row.
    disableMobileTabs: true,
    icon: (
      <ZkCatalogIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
      [
        {
          title: 'ZK Catalog',
          href: '/zk-catalog',
        },
        // Not built yet: listed, but not links.
        {
          title: 'Audits',
          href: '/security/audits',
          disabled: true,
        },
        {
          title: 'Ossification',
          href: '/security/ossification',
          disabled: true,
        },
      ],
    ],
  },
])
