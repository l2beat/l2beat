import compact from 'lodash/compact'
import type { NavGroup, NavLink } from '~/components/nav/types'
import { env } from '~/env'
import { BlobsIcon } from '~/icons/pages/Blobs'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { HomeIcon } from '~/icons/pages/Home'
import { L2Icon } from '~/icons/pages/L2'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { TokensIcon } from '~/icons/pages/Tokens'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import {
  L2_CATEGORY_TABS,
  L2_STATE_VALIDATION_TABS,
} from '~/utils/project/l2Tabs'

const L2_CATEGORY_VIEW = { tabs: L2_CATEGORY_TABS, filters: true } as const
const FILTERS_ONLY_VIEW = { filters: true } as const

export const navGroups: NavGroup[] = compact<NavGroup>([
  {
    type: 'single',
    title: 'Home',
    match: 'home',
    href: '/',
    icon: (
      <HomeIcon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
    ),
  },
  {
    type: 'single',
    title: 'Privacy',
    match: 'privacy',
    href: '/privacy',
    icon: (
      <PrivacyIcon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
    ),
  },
  {
    type: 'multiple',
    title: 'Layer 2s',
    match: 'layer2s',
    icon: (
      <L2Icon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
    ),
    links: compact<NavLink[]>([
      [
        {
          title: 'Summary',
          href: '/layer2s/summary',
          viewParams: L2_CATEGORY_VIEW,
        },
        {
          title: 'Risk Analysis',
          shortTitle: 'Risks',
          href: '/layer2s/risk',
          viewParams: L2_CATEGORY_VIEW,
          subLinks: [
            {
              title: 'Overview',
              href: '/layer2s/risk',
              exactMatch: true,
              viewParams: L2_CATEGORY_VIEW,
            },
            {
              title: 'State Validation',
              href: '/layer2s/risk/state-validation',
              viewParams: { tabs: L2_STATE_VALIDATION_TABS, filters: true },
            },
            {
              title: 'Data Availability',
              shortTitle: 'DA',
              href: '/layer2s/risk/data-availability',
              viewParams: L2_CATEGORY_VIEW,
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
          viewParams: L2_CATEGORY_VIEW,
        },
        {
          title: 'Activity',
          href: '/layer2s/activity',
          viewParams: FILTERS_ONLY_VIEW,
        },
        {
          title: 'Liveness',
          href: '/layer2s/liveness',
          viewParams: L2_CATEGORY_VIEW,
        },
        {
          title: 'Costs',
          href: '/layer2s/costs',
          viewParams: L2_CATEGORY_VIEW,
        },
      ],
      [
        {
          title: 'Archived',
          href: '/layer2s/archived',
          viewParams: FILTERS_ONLY_VIEW,
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
    type: 'multiple',
    section: 'more',
    title: 'Security',
    // Its pages share no path; the nav also matches them by their links.
    match: 'zk-catalog',
    disableMobileTabs: true,
    icon: (
      <ZkCatalogIcon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
    ),
    links: [
      [
        {
          title: 'ZK Catalog',
          href: '/zk-catalog',
        },
        // Behind a flag: listed, but not a link.
        {
          title: 'Ossification',
          href: '/ossification',
          disabled: !env.CLIENT_SIDE_OSSIFICATION_ENABLED,
        },
      ],
    ],
  },
  {
    type: 'multiple',
    section: 'more',
    title: 'Interop',
    match: 'interop',
    icon: (
      <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
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
      <TokensIcon className="transition-colors duration-300 group-data-[active=true]:stroke-nav-active" />
    ),
  },
  env.CLIENT_SIDE_BLOBS_PAGE && {
    type: 'single',
    section: 'more',
    title: 'Blobs',
    match: 'blobs',
    href: '/blobs',
    icon: (
      <BlobsIcon className="transition-colors duration-300 group-data-[active=true]:fill-nav-active" />
    ),
  },
])
