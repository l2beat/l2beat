import compact from 'lodash/compact'
import type { ReactNode } from 'react'
import { externalLinks } from '~/consts/externalLinks'
import { PARTNERS_ORDER } from '~/consts/partnersOrder'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { createOrderedSort } from '~/utils/sort'
import { HiringBadge } from '../badge/HiringBadge'
import { SidebarProvider } from '../core/Sidebar'
import { MobileTopNavbar } from './mobile/MobileTopNavbar'
import { NavSidebar } from './sidebar/NavSidebar'
import type { NavGroup } from './types'

interface Props {
  children: ReactNode
  className?: string
  logoLink: string
  topChildren?: ReactNode
  childrenWrapperClassName?: string
}

export function NavLayout({
  children,
  className,
  logoLink,
  topChildren,
  childrenWrapperClassName,
}: Props) {
  const groups = compact<NavGroup>([
    {
      type: 'multiple',
      title: 'Scaling',
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
          title: 'Data Availability',
          shortTitle: 'DA',
          href: '/scaling/data-availability',
        },
        {
          title: 'Liveness',
          href: '/scaling/liveness',
        },
        {
          title: 'Finality',
          href: '/scaling/finality',
        },
        {
          title: 'Costs',
          href: '/scaling/costs',
        },
      ],
      secondaryLinks: [
        {
          title: 'Upcoming',
          href: '/scaling/upcoming',
        },
        {
          title: 'Archived',
          href: '/scaling/archived',
        },
      ],
    },
    {
      type: 'multiple',
      title: 'Bridges',
      match: 'bridges',
      icon: (
        <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      links: [
        {
          title: 'Summary',
          href: '/bridges/summary',
        },
      ],
      secondaryLinks: [
        {
          title: 'Archived',
          href: '/bridges/archived',
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
    env.NEXT_PUBLIC_PARTNERS && {
      type: 'multiple',
      title: 'Ecosystems',
      match: 'ecosystems',
      disableMobileTabs: true,
      icon: (
        <EcosystemsIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      preventTitleNavigation: true,
      links: [
        {
          name: 'AggLayer',
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

  const sideLinks = [
    {
      title: 'About Us',
      href: '/about-us',
    },
    {
      title: 'Forum',
      href: externalLinks.forum,
    },
    {
      title: 'Donate',
      href: '/donate',
    },
    {
      title: 'Governance',
      href: '/governance',
    },
    {
      title: 'Glossary',
      href: '/glossary',
    },
    {
      title: 'Jobs',
      href: externalLinks.jobs,
      accessory: env.NEXT_PUBLIC_SHOW_HIRING_BADGE ? (
        <HiringBadge />
      ) : undefined,
    },
    {
      title: 'Brand Kit',
      href: externalLinks.brandKit,
    },
    {
      title: 'FAQ',
      href: '/faq',
    },
  ]

  return (
    <SidebarProvider>
      <div className={cn('relative flex flex-col lg:flex-row', className)}>
        {topChildren && <div className="block lg:hidden">{topChildren}</div>}
        <MobileTopNavbar groups={groups} logoLink={logoLink} />
        <NavSidebar logoLink={logoLink} groups={groups} sideLinks={sideLinks} />
        <div
          className={cn(
            'min-w-0 flex-1 has-[[data-hide-overflow-x]]:overflow-x-hidden md:pt-5 lg:ml-3 lg:pt-0',
            childrenWrapperClassName,
          )}
        >
          {topChildren && (
            <div className="2xlmr-0 hidden lg:mr-3 lg:block">{topChildren}</div>
          )}
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
