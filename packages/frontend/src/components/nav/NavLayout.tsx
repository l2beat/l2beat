import compact from 'lodash/compact'
import type { ReactNode } from 'React'
import { externalLinks } from '~/consts/externalLinks'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { HiringBadge } from '../badge/HiringBadge'
import { SidebarProvider } from '../core/Sidebar'
import { MobileTopNavbar } from './mobile/MobileTopNavbar'
import { NavSidebar } from './sidebar/NavSidebar'
import { TopNavbar } from './top-nav/TopNavbar'
import type { NavGroup } from './types'

interface Props {
  children: ReactNode
  className?: string
  logoLink: string
  topNavbar?: boolean
  topChildren?: ReactNode
}

export function NavLayout({
  children,
  className,
  logoLink,
  topNavbar,
  topChildren,
}: Props) {
  const groups = compact<NavGroup>([
    {
      type: 'multiple',
      title: 'Scaling',
      match: './Scaling',
      icon: (
        <ScalingIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      links: [
        {
          title: 'Summary',
          href: './/scaling/Summary',
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
          href: './/scaling/DataAvailability',
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
          href: './/scaling/Upcoming',
        },
        {
          title: 'Archived',
          href: './/scaling/Archived',
        },
      ],
    },
    {
      type: 'multiple',
      title: 'Bridges',
      match: './Bridges',
      icon: (
        <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      links: [
        {
          title: 'Summary',
          href: './/bridges/Summary',
        },
      ],
      secondaryLinks: [
        {
          title: 'Archived',
          href: './/bridges/Archived',
        },
      ],
    },
    {
      type: 'multiple',
      title: 'Data Availability',
      match: './DataAvailability',
      icon: (
        <DataAvailabilityIcon className="transition-colors duration-300 group-data-[active=true]:fill-brand" />
      ),
      links: [
        {
          title: 'Summary',
          href: './/data-availability/Summary',
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
    },
    {
      type: 'single',
      title: 'ZK Catalog',
      match: './ZkCatalog',
      href: './/ZkCatalog',
      icon: (
        <ZkCatalogIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
    },
    env.NEXT_PUBLIC_ECOSYSTEMS && {
      type: 'multiple',
      title: 'Ecosystems',
      match: './Ecosystems',
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
        .map((ecosystem) => ({
          title: ecosystem.name,
          href: `/ecosystems/${ecosystem.slug}`,
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
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
      <div
        className={cn(
          'relative flex flex-col lg:flex-row',
          topNavbar && 'lg:flex-col',
          className,
        )}
      >
        {!!topNavbar && (
          <>
            {topChildren}
            <TopNavbar
              logoLink={logoLink}
              groups={groups}
              sideLinks={sideLinks}
            />
          </>
        )}
        {!topNavbar && topChildren && (
          <div className="block lg:hidden">{topChildren}</div>
        )}
        <MobileTopNavbar groups={groups} logoLink={logoLink} />
        <NavSidebar
          logoLink={logoLink}
          groups={groups}
          sideLinks={sideLinks}
          topNavbar={!!topNavbar}
        />
        <div
          className={cn(
            'min-w-0 flex-1 has-[[data-hide-overflow-x]]:overflow-x-hidden',
            !topNavbar && 'md:pt-5 lg:ml-3 lg:pt-0',
          )}
        >
          {!topNavbar && topChildren && (
            <div className="hidden lg:mr-3 lg:block xl:mr-0">{topChildren}</div>
          )}
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
