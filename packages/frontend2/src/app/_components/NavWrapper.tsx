import React, { type ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { Logo } from '../_components/Logo'
import { DarkThemeToggle } from '../_components/DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { SocialLinks } from './SocialLinks'
import { usePathname } from 'next/navigation'
import { NavMobileLink } from './NavMobileLink'
import { NavLinkGroup } from './NavLinkGroup'
import { NavLink } from './NavLink'
import { NavDivider } from './NavDivider'
import { NavSmallLinkGroup } from './NavSmallLinkGroup'
import { NavSmallLink } from './NavSmallLink'
import NavCollapseIcon from '~/icons/nav-collapse.svg'
import MenuOpenIcon from '~/icons/menu-open.svg'
import MenuCloseIcon from '~/icons/menu-close.svg'
import SummaryIcon from '~/icons/summary.svg'
import TvlIcon from '~/icons/tvl.svg'
import RiskIcon from '~/icons/risk.svg'
import DataAvailabilityIcon from '~/icons/data-availability.svg'
import LivenessIcon from '~/icons/liveness.svg'
import FinalityIcon from '~/icons/finality.svg'
import ActivityIcon from '~/icons/activity.svg'
import CostsIcon from '~/icons/costs.svg'

interface NavbarLinkGroup {
  title: string
  links: {
    title: string
    icon: React.FC<React.SVGProps<SVGElement>>
    href: string
    enabled: boolean
  }[]
}

/**
 * Find a link that should be used on the main logo.
 * @param path Current pathname
 * @param links Navbar links
 * @returns Link to the main page of the current group, if visitor is on a group page
 */
function getMainLink(pathname: string, groups: NavbarLinkGroup[]) {
  return (
    groups.find((g) =>
      pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`),
    )?.links[0]?.href ?? '/'
  )
}

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
function MobileNavBar({ groups }: { groups: NavbarLinkGroup[] }) {
  const pathname = usePathname()
  const currentGroup = groups.find((g) =>
    pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`),
  )
  return (
    <div className="xl:hidden">
      <div className="h-16 px-3.5 relative flex justify-between flex-row gap-8 border-b border-gray-200 dark:border-gray-850 items-stretch">
        {/* Left side */}
        <div className="flex flex-row gap-4">
          <div className="py-4">
            <a href={getMainLink(pathname, groups)}>
              <Logo className="h-8 w-auto" />
            </a>
          </div>
          <ul className="flex flex-row">
            <NavMobileLink
              title="Scaling"
              href="/scaling/summary"
              activeBehavior={(path) => path.startsWith('/scaling')}
            />
            <NavMobileLink
              title="Bridges"
              href="/bridges/summary"
              activeBehavior={(path) => path.startsWith('/bridges')}
            />
          </ul>
        </div>
        {/* Right side */}
        <div className="flex flex-row items-center">
          <button>
            <MenuOpenIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {currentGroup && (
        <div className="overflow-x-scroll w-full border-b border-gray-200 dark:border-gray-850 text-center scrollbar-hide">
          <div className="inline-flex flex-row gap-2 px-4 py-2 m-auto">
            {currentGroup.links
              .filter((link) => link.enabled)
              .map((link) => (
                <a href={link.href} key={link.href}>
                  <div
                    className={cn(
                      'rounded-[4px] border border-[#AB3BD2] text-xs font-semibold px-4 py-[0.53125rem] whitespace-nowrap m-auto leading-none',
                      link.href === pathname &&
                        'bg-[linear-gradient(90deg,_#7E41CC_0%,_#FF46C0_100%)] text-white border-0 px-[calc(1rem_+_1px)] py-[calc(0.53125rem_+_1px)]',
                    )}
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

export function Sidenav({
  groups,
  legacyNav,
}: {
  groups: NavbarLinkGroup[]
  legacyNav: boolean
}) {
  const pathname = usePathname()

  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen h-[100dvh]',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  return (
    <div
      className={cn(
        'flex-shrink-0 xl:static absolute flex flex-col items-stretch group translate-x-full data-[open=true]:translate-x-0 duration-300 xl:transform-none xl:sidenav-collapsed:w-20 z-999 transition-all',
        sharedSizeClasses,
      )}
    >
      <div
        className={cn(
          'bg-[#E6E7EC] dark:bg-[#1E1C21] xl:dark:border-r dark:border-gray-850 dark:border-r-0 flex flex-col xl:fixed xl:sidenav-collapsed:w-20 overflow-x-clip transition-all',
          sharedSizeClasses,
        )}
      >
        <div
          className={cn(
            'xl:px-6 px-3.5 py-4 xl:py-[1.125rem] overflow-y-auto overflow-x-clip flex-1 flex flex-col gap-8',
            sharedSizeClasses,
          )}
        >
          <div className="flex flex-row justify-between items-center">
            <a href={getMainLink(pathname, groups)}>
              <Logo className="h-8 w-auto block xl:sidenav-collapsed:hidden" />
              <Logo
                small
                className="h-8 w-auto hidden xl:sidenav-collapsed:block"
              />
            </a>
            <div className="xl:sidenav-collapsed:hidden flex flex-row gap-4 items-center">
              <DarkThemeToggle />
              <button className="xl:hidden">
                <MenuCloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-6 flex-1">
            {groups.map((group) => (
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
            <NavDivider />
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
            <NavDivider className="xl:hidden" />
            <ul className="xl:hidden flex flex-row gap-4 pb-12">
              <SocialLinks />
            </ul>
          </nav>
        </div>
        <div className="p-6 border-t border-gray-300 dark:border-gray-850 hidden xl:block xl:sidenav-collapsed:ml-1">
          <button className="select-none cursor-pointer">
            <NavCollapseIcon className="stroke-[#525C6A] dark:stroke-[#D3D5D9] sidenav-collapsed:rotate-180" />
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
  const pathname = usePathname()
  return (
    <li className="h-full">
      <a
        className={cn(
          'flex h-full items-center font-medium',
          large ? 'px-2 text-base md:px-4 md:text-lg' : 'px-2',
          pathname === href &&
            'border-b-2 border-current pt-0.5 text-pink-900 dark:text-pink-200',
        )}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
      >
        {children ?? title}
      </a>
    </li>
  )
}

function LegacyNavBar({ groups }: { groups: NavbarLinkGroup[] }) {
  const pathname = usePathname()
  return (
    <div className="h-[4.25rem] border-b border-gray-200 text-base dark:border-gray-850 hidden xl:block">
      <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-6">
        <ul className="flex py-4 items-center">
          <li className="mr-8">
            <a
              href={pathname.startsWith('/bridges') ? '/bridges/summary' : '/'}
            >
              <Logo className="h-8 w-auto" />
            </a>
          </li>
          {groups.map(
            (group) =>
              group.links[0] && (
                <LegacyNavBarLink
                  key={group.title}
                  large
                  href={group.links[0].href}
                  title={group.title}
                />
              ),
          )}
        </ul>
        <div className="flex h-full items-center gap-5">
          <ul className="items-center gap-4 hidden 2xl:flex">
            <SocialLinks />
          </ul>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden 2xl:block" />
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
  const groups: NavbarLinkGroup[] = [
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
        'flex flex-col xl:flex-row relative overflow-x-clip',
        legacyNav && 'xl:flex-col',
      )}
    >
      {!!legacyNav && <LegacyNavBar groups={groups} />}
      <MobileNavBar groups={groups} />
      <Sidenav groups={groups} legacyNav={!!legacyNav} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
