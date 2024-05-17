import React, { ReactNode, SVGAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Logo } from '../Logo'
import { ActivityIcon, RiskIcon, SummaryIcon, TvlIcon } from '../icons'
import { Icon } from '../icons/Icon'
import { CostsIcon } from '../icons/pages/CostsIcon'
import { DataAvailabilityIcon } from '../icons/pages/DataAvailabilityIcon'
import { FinalityIcon } from '../icons/pages/FinalityIcon'
import { LivenessIcon } from '../icons/pages/LivenessIcon'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { usePageBuildContext } from './navigationContext'
import { LogoSmall } from '../LogoSmall'

function NavLinkGroup({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-1 text-slate-600 dark:text-zinc-500 text-[0.8125rem] leading-[0.8125rem] uppercase font-medium xl:sidenav-collapsed:hidden">
        {title}
      </div>
      <div className="h-px w-8 bg-slate-600 dark:bg-zinc-500 hidden xl:sidenav-collapsed:block mt-[12px]" />
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
          'flex items-center gap-[0.625rem] p-1.5 rounded-[0.25rem] hover:bg-[#F1D6FF] dark:hover:bg-[#1D1E22] transition-colors sidenav-collapsed:w-8 sidenav-collapsed:h-8 sidenav-collapsed:p-0 sidenav-collapsed:justify-center',
          active &&
            'bg-[#d3d5d9] dark:bg-[#272A2F] hover:bg-[#d3d5d9] dark:hover:bg-[#272A2F]',
        )}
      >
        <Icon />
        <span className="font-semibold text-base leading-none xl:sidenav-collapsed:hidden">
          {title}
        </span>
      </li>
    </a>
  )
}

function NavSmallLinkGroup({ children }: { children: ReactNode }) {
  return (
    <ul className="ml-1 flex flex-col gap-2 xl:sidenav-collapsed:hidden">
      {children}
    </ul>
  )
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

function NavCollapseIcon({ className, ...props }: SVGAttributes<SVGElement>) {
  return (
    <Icon
      className={cn('stroke-[#525C6A] dark:stroke-[#D3D5D9]', className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <path d="M16.5 8L12.0633 12.4367C12.0284 12.4716 12.0284 12.5284 12.0633 12.5633L16.5 17" />
      <path d="M8 22L8 2" />
    </Icon>
  )
}

export function NavWrapper({ children }: { children: ReactNode }) {
  const { config } = usePageBuildContext()

  const sharedSizeClasses = 'w-full xl:w-[240px] 2xl:w-[280px] transition-all'

  return (
    <div className="flex flex-col xl:flex-row">
      <div
        className={cn(
          'flex-shrink-0 relative flex flex-col items-stretch group xl:sidenav-collapsed:w-20',
          sharedSizeClasses,
        )}
      >
        <div
          className={cn(
            'bg-[#E6E7EC] dark:bg-[#131215] flex flex-col xl:h-screen xl:fixed xl:sidenav-collapsed:w-20 overflow-x-hidden',
            sharedSizeClasses,
          )}
        >
          <div
            className={cn(
              'px-6 py-[1.125rem] overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-8',
              sharedSizeClasses,
            )}
          >
            <div className="flex flex-row justify-between items-center">
              <Logo className="h-8 w-auto block sidenav-collapsed:hidden" />
              <LogoSmall className="h-8 w-auto hidden sidenav-collapsed:block" />
              <div className="sidenav-collapsed:hidden">
                <DarkThemeToggle />
              </div>
            </div>
            <nav className="flex flex-col gap-6 flex-1">
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
                  <NavLink
                    title="Costs"
                    icon={CostsIcon}
                    href="/scaling/costs"
                  />
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
              <div className="h-px w-full bg-gray-300 dark:bg-gray-850 xl:sidenav-collapsed:hidden" />
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
          <div className="p-6 border-t border-gray-300 dark:border-gray-850 sidenav-collapsed:ml-1">
            <button
              className="select-none cursor-pointer"
              data-role="sidenav-collapse-toggle"
            >
              <NavCollapseIcon className="sidenav-collapsed:rotate-180" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
