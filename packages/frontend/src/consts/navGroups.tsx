import compact from 'lodash/compact'
import type { NavGroup, NavLink } from '~/components/nav/types'
import { PARTNERS_ORDER } from '~/consts/partnersOrder'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { DefiIcon } from '~/icons/pages/Defi'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { HomeIcon } from '~/icons/pages/Home'
import { L2Icon } from '~/icons/pages/L2'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { createOrderedSort } from '~/utils/sort'

export const navGroups: NavGroup[] = compact<NavGroup>([
  env.CLIENT_SIDE_HOME_PAGE && {
    type: 'single',
    title: 'Home',
    match: 'home',
    href: '/',
    icon: (
      <HomeIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'multiple',
    title: env.CLIENT_SIDE_HOME_PAGE ? 'Layer 2s' : 'Scaling',
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
      env.CLIENT_SIDE_COMPARE_PROJECTS && [
        {
          title: 'Compare',
          href: '/layer2s/compare',
        },
      ],
    ]),
  },
  {
    type: 'multiple',
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
  {
    type: 'single',
    title: 'Privacy',
    match: 'privacy',
    href: '/privacy',
    icon: (
      <PrivacyIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  env.CLIENT_SIDE_DEFI_ENABLED && {
    type: 'single',
    title: 'DeFi',
    match: 'defi',
    href: '/defi',
    icon: (
      <DefiIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'multiple',
    title: 'Data Availability',
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
    type: 'single',
    title: 'ZK Catalog',
    match: 'zk-catalog',
    href: '/zk-catalog',
    icon: (
      <ZkCatalogIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
  },
  {
    type: 'multiple',
    title: 'Ecosystems',
    match: 'ecosystems',
    disableMobileTabs: true,
    icon: (
      <EcosystemsIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
      [
        {
          name: 'Agglayer',
          slug: 'agglayer',
        },
        {
          name: 'Arbitrum Orbit',
          slug: 'arbitrum-orbit',
        },
        {
          name: 'Superchain',
          slug: 'superchain',
        },
        {
          name: 'The Elastic Network',
          slug: 'the-elastic-network',
        },
      ]
        .sort(createOrderedSort(PARTNERS_ORDER, (item) => item.slug))
        .map((ecosystem) => ({
          title: ecosystem.name,
          href: `/ecosystems/${ecosystem.slug}`,
        })),
    ],
  },
])
