import compact from 'lodash/compact'
import type { ReactNode } from 'react'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/bridges'
import { DataAvailabilityIcon } from '~/icons/pages/data-availability'
import { EcosystemsIcon } from '~/icons/pages/ecosystems'
import { ScalingIcon } from '~/icons/pages/scaling'
import { ZkCatalogIcon } from '~/icons/pages/zk-catalog'
import { ps } from '~/server/projects'
import { cn } from '~/utils/cn'
import { HiringBadge } from '../badge/hiring-badge'
import { SidebarProvider } from '../core/sidebar'
import { MobileTopNavbar } from './mobile/mobile-top-navbar'
import { NavSidebar } from './sidebar/nav-sidebar'
import { TopNavbar } from './top-nav/top-navbar'
import type { NavGroup } from './types'

interface Props {
  children: ReactNode
  className?: string
  logoLink: string
  topNavbar?: boolean
  topChildren?: ReactNode
}

export async function NavLayout({
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
    env.NEXT_PUBLIC_ECOSYSTEMS && {
      type: 'multiple',
      title: 'Ecosystems',
      match: 'ecosystems',
      disableMobileTabs: true,
      icon: (
        <EcosystemsIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      preventTitleNavigation: true,
      links: (
        await ps.getProjects({
          select: ['ecosystemConfig'],
        })
      )
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
