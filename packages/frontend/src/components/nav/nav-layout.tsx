import compact from 'lodash/compact'
import type { ReactNode } from 'react'
import { featureFlags } from '~/consts/feature-flags'
import { BridgesIcon } from '~/icons/pages/bridges'
import { DataAvailabilityIcon } from '~/icons/pages/data-availability'
import { ScalingIcon } from '~/icons/pages/scaling'
import { ZkCatalogIcon } from '~/icons/pages/zk-catalog'
import { cn } from '~/utils/cn'
import { MobileNavProvider } from './mobile-nav-context'
import { MobileNavbar } from './mobile-navbar'
import { NavSidebar } from './nav-sidebar'
import { TopNavbar } from './top-navbar'
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
        {
          title: 'Risk Analysis',
          shortTitle: 'Risks',
          href: '/bridges/risk',
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
      links: compact([
        {
          title: 'Summary',
          href: '/data-availability/summary',
        },
        {
          title: 'Risk Analysis',
          shortTitle: 'Risks',
          href: '/data-availability/risk',
        },
        featureFlags.daThroughput && {
          title: 'Throughput',
          shortTitle: 'Throughput',
          href: '/data-availability/throughput',
        },
      ]),
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
  ])

  return (
    <MobileNavProvider>
      <div
        className={cn(
          'relative flex flex-col overflow-x-clip lg:flex-row',
          topNavbar && 'lg:flex-col',
          className,
        )}
      >
        {!!topNavbar && (
          <>
            {topChildren}
            <TopNavbar logoLink={logoLink} groups={groups} />
          </>
        )}
        {!topNavbar && topChildren && (
          <div className="block lg:hidden">{topChildren}</div>
        )}
        <MobileNavbar
          groups={groups}
          logoLink={logoLink}
          className={cn(!topNavbar && 'md:mb-5')}
        />
        <NavSidebar
          logoLink={logoLink}
          groups={groups}
          topNavbar={!!topNavbar}
        />
        <div className="min-w-0 flex-1">
          {!topNavbar && topChildren && (
            <div className="hidden lg:mr-3 lg:block xl:mr-0">{topChildren}</div>
          )}
          {children}
        </div>
      </div>
    </MobileNavProvider>
  )
}
