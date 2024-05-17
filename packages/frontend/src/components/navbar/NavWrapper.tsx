import React, { ReactNode, SVGAttributes } from 'react'
import { Logo } from '../Logo'
import { DarkThemeToggle } from './DarkThemeToggle'
import { usePageBuildContext } from './navigationContext'
import { cn } from '../../utils/cn'
import { ActivityIcon, RiskIcon, SummaryIcon, TvlIcon } from '../icons'
import { CostsIcon } from '../icons/pages/CostsIcon'
import { DataAvailabilityIcon } from '../icons/pages/DataAvailabilityIcon'
import { FinalityIcon } from '../icons/pages/FinalityIcon'
import { LivenessIcon } from '../icons/pages/LivenessIcon'
import { HiringBadge } from './HiringBadge'

function NavLinkGroup({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-1 text-slate-600 dark:text-zinc-500 text-[0.8125rem] leading-[0.8125rem] uppercase font-medium">
        {title}
      </div>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  )
}

function NavLink({
  icon: Icon,
  title,
  href,
  activeBehavior = 'exact',
}: {
  icon: (
    props: React.SVGProps<SVGSVGElement> | SVGAttributes<SVGElement>,
  ) => JSX.Element
  title: string
  href: string
  activeBehavior?: 'exact' | 'prefix' | ((path: string) => boolean)
}) {
  const { path } = usePageBuildContext()

  const active =
    activeBehavior === 'exact'
      ? path === href
      : activeBehavior === 'prefix'
        ? path.startsWith(href)
        : activeBehavior(path)

  return (
    <a href={href}>
      <li
        className={cn(
          'flex items-center gap-[0.625rem] p-2 rounded-[0.25rem] group-hover:bg-transparent hover:bg-[#F1D6FF] dark:hover:bg-[#1D1E22] transition-colors',
          active &&
            'bg-[#d3d5d9] dark:bg-[#272A2F] hover:bg-[#d3d5d9] dark:hover:bg-[#272A2F]',
        )}
      >
        <Icon />
        <span className="font-semibold text-base leading-none">{title}</span>
      </li>
    </a>
  )
}

function NavSmallLinkGroup({ children }: { children: ReactNode }) {
  return <ul className="ml-1 flex flex-col gap-2">{children}</ul>
}

function NavSmallLink({
  title,
  href,
  children,
  activeBehavior = 'exact',
}: {
  href: string
  activeBehavior?: 'exact' | 'prefix' | ((path: string) => boolean)
} & (
  | { title: string; children?: undefined }
  | { children: ReactNode; title?: undefined }
)) {
  const { path } = usePageBuildContext()

  const active =
    activeBehavior === 'exact'
      ? path === href
      : activeBehavior === 'prefix'
        ? path.startsWith(href)
        : activeBehavior(path)

  return (
    <a href={href}>
      <li
        className={cn(
          'font-medium text-xs leading-none hover:text-blue-700',
          active && 'hover:text-[#AB3BD2] text-[#AB3BD2]',
        )}
      >
        {children ?? title}
      </li>
    </a>
  )
}

export function NavWrapper({ children }: { children: ReactNode }) {
  const { config } = usePageBuildContext()
  return (
    <div className="flex flex-col xl:flex-row">
      <div className="flex-shrink-0 w-full xl:w-[240px] 2xl:w-[280px] transition-all relative flex flex-col items-stretch">
        <div className="bg-[#E6E7EC] dark:bg-[#131215] px-6 py-[1.125rem] flex flex-col gap-8 xl:h-screen xl:fixed w-full xl:w-[240px] 2xl:w-[280px] overflow-y-auto transition-all">
          <div className="flex flex-row justify-between items-center">
            <Logo className="h-8 w-auto" />
            <DarkThemeToggle />
          </div>
          <nav className="flex flex-col gap-6">
            <NavLinkGroup title="Scaling">
              <NavLink
                title="Summary"
                icon={SummaryIcon}
                href="/scaling/summary"
              />
              <NavLink
                title="Value Locked"
                icon={TvlIcon}
                href="/scaling/tvl"
              />
              <NavLink
                title="Risk Analysis"
                icon={RiskIcon}
                href="/scaling/risk"
              />
              <NavLink
                title="Data Availability"
                icon={DataAvailabilityIcon}
                href="/scaling/data-availability"
              />
              {config.features.liveness && (
                <NavLink
                  title="Liveness"
                  icon={LivenessIcon}
                  href="/scaling/liveness"
                />
              )}
              {config.features.finality && (
                <NavLink
                  title="Finality"
                  icon={FinalityIcon}
                  href="/scaling/finality"
                />
              )}
              {config.features.activity && (
                <NavLink
                  title="Activity"
                  icon={ActivityIcon}
                  href="/scaling/activity"
                />
              )}
              {config.features.costsPage && (
                <NavLink title="Costs" icon={CostsIcon} href="/scaling/costs" />
              )}
            </NavLinkGroup>
            <NavLinkGroup title="Bridges">
              <NavLink
                title="Summary"
                icon={SummaryIcon}
                href="/bridges/summary"
              />
              <NavLink
                title="Risk Analysis"
                icon={RiskIcon}
                href="/bridges/risk"
              />
            </NavLinkGroup>
            <div className="h-px w-full bg-gray-300 dark:bg-gray-850" />
            <NavSmallLinkGroup>
              <NavSmallLink title="Forum" href={config.links.forum} />
              {config.features.zkCatalog && (
                <NavSmallLink title="ZK Catalog" href="/zk-catalog" />
              )}
              <NavSmallLink title="Donate" href={'/donate'} />
              {config.features.governancePage ? (
                <NavSmallLink title="Governance" href={'/governance'} />
              ) : (
                <NavSmallLink
                  title="Governance"
                  href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3"
                />
              )}
              {config.features.glossary && (
                <NavSmallLink title="Glossary" href="/glossary" />
              )}
              <NavSmallLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
                Jobs
                {config.features.hiringBadge && (
                  <HiringBadge className="ml-1 py-0.5 rounded-sm" />
                )}
              </NavSmallLink>
              <NavSmallLink title="FAQ" href="/faq" />
            </NavSmallLinkGroup>
          </nav>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
