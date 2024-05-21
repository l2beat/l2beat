import React, { ReactNode, SVGAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Logo } from '../Logo'
import {
  ActivityIcon,
  MenuCloseIcon,
  MenuOpenIcon,
  RiskIcon,
  SummaryIcon,
  TvlIcon,
} from '../icons'
import { Icon } from '../icons/Icon'
import { CostsIcon } from '../icons/pages/CostsIcon'
import { DataAvailabilityIcon } from '../icons/pages/DataAvailabilityIcon'
import { FinalityIcon } from '../icons/pages/FinalityIcon'
import { LivenessIcon } from '../icons/pages/LivenessIcon'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { usePageBuildContext } from './navigationContext'
import { LogoSmall } from '../LogoSmall'
import { SocialLinks } from './SocialLinks'

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
          'flex items-center gap-[0.625rem] p-1.5 rounded-[0.25rem] hover:bg-[#F1D6FF] dark:hover:bg-[#1D1E22] transition-colors xl:sidenav-collapsed:w-8 xl:sidenav-collapsed:h-8 xl:sidenav-collapsed:p-0 xl:sidenav-collapsed:justify-center',
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

function NewItemBadge() {
  return (
    <span className="text-[#AB3BD2] dark:text-[#AB3BD2] text-xs font-semibold">
      New
    </span>
  )
}

function MobileNavBarLink({
  title,
  href,
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
          'flex flex-col justify-center h-full relative px-2 font-medium text-base md:px-4 md:text-lg',
          active && 'text-pink-900 dark:text-pink-200',
        )}
      >
        {title}
        {active && (
          <div className="absolute bottom-0 w-full h-[3px] left-0 bg-pink-900" />
        )}
      </li>
    </a>
  )
}

