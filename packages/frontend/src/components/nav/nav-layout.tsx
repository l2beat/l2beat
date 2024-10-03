import compact from 'lodash/compact'
import { type ReactNode } from 'react'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/bridges'
import { DataAvailabilityIcon } from '~/icons/pages/data-availability'
import { ScalingIcon } from '~/icons/pages/scaling'
import { ZkCatalogIcon } from '~/icons/pages/zk-catalog'
import { cn } from '~/utils/cn'
import { LegacyNavbar } from './legacy-navbar'
import { MobileNavProvider } from './mobile-nav-context'
import { MobileNavbar } from './mobile-navbar'
import { NavSidebar } from './nav-sidebar'
import { type NavGroup } from './types'

interface Props {
  children: ReactNode
  className?: string
  logoLink: string
  legacyNav?: boolean
  topChildren?: ReactNode
}

export async function NavLayout({
  children,
  className,
  logoLink,
  legacyNav,
  topChildren,
}: Props) {
  const groups: NavGroup[] = compact([
    {
      type: 'multiple',
      title: 'Scaling',
      icon: (
        <ScalingIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
      ),
      links: [
        {
          title: 'Summary',
          href: '/scaling/summary',
        },
        {
          title: 'Value Locked',
          href: '/scaling/tvl',
        },
        {
          title: 'Risk Analysis',
          href: '/scaling/risk',
        },
        {
          title: 'Data Availability',
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
          title: 'Activity',
          href: '/scaling/activity',
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
    env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT && {
      type: 'multiple',
      title: 'DA',
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
          href: '/data-availability/risk',
        },
      ],
    },
    {
      type: 'single',
      title: 'ZK Catalog',
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
          legacyNav && 'lg:flex-col',
          className,
        )}
      >
        {!!legacyNav && (
          <>
            {topChildren}
            <LegacyNavbar logoLink={logoLink} groups={groups} />
          </>
        )}
        {!legacyNav && topChildren && (
          <div className="block xl:hidden">{topChildren}</div>
        )}
        <MobileNavbar {...{ groups, logoLink }} />
        <NavSidebar
          logoLink={logoLink}
          groups={groups}
          legacyNav={!!legacyNav}
        />
        <div className="min-w-0 flex-1">
          {!legacyNav && topChildren && (
            <div className="hidden lg:mr-3 lg:block xl:mr-0">{topChildren}</div>
          )}
          {children}
        </div>
      </div>
    </MobileNavProvider>
  )
}
