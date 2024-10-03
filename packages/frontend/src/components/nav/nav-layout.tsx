import compact from 'lodash/compact'
import { type ReactNode } from 'react'
import { env } from '~/env'
import { ArchivedIcon } from '~/icons/archived'
import { ActivityIcon } from '~/icons/pages/activity'
import { CostsIcon } from '~/icons/pages/costs'
import { DataAvailabilityIcon } from '~/icons/pages/data-availability'
import FinalityIcon from '~/icons/pages/finality'
import { LivenessIcon } from '~/icons/pages/liveness'
import { RiskIcon } from '~/icons/pages/risk'
import { SummaryIcon } from '~/icons/pages/summary'
import { TvlIcon } from '~/icons/pages/tvl'
import { UpcomingIcon } from '~/icons/upcoming'
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
      title: 'Scaling',
      links: [
        {
          title: 'Summary',
          icon: <SummaryIcon />,
          href: '/scaling/summary',
        },
        {
          title: 'Value Locked',
          icon: <TvlIcon />,
          href: '/scaling/tvl',
        },
        {
          title: 'Risk Analysis',
          icon: <RiskIcon />,
          href: '/scaling/risk',
        },
        {
          title: 'Data Availability',
          icon: <DataAvailabilityIcon />,
          href: '/scaling/data-availability',
        },
        {
          title: 'Liveness',
          icon: <LivenessIcon />,
          href: '/scaling/liveness',
        },
        {
          title: 'Finality',
          icon: <FinalityIcon />,
          href: '/scaling/finality',
        },
        {
          title: 'Activity',
          icon: <ActivityIcon />,
          href: '/scaling/activity',
        },
        {
          title: 'Costs',
          icon: <CostsIcon />,
          href: '/scaling/costs',
        },
      ],
      secondaryLinks: [
        {
          title: 'Upcoming',
          icon: <UpcomingIcon className="size-5" />,
          href: '/scaling/upcoming',
        },
        {
          title: 'Archived',
          icon: <ArchivedIcon className="size-5" />,
          href: '/scaling/archived',
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
        },
        {
          title: 'Risk Analysis',
          icon: <RiskIcon />,
          href: '/bridges/risk',
        },
      ],
      secondaryLinks: [
        {
          title: 'Archived',
          icon: <ArchivedIcon className="size-5" />,
          href: '/bridges/archived',
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
        },
        {
          title: 'Risk Analysis',
          icon: <RiskIcon />,
          href: '/data-availability/risk',
        },
      ],
    },
  ])

  return (
    <MobileNavProvider>
      <div
        className={cn(
          'relative flex flex-col overflow-x-clip xl:flex-row',
          legacyNav && 'xl:flex-col',
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
            <div className="hidden xl:block">{topChildren}</div>
          )}
          {children}
        </div>
      </div>
    </MobileNavProvider>
  )
}
