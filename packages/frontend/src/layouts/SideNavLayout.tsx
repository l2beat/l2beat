import compact from 'lodash/compact'
import { useMemo } from 'react'
import { HiringBadge } from '~/components/badge/HiringBadge'
import { ChangelogUnreadBadge } from '~/components/changelog/ChangelogUnreadBadge'
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
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { DefiIcon } from '~/icons/pages/Defi'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { createOrderedSort } from '~/utils/sort'

const LOGO_LINK = '/scaling/summary'

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  maxWidth?: 'default' | 'wide'
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
  maxWidth = 'default',
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const topChildren = (
    <TopBanner className="lg:rounded-b-xl 2xl:rounded-br-none" />
  )

  const groups = useMemo(
    () =>
      compact<NavGroup>([
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
              subLinks: [
                {
                  title: 'Overview',
                  href: '/scaling/risk',
                  exactMatch: true,
                },
                {
                  title: 'State Validation',
                  href: '/scaling/risk/state-validation',
                },
                {
                  title: 'Data Availability',
                  shortTitle: 'DA',
                  href: '/scaling/risk/data-availability',
                },
                {
                  title: 'Sequencing',
                  href: '/scaling/risk/sequencing',
                },
              ],
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
              title: 'Archived',
              href: '/scaling/archived',
            },
          ],
        },
        {
          type: 'multiple',
          title: 'Interop',
          match: 'interop',
          icon: (
            <BridgesIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
          ),
          links: [
            {
              title: 'Summary',
              href: '/interop/summary',
            },
            {
              title: 'Token frameworks',
              href: '/interop/token-frameworks',
            },
            {
              title: 'Intent bridges',
              href: '/interop/intent-bridges',
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
          type: 'single',
          title: 'Privacy',
          match: 'privacy',
          href: '/privacy',
          icon: (
            <PrivacyIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
          ),
        },
        {
          type: 'single',
          title: 'DeFi',
          match: 'defi',
          href: '/defi',
          icon: (
            <DefiIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
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
      ]),
    [],
  )

  const sideLinks = useMemo(
    () =>
      compact([
        {
          title: 'About Us',
          href: '/about-us',
        },
        {
          title: 'Publications',
          href: '/publications',
        },
        {
          title: 'Changelog',
          href: '/changelog',
          accessory: <ChangelogUnreadBadge />,
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
          title: 'Native Rollups',
          href: '/native-rollups',
        },
        {
          title: 'Tools',
          href: externalLinks.tools,
        },
        {
          title: 'Glossary',
          href: '/glossary',
        },
        {
          title: 'Jobs',
          href: externalLinks.jobs,
          accessory: env.CLIENT_SIDE_SHOW_HIRING_BADGE ? (
            <HiringBadge />
          ) : undefined,
        },
        {
          title: 'Brand Kit',
          href: '/brand-kit',
        },
        {
          title: 'FAQ',
          href: '/faq',
        },
      ]),
    [],
  )

  return (
    <SidebarProvider>
      <div className="relative flex grow flex-col lg:flex-row">
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
        />
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:ml-3 lg:pt-0',
            childrenWrapperClassName,
          )}
        >
          <div className="hidden lg:mr-3 lg:block 2xl:mr-0">{topChildren}</div>
          <div
            style={
              {
                '--tablet-content-horizontal-padding': '20px',
              } as React.CSSProperties
            }
            className={cn(
              'mx-auto flex w-full grow flex-col md:px-(--tablet-content-horizontal-padding) lg:pl-0',
              maxWidth === 'default' && 'max-w-(--breakpoint-lg)',
              maxWidth === 'wide' && 'max-w-412',
            )}
          >
            {children}
            {whatsNew && <WhatsNewWidgetCloseable whatsNew={whatsNew} />}
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
