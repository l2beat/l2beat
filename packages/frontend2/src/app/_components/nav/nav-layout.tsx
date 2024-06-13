import compact from 'lodash/compact'
import React, { type ReactNode } from 'react'
import { env } from '~/env'
import ActivityIcon from '~/icons/pages/activity.svg'
import CostsIcon from '~/icons/pages/costs.svg'
import DataAvailabilityIcon from '~/icons/pages/data-availability.svg'
import FinalityIcon from '~/icons/pages/finality'
import LivenessIcon from '~/icons/pages/liveness.svg'
import RiskIcon from '~/icons/pages/risk.svg'
import SummaryIcon from '~/icons/pages/summary.svg'
import TvlIcon from '~/icons/pages/tvl.svg'
import { cn } from '~/utils/cn'
import { LegacyNavbar } from './legacy-navbar'
import { MobileNavProvider } from './mobile-nav-context'
import { MobileNavbar } from './mobile-navbar'
import { NavSidebar } from './nav-sidebar'
import { type NavGroup } from './types'

export async function NavLayout({
  children,
  logoLink,
  legacyNav,
}: {
  children: ReactNode
  logoLink: string
  legacyNav?: boolean
}) {
  const groups: NavGroup[] = compact([
    {
      title: 'Scaling',
      links: [
        {
          title: 'Summary',
          icon: <SummaryIcon />,
          href: '/scaling/summary',
          enabled: true,
        },
        {
          title: 'Value Locked',
          icon: <TvlIcon />,
          href: '/scaling/tvl',
          enabled: true,
        },
        {
          title: 'Risk Analysis',
          icon: <RiskIcon />,
          href: '/scaling/risk',
          enabled: true,
        },
        {
          title: 'Data Availability',
          icon: <DataAvailabilityIcon />,
          href: '/scaling/data-availability',
          enabled: true,
        },
        {
          title: 'Liveness',
          icon: <LivenessIcon />,
          href: '/scaling/liveness',
          enabled: true,
        },
        {
          title: 'Finality',
          icon: <FinalityIcon />,
          href: '/scaling/finality',
          enabled: true,
        },
        {
          title: 'Activity',
          icon: <ActivityIcon />,
          href: '/scaling/activity',
          enabled: true,
        },
        {
          title: 'Costs',
          icon: <CostsIcon />,
          href: '/scaling/costs',
          enabled: true,
        },
      ],
    },
    {
      title: 'Bridges',
      links: [
        {
          title: 'Summary',
          icon: <SummaryIcon />,
          href: '/bridges/summary',
          enabled: true,
        },
        {
          title: 'Risk Analysis',
          icon: <RiskIcon />,
          href: '/bridges/risk',
          enabled: true,
        },
      ],
    },
    env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT && {
      title: 'Data Availability',
      links: [
        {
          title: 'Summary',
          icon: <SummaryIcon />,
          href: '/data-availability/summary',
          enabled: true,
        },
      ],
    },
  ])

  return (
    <MobileNavProvider>
      <div
        className={cn(
          'flex flex-col xl:flex-row relative overflow-x-clip',
          legacyNav && 'xl:flex-col',
        )}
      >
        {!!legacyNav && <LegacyNavbar logoLink={logoLink} groups={groups} />}
        <MobileNavbar logoLink={logoLink} groups={groups} />
        <NavSidebar
          logoLink={logoLink}
          groups={groups}
          legacyNav={!!legacyNav}
        />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </MobileNavProvider>
  )
}
