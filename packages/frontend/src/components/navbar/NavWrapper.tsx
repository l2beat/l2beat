import React, { ReactNode, SVGAttributes } from 'react'
import { usePageBuildContext } from '../../build/pageBuildContext'
import { cn } from '../../utils/cn'
import { Logo } from '../Logo'
import { LogoSmall } from '../LogoSmall'
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
      <div className="ml-1 font-medium text-[0.8125rem] text-slate-600 uppercase leading-[0.8125rem] xl:sidenav-collapsed:hidden dark:text-zinc-500">
        {title}
      </div>
      <div className="mt-[12px] hidden h-px w-8 bg-slate-600 xl:sidenav-collapsed:block dark:bg-zinc-500" />
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
          'flex items-center gap-[0.625rem] rounded-[0.25rem] p-1.5 transition-colors duration-300 ease-out xl:sidenav-collapsed:h-8 xl:sidenav-collapsed:w-8 xl:sidenav-collapsed:justify-center dark:hover:bg-[#272A2F] hover:bg-[#F1D6FF] xl:sidenav-collapsed:p-0',
          active && 'bg-[#d3d5d9] dark:bg-[#393C43]',
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
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined}>
      <li
        className={cn(
          'font-medium text-xs text-zinc-800 leading-none transition-colors duration-300 ease-out dark:hover:text-gray-400 dark:text-white hover:text-zinc-500',
          active &&
            'text-pink-900 dark:hover:text-pink-200 dark:text-pink-200 hover:text-pink-900',
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

/*
function NewItemBadge() {
  return (
    <span className="text-[#AB3BD2] dark:text-[#AB3BD2] text-xs font-semibold">
      New
    </span>
  )
}
*/

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
          'relative flex h-full flex-col justify-center px-2 font-medium text-base md:px-4 md:text-lg',
          active && 'text-pink-900 dark:text-pink-200',
        )}
      >
        {title}
        {active && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-pink-900" />
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

function getMainLink(path: string, links: NavbarLinkGroups) {
  return (
    links.find((g) => path.startsWith(`/${g.links[0].href.split('/')[1]}`))
      ?.links[0].href ?? '/'
  )
}

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
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-gray-200 border-b px-3.5 dark:border-gray-850">
        {/* Left side */}
        <div className="flex flex-row gap-4">
          <div className="py-4">
            <a href={getMainLink(path, links)}>
              <Logo className="h-8 w-auto" />
            </a>
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
        <div
          className="scrollbar-hide w-full overflow-x-scroll border-gray-200 border-b text-center dark:border-gray-850"
          data-role="sidenav-mobile-tabs"
        >
          <div className="m-auto inline-flex flex-row gap-2 px-4 py-2">
            {currentGroup.links
              .filter((link) => link.enabled)
              .map((link) => (
                <a href={link.href} key={link.href}>
                  <div
                    className={cn(
                      'm-auto whitespace-nowrap rounded-[4px] border border-[#AB3BD2] px-4 py-[0.53125rem] font-semibold text-xs leading-none',
                      link.href === path &&
                        'border-0 bg-[linear-gradient(90deg,_#7E41CC_0%,_#FF46C0_100%)] px-[calc(1rem_+_1px)] py-[calc(0.53125rem_+_1px)] text-white',
                    )}
                    data-sidenav-mobile-tabs-active={
                      link.href === path ? 'true' : 'false'
                    }
                  >
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
        'h-px w-full bg-gray-300 xl:sidenav-collapsed:hidden dark:bg-gray-850',
        className,
      )}
    />
  )
}

