import { SidebarProvider } from '~/components/core/Sidebar'
import { Footer } from '~/components/Footer'
import { MobileTopNavbar } from '~/components/nav/mobile/MobileTopNavbar'
import { NavSidebar } from '~/components/nav/sidebar/NavSidebar'
import { TopBanner } from '~/components/TopBanner'
import { useWhatsNewContext } from '~/components/whats-new/WhatsNewContext'
import { WhatsNewWidgetCloseable } from '~/components/whats-new/WhatsNewWidgetCloseable'
import { navGroups } from '~/consts/navGroups'
import { navSecondaryLinks } from '~/consts/navSecondaryLinks'
import { cn } from '~/utils/cn'

const LOGO_LINK = '/'

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  contentAreaClassName?: string
  maxWidth?: 'default' | 'wide'
  /** Full-width content, top bar on mobile. */
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

  return (
    <SidebarProvider>
      <div className="relative flex grow flex-col lg:flex-row">
        <div className="block lg:hidden">{topChildren}</div>
        <MobileTopNavbar
          groups={navGroups}
          logoLink={LOGO_LINK}
          sideLinks={navSecondaryLinks}
        />
        <NavSidebar
          logoLink={LOGO_LINK}
          groups={navGroups}
          sideLinks={navSecondaryLinks}
        />
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:ml-3 lg:pt-0',
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
