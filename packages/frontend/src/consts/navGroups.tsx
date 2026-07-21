import compact from 'lodash/compact'
import type { NavGroup } from '~/components/nav/types'
import { PARTNERS_ORDER } from '~/consts/partnersOrder'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { HomeIcon } from '~/icons/pages/Home'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { createOrderedSort } from '~/utils/sort'

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
    type: 'multiple',
    title: 'Layer 2s',
    match: 'scaling',
    icon: (
      <ScalingIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
      {
        title: 'Summary',
        href: '/scaling/summary',
      },
      {
        title: 'Risk Analysis',
        shortTitle: 'Risks',
        href: '/scaling/risk',
        subLinks: [
          {
            title: 'Home',
            href: '/scaling/risk',
            exactMatch: true,
          },
          {
            title: 'State Validation',
            href: '/scaling/risk/state-validation',
          },
          {
            title: 'Data Availability',
            shortTitle: 'DA',
            href: '/scaling/risk/data-availability',
          },
          {
            title: 'Sequencing',
            href: '/scaling/risk/sequencing',
          },
        ],
      },
      {
        title: 'Value Secured',
        shortTitle: 'Value',
        href: '/scaling/tvs',
      },
      {
        title: 'Activity',
        href: '/scaling/activity',
      },
      {
        title: 'Liveness',
        href: '/scaling/liveness',
      },
      {
        title: 'Costs',
        href: '/scaling/costs',
      },
    ],
    secondaryLinks: [
      {
        title: 'Archived',
        href: '/scaling/archived',
      },
    ],
  },
  {
    type: 'multiple',
    title: 'Interop',
    match: 'interop',
    icon: (
      <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
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
  },
  {
    type: 'multiple',
    title: 'Data Availability',
    match: 'data-availability',
    icon: (
      <DataAvailabilityIcon className="transition-colors duration-300 group-data-[active=true]:fill-brand" />
    ),
    links: [
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
    secondaryLinks: [
      {
        title: 'Archived',
        href: '/data-availability/archived',
      },
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
    title: 'Ecosystems',
    match: 'ecosystems',
    disableMobileTabs: true,
    icon: (
      <EcosystemsIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    links: [
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
  },
])
