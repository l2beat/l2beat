import compact from 'lodash/compact'
import { useMemo } from 'react'
import { SidebarProvider } from '~/components/core/Sidebar'
import { Footer } from '~/components/Footer'
import { MobileTopNavbar } from '~/components/nav/mobile/MobileTopNavbar'
import { SecondaryLinksNav } from '~/components/nav/SecondaryLinksNav'
import { NavSidebar } from '~/components/nav/sidebar/NavSidebar'
import type { NavGroup } from '~/components/nav/types'
import { TopBanner } from '~/components/TopBanner'
import { useWhatsNewContext } from '~/components/whats-new/WhatsNewContext'
import { WhatsNewWidgetCloseable } from '~/components/whats-new/WhatsNewWidgetCloseable'
import { getNavSecondaryLinks } from '~/consts/navSecondaryLinks'
import { PARTNERS_ORDER } from '~/consts/partnersOrder'
import { env } from '~/env'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { OverviewIcon } from '~/icons/pages/Overview'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { createOrderedSort } from '~/utils/sort'

const LOGO_LINK = '/home'

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  contentAreaClassName?: string
  maxWidth?: 'default' | 'wide'
  /** Full-width content, no fixed desktop sidebar, top bar on all breakpoints, secondary links above footer. */
  homepageLayout?: boolean
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
  contentAreaClassName,
  maxWidth = 'default',
  homepageLayout = false,
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const topChildren = (
    <TopBanner
      className={cn(
        'lg:rounded-b-xl 2xl:rounded-br-none',
        homepageLayout && 'lg:mr-0',
      )}
    />
  )

  const groups = useMemo(
    () =>
      compact<NavGroup>([
        {
          type: 'single',
          title: 'Home',
          match: 'home',
          href: '/home',
          icon: (
            <OverviewIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
          ),
        },
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
        env.CLIENT_SIDE_PRIVACY_ENABLED && {
          type: 'single',
          title: 'Privacy',
          match: 'privacy',
          href: '/privacy',
          icon: (
            <PrivacyIcon className="transition-colors duration-300 group-data-[active=true]:stroke-brand" />
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

  const sideLinks = useMemo(() => getNavSecondaryLinks(), [])

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
          suppressDesktopSidebar={homepageLayout}
          omitSecondaryDrawerLinks={homepageLayout}
        />
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:pt-0',
            homepageLayout ? 'lg:ml-0' : 'lg:ml-3',
            childrenWrapperClassName,
          )}
        >
          <div
            className={cn(
              'hidden lg:block 2xl:mr-0',
              homepageLayout ? 'lg:mr-0' : 'lg:mr-3',
            )}
          >
            {topChildren}
          </div>
          <div
            className={cn(
              'mx-auto flex w-full min-w-0 grow flex-col',
              homepageLayout
                ? 'max-w-none px-4 pb-6 md:px-6 lg:px-8 xl:px-10'
                : 'md:px-5 lg:pl-0',
              !homepageLayout &&
                maxWidth === 'default' &&
                'max-w-(--breakpoint-lg)',
              !homepageLayout && maxWidth === 'wide' && 'max-w-412',
              contentAreaClassName,
            )}
          >
            {children}
            {whatsNew && <WhatsNewWidgetCloseable whatsNew={whatsNew} />}
            {homepageLayout && (
              <SecondaryLinksNav
                links={sideLinks}
                className={cn(
                  'mt-12 w-full justify-center gap-x-6 gap-y-3 max-xl:justify-start xl:justify-center',
                )}
              />
            )}
          </div>
          <Footer
            className={cn(
              homepageLayout && 'md:px-8 md:pt-10 lg:px-16 lg:pt-12 lg:pb-6',
              !homepageLayout && 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
            )}
            innerContainerClassName={
              homepageLayout ? 'max-w-none' : 'max-w-[1142px]'
            }
          />
        </div>
      </div>
    </SidebarProvider>
  )
}