type NavbarLinkGroups = {
  title: string
  links: {
    title: string
    icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element
    href: string
    enabled: boolean
  }[]
}[]

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
function MobileNavBar({ links }: { links: NavbarLinkGroups }) {
  const { path } = usePageBuildContext()
  const currentGroup = links.find((g) =>
    path.startsWith(`/${g.links[0].href.split('/')[1]}`),
  )
  return (
    <div className="xl:hidden">
      <div className="h-16 px-3.5 relative flex justify-between flex-row gap-8 border-b border-gray-200 dark:border-gray-850 items-stretch">
        {/* Left side */}
        <div className="flex flex-row gap-4">
          <div className="py-4">
            <Logo className="h-8 w-auto" />
          </div>
          <ul className="flex flex-row">
            <MobileNavBarLink
              title="Scaling"
              href="/scaling/summary"
              activeBehavior={(path) => path.startsWith('/scaling')}
            />
            <MobileNavBarLink
              title="Bridges"
              href="/bridges/summary"
              activeBehavior={(path) => path.startsWith('/bridges')}
            />
          </ul>
        </div>
        {/* Right side */}
        <div className="flex flex-row items-center">
          <button data-role="sidenav-mobile-toggle">
            <MenuOpenIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {currentGroup && (
        <div className="overflow-x-scroll w-full border-b border-gray-200 dark:border-gray-850 text-center">
          <div className="inline-flex flex-row gap-2 px-4 py-2 m-auto">
            {currentGroup.links
              .filter((link) => link.enabled)
              .map((link) => (
                <a href={link.href} key={link.href}>
                  <div className="rounded-[4px] border border-[#AB3BD2] text-xs font-semibold px-4 py-2.5 text-nowrap m-auto">
                    {link.title}
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-px w-full bg-gray-300 dark:bg-gray-850 xl:sidenav-collapsed:hidden',
        className,
      )}
    />
  )
}

export function Sidenav({ links }: { links: NavbarLinkGroups }) {
  const { config } = usePageBuildContext()
  const sharedSizeClasses = 'w-full xl:w-[240px] 2xl:w-[280px]'

  return (
    <div
      className={cn(
        'flex-shrink-0 xl:static absolute flex flex-col items-stretch group translate-x-full data-[open=true]:translate-x-0 xl:transform-none xl:sidenav-collapsed:w-20 z-100 transition-all',
        sharedSizeClasses,
      )}
      data-role="sidenav"
    >
      <div
        className={cn(
          'bg-[#E6E7EC] dark:bg-[#1E1C21] dark:border-r dark:border-gray-850 xl:dark:border-none flex flex-col h-screen xl:fixed xl:sidenav-collapsed:w-20 overflow-x-hidden transition-all',
          sharedSizeClasses,
        )}
        data-role="sidenav-inner"
      >
        <div
          className={cn(
            'xl:px-6 px-3.5 py-4 xl:py-[1.125rem] overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-8',
            sharedSizeClasses,
          )}
          data-role="sidenav-collapse-content"
        >
          <div className="flex flex-row justify-between items-center">
            <Logo className="h-8 w-auto block xl:sidenav-collapsed:hidden" />
            <LogoSmall className="h-8 w-auto hidden xl:sidenav-collapsed:block" />
            <div className="xl:sidenav-collapsed:hidden flex flex-row gap-4">
              <DarkThemeToggle />
              <button className="xl:hidden" data-role="sidenav-mobile-toggle">
                <MenuCloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-6 flex-1">
            {links.map((group) => (
              <NavLinkGroup key={group.title} title={group.title}>
                {group.links.map(
                  (link) =>
                    link.enabled && (
                      <NavLink
                        key={link.href}
                        title={link.title}
                        icon={link.icon}
                        href={link.href}
                      />
                    ),
                )}
              </NavLinkGroup>
            ))}

            <Divider />
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
            <Divider className="xl:hidden" />
            <ul className="xl:hidden flex flex-row gap-4">
              <SocialLinks />
            </ul>
          </nav>
        </div>
        <div
          className="p-6 border-t border-gray-300 dark:border-gray-850 hidden xl:block xl:sidenav-collapsed:ml-1"
          data-role="sidenav-collapse-toggle-container"
        >
          <button
            className="select-none cursor-pointer"
            data-role="sidenav-collapse-toggle"
          >
            <NavCollapseIcon className="sidenav-collapsed:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function NavWrapper({ children }: { children: ReactNode }) {
  const { config } = usePageBuildContext()

  const groups: NavbarLinkGroups = [
    {
      title: 'Scaling',
      links: [
        {
          title: 'Summary',
          icon: SummaryIcon,
          href: '/scaling/summary',
          enabled: true,
        },
        {
          title: 'Value Locked',
          icon: TvlIcon,
          href: '/scaling/tvl',
          enabled: true,
        },
        {
          title: 'Risk Analysis',
          icon: RiskIcon,
          href: '/scaling/risk',
          enabled: true,
        },
        {
          title: 'Data Availability',
          icon: DataAvailabilityIcon,
          href: '/scaling/data-availability',
          enabled: true,
        },
        {
          title: 'Liveness',
          icon: LivenessIcon,
          href: '/scaling/liveness',
          enabled: config.features.liveness,
        },
        {
          title: 'Finality',
          icon: FinalityIcon,
          href: '/scaling/finality',
          enabled: config.features.finality,
        },
        {
          title: 'Activity',
          icon: ActivityIcon,
          href: '/scaling/activity',
          enabled: config.features.activity,
        },
        {
          title: 'Costs',
          icon: CostsIcon,
          href: '/scaling/costs',
          enabled: config.features.costsPage,
        },
      ],
    },
    {
      title: 'Bridges',
      links: [
        {
          title: 'Summary',
          icon: SummaryIcon,
          href: '/bridges/summary',
          enabled: true,
        },
        {
          title: 'Risk Analysis',
          icon: RiskIcon,
          href: '/bridges/risk',
          enabled: true,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col xl:flex-row relative overflow-x-hidden">
      <MobileNavBar links={groups} />
      <Sidenav links={groups} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
