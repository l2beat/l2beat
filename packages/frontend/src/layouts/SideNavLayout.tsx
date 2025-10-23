import compact from 'lodash/compact'
import { HiringBadge } from '~/components/badge/HiringBadge'
import { SidebarProvider } from '~/components/core/Sidebar'
import { Footer } from '~/components/Footer'
import { MobileTopNavbar } from '~/components/nav/mobile/MobileTopNavbar'
import { NavSidebar } from '~/components/nav/sidebar/NavSidebar'
import type { NavGroup } from '~/components/nav/types'
import { TopBanner } from '~/components/TopBanner'
import { useWhatsNewContext } from '~/components/whats-new/WhatsNewContext'
import { WhatsNewWidgetCloseable } from '~/components/whats-new/WhatsNewWidgetCloseable'
import { externalLinks } from '~/consts/externalLinks'
import { PARTNERS_ORDER } from '~/consts/partnersOrder'
import { env } from '~/env'
import { useIsMobile } from '~/hooks/useIsMobile'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { createOrderedSort } from '~/utils/sort'

const LOGO_LINK = '/scaling/summary'

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const isMobile = useIsMobile()
  const topChildren = (
    <TopBanner className="lg:rounded-b-xl 2xl:rounded-br-none" />
  )
  return (
    <SidebarProvider>
      <div className="relative flex flex-col lg:flex-row">
        <div className="block lg:hidden">{topChildren}</div>
        <MobileTopNavbar
          groups={groups}
          logoLink={LOGO_LINK}
          sideLinks={sideLinks}
        />
        <NavSidebar
          logoLink={LOGO_LINK}
          groups={groups}
          sideLinks={sideLinks}
          whatsNew={whatsNew}
        />
        <div
          className={cn(
            'min-w-0 flex-1 has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:ml-3 lg:pt-0',
            childrenWrapperClassName,
          )}
        >
          <div className="hidden lg:mr-3 lg:block 2xl:mr-0">{topChildren}</div>
          <div className="mx-auto min-h-screen max-w-(--breakpoint-lg) md:px-5 lg:pl-0">
            {children}
            {whatsNew && isMobile && (
              <WhatsNewWidgetCloseable whatsNew={whatsNew} />
            )}
          </div>
          <Footer
            className="md:px-12 md:pt-8 lg:pr-9 lg:pl-6"
            innerContainerClassName="max-w-[1142px]"
          />
        </div>
      </div>
    </SidebarProvider>
  )
}

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
    links: [
      {
        title: 'Summary',
        href: '/data-availability/summary',
      },
      {
        title: 'Risk Analysis',
        shortTitle: 'Risks',
        href: '/data-availability/risk',
      },
      {
        title: 'Throughput',
        shortTitle: 'Throughput',
        href: '/data-availability/throughput',
      },
      {
        title: 'Liveness',
        shortTitle: 'Liveness',
        href: '/data-availability/liveness',
      },
    ],
    secondaryLinks: [
      {
        title: 'Archived',
        href: '/data-availability/archived',
      },
    ],
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
  {
    type: 'multiple',
    title: 'Ecosystems',
    match: 'ecosystems',
    disableMobileTabs: true,
    icon: (
      <EcosystemsIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
    ),
    preventTitleNavigation: true,
    links: [
      {
        name: 'Agglayer',
        slug: 'agglayer',
      },
      {
        name: 'Arbitrum Orbit',
        slug: 'arbitrum-orbit',
      },
      {
        name: 'Superchain',
        slug: 'superchain',
      },
      {
        name: 'The Elastic Network',
        slug: 'the-elastic-network',
      },
    ]
      .sort(createOrderedSort(PARTNERS_ORDER, (item) => item.slug))
      .map((ecosystem) => ({
        title: ecosystem.name,
        href: `/ecosystems/${ecosystem.slug}`,
      })),
  },
])

const sideLinks = compact([
  {
    title: 'Publications',
    href: '/publications',
  },
  {
    title: 'About Us',
    href: '/about-us',
  },
  {
    title: 'Forum',
    href: externalLinks.forum,
  },
  {
    title: 'Donate',
    href: '/donate',
  },
  {
    title: 'Governance',
    href: '/governance',
  },
  {
    title: 'Glossary',
    href: '/glossary',
  },
  {
    title: 'Jobs',
    href: externalLinks.jobs,
    accessory: env.CLIENT_SIDE_SHOW_HIRING_BADGE ? <HiringBadge /> : undefined,
  },
  {
    title: 'Brand Kit',
    href: externalLinks.brandKit,
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
])
