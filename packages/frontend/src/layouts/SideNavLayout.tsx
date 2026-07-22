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

export type SideNavLayoutVariant = 'default' | 'wide' | 'home'

/**
 * Per-surface classes for each layout variant. 'home' is the full-width
 * homepage treatment: the content area owns its padding and the footer
 * spans the whole page.
 */
const VARIANT_CLASSES: Record<
  SideNavLayoutVariant,
  {
    topBanner?: string
    bannerWrapper: string
    contentArea: string
    footer: string
    footerInner: string
  }
> = {
  default: {
    bannerWrapper: 'lg:mr-3',
    contentArea: 'md:px-5 lg:pl-0 max-w-(--breakpoint-lg)',
    footer: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
    footerInner: 'max-w-[1142px]',
  },
  wide: {
    bannerWrapper: 'lg:mr-3',
    contentArea: 'md:px-5 lg:pl-0 max-w-412',
    footer: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
    footerInner: 'max-w-[1142px]',
  },
  home: {
    topBanner: 'lg:mr-0',
    bannerWrapper: 'lg:mr-0',
    contentArea:
      'max-w-none px-4 pb-6 max-md:px-0 md:px-6 lg:px-8 xl:px-10 2xl:max-w-[1840px]',
    footer: 'md:px-8 md:pt-10 lg:px-16 lg:pt-12 lg:pb-6',
    footerInner: 'max-w-none',
  },
}

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  variant?: SideNavLayoutVariant
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
  variant = 'default',
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const classes = VARIANT_CLASSES[variant]
  const topChildren = (
    <TopBanner
      className={cn('lg:rounded-b-xl 2xl:rounded-br-none', classes.topBanner)}
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
            className={cn('hidden lg:block 2xl:mr-0', classes.bannerWrapper)}
          >
            {topChildren}
          </div>
          <div
            className={cn(
              'mx-auto flex w-full min-w-0 grow flex-col',
              classes.contentArea,
            )}
          >
            {children}
            {whatsNew && <WhatsNewWidgetCloseable whatsNew={whatsNew} />}
          </div>
          <Footer
            className={classes.footer}
            innerContainerClassName={classes.footerInner}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}
