import React, { type ReactNode } from 'react'
import {
  showActivityPage,
  showCostsPage,
  showFinalityPage,
  showLivenessPage,
} from '~/flags'
import ActivityIcon from '~/icons/pages/activity.svg'
import CostsIcon from '~/icons/pages/costs.svg'
import DataAvailabilityIcon from '~/icons/pages/data-availability.svg'
import FinalityIcon from '~/icons/pages/finality'
import LivenessIcon from '~/icons/pages/liveness.svg'
import RiskIcon from '~/icons/pages/risk.svg'
import SummaryIcon from '~/icons/pages/summary.svg'
import TvlIcon from '~/icons/pages/tvl.svg'
import { cn } from '~/utils/cn'
import { LegacyNavBar } from './LegacyNavBar'
import { MobileNavBar } from './MobileNavBar'
import { MobileNavProvider } from './MobileNavContext'
import { NavSideBar } from './NavSideBar'
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
  const [liveness, finality, activity, costs] = await Promise.all([
    showLivenessPage(),
    showFinalityPage(),
    showActivityPage(),
    showCostsPage(),
  ])

  const groups: NavGroup[] = [
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
          enabled: liveness,
        },
        {
          title: 'Finality',
          icon: <FinalityIcon />,
          href: '/scaling/finality',
          enabled: finality,
        },
        {
          title: 'Activity',
          icon: <ActivityIcon />,
          href: '/scaling/activity',
          enabled: activity,
        },
        {
          title: 'Costs',
          icon: <CostsIcon />,
          href: '/scaling/costs',
          enabled: costs,
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
  ]

  return (
    <MobileNavProvider>
      <div
        className={cn(
          'flex flex-col xl:flex-row relative overflow-x-clip',
          legacyNav && 'xl:flex-col',
        )}
      >
        {!!legacyNav && <LegacyNavBar logoLink={logoLink} groups={groups} />}
        <MobileNavBar logoLink={logoLink} groups={groups} />
        <NavSideBar
          logoLink={logoLink}
          groups={groups}
          legacyNav={!!legacyNav}
        />
        <div className="flex-1">{children}</div>
      </div>
    </MobileNavProvider>
  )
}