export function Sidenav({
  links,
  legacyNav,
}: {
  links: NavbarLinkGroups
  legacyNav: boolean
}) {
  const { config, path } = usePageBuildContext()
  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen h-[100dvh]',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  return (
    <div
      className={cn(
        'group absolute z-999 flex flex-shrink-0 translate-x-full flex-col items-stretch transition-all duration-300 xl:static xl:sidenav-collapsed:w-20 data-[open=true]:translate-x-0 xl:transform-none',
        sharedSizeClasses,
      )}
      data-role="sidenav"
    >
      <div
        className={cn(
          'flex flex-col overflow-x-clip bg-[#E6E7EC] transition-all xl:fixed xl:sidenav-collapsed:w-20 dark:border-gray-850 xl:dark:border-r dark:border-r-0 dark:bg-[#1E1C21]',
          sharedSizeClasses,
        )}
        data-role="sidenav-inner"
      >
        <div
          className={cn(
            'flex flex-1 flex-col gap-8 overflow-y-auto overflow-x-clip px-3.5 py-4 xl:px-6 xl:py-[1.125rem]',
            sharedSizeClasses,
          )}
          data-role="sidenav-collapse-content"
        >
          <div className="flex flex-row items-center justify-between">
            <a href={getMainLink(path, links)}>
              <Logo className="block h-8 w-auto xl:sidenav-collapsed:hidden" />
              <LogoSmall className="hidden h-8 w-auto xl:sidenav-collapsed:block" />
            </a>
            <div className="flex flex-row items-center gap-4 xl:sidenav-collapsed:hidden">
              <DarkThemeToggle />
              <button className="xl:hidden" data-role="sidenav-mobile-toggle">
                <MenuCloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-6">
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
                {config.features.hiringBadge && <HiringBadge />}
              </NavSmallLink>
              <NavSmallLink title="FAQ" href="/faq" />
            </NavSmallLinkGroup>
            <Divider className="xl:hidden" />
            <ul className="flex flex-row gap-4 pb-12 xl:hidden">
              <SocialLinks />
            </ul>
          </nav>
        </div>
        <div
          className="hidden border-gray-300 border-t p-6 xl:sidenav-collapsed:ml-1 xl:block dark:border-gray-850"
          data-role="sidenav-collapse-toggle-container"
        >
          <button
            className="cursor-pointer select-none"
            data-role="sidenav-collapse-toggle"
          >
            <NavCollapseIcon
              className="sidenav-collapsed:rotate-180"
              fill="none"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function LegacyNavBarLink({
  href,
  children,
  large,
  title,
}: { href: string; large?: boolean } & (
  | { title: string; children?: never }
  | { title?: never; children: React.ReactNode }
)) {
  const { path } = usePageBuildContext()
  return (
    <li className="h-full">
      <a
        className={cn(
          'flex h-full items-center font-medium',
          large ? 'px-2 text-base md:px-4 md:text-lg' : 'px-2',
          path === href &&
            'border-current border-b-2 pt-0.5 text-pink-900 dark:text-pink-200',
        )}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
      >
        {children || title}
      </a>
    </li>
  )
}

function LegacyNavBar({ links }: { links: NavbarLinkGroups }) {
  const { path, config } = usePageBuildContext()
  return (
    <div className="hidden h-[4.25rem] border-gray-200 border-b text-base xl:block dark:border-gray-850">
      <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-6">
        <ul className="flex items-center py-4">
          <li className="mr-8">
            <a href={path.startsWith('/bridges') ? '/bridges/summary' : '/'}>
              <Logo className="h-8 w-auto" />
            </a>
          </li>
          {links.map((group) => (
            <LegacyNavBarLink
              key={group.title}
              large
              href={group.links[0].href}
              title={group.title}
            />
          ))}
        </ul>
        <div className="flex h-full items-center gap-5">
          <ul className="hidden items-center gap-4 2xl:flex">
            <SocialLinks />
          </ul>
          <div className="hidden h-8 w-px bg-gray-300 2xl:block dark:bg-gray-700" />
          <ul className="flex h-full items-center gap-1.5">
            <LegacyNavBarLink title="Forum" href={config.links.forum} />
            {config.features.zkCatalog && (
              <LegacyNavBarLink title="ZK Catalog" href="/zk-catalog" />
            )}
            <LegacyNavBarLink title="Donate" href={'/donate'} />
            {config.features.governancePage ? (
              <LegacyNavBarLink title="Governance" href={'/governance'} />
            ) : (
              <LegacyNavBarLink
                title="Governance"
                href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3"
              />
            )}
            {config.features.glossary && (
              <LegacyNavBarLink title="Glossary" href="/glossary" />
            )}
            <LegacyNavBarLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
              Jobs
              {config.features.hiringBadge && <HiringBadge />}
            </LegacyNavBarLink>
            <LegacyNavBarLink title="FAQ" href="/faq" />
          </ul>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
          <DarkThemeToggle />
        </div>
      </nav>
    </div>
  )
}

export function NavWrapper({
  children,
  legacyNav,
}: {
  children: ReactNode
  legacyNav?: boolean
}) {
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
    <div
      className={cn(
        'relative flex flex-col overflow-x-clip xl:flex-row',
        legacyNav && 'xl:flex-col',
      )}
    >
      {!!legacyNav && <LegacyNavBar links={groups} />}
      <MobileNavBar links={groups} />
      <Sidenav links={groups} legacyNav={!!legacyNav} />
      <div className="flex-1 overflow-x-clip">{children}</div>
    </div>
  )
}
