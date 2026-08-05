import { cva } from 'class-variance-authority'
import { SidebarProvider } from '~/components/core/Sidebar'
import { Footer } from '~/components/Footer'
import { MobileTopNavbar } from '~/components/nav/mobile/MobileTopNavbar'
import { NavSidebar } from '~/components/nav/sidebar/NavSidebar'
import type { NavSectionCounts } from '~/components/nav/types'
import { TopBanner } from '~/components/TopBanner'
import { useWhatsNewContext } from '~/components/whats-new/WhatsNewContext'
import { WhatsNewWidgetCloseable } from '~/components/whats-new/WhatsNewWidgetCloseable'
import { navGroups } from '~/consts/navGroups'
import { navSecondaryLinks } from '~/consts/navSecondaryLinks'
import { env } from '~/env'
import { cn } from '~/utils/cn'

const LOGO_LINK = env.CLIENT_SIDE_HOME_PAGE ? '/' : '/scaling/summary'

export type SideNavLayoutVariant = 'default' | 'wide' | 'home'

const topBannerVariants = cva('lg:rounded-b-xl 2xl:rounded-br-none', {
  variants: {
    variant: {
      default: undefined,
      wide: undefined,
      home: 'lg:mr-0',
    },
  },
})

const bannerWrapperVariants = cva('hidden lg:block 2xl:mr-0', {
  variants: {
    variant: {
      default: 'lg:mr-3',
      wide: 'lg:mr-3',
      home: 'lg:mr-0',
    },
  },
})

const contentAreaVariants = cva('mx-auto flex w-full min-w-0 grow flex-col', {
  variants: {
    variant: {
      default: 'max-w-(--breakpoint-lg) md:px-5 lg:pl-0',
      wide: 'max-w-412 md:px-5 lg:pl-0',
      // Slightly tighter gutters than the other pages, so the interop graph
      // gets the width back on a laptop screen, and a higher ceiling than the
      // article-shaped pages: the home grid keeps reading well wide, so a very
      // large screen should not be mostly background.
      home: 'max-w-none px-4 pb-6 max-md:px-0 md:px-6 lg:px-6 xl:px-8 2xl:max-w-[2100px] 2xl:px-10',
    },
  },
})

const footerVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      wide: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      home: 'md:px-8 md:pt-10 lg:px-16 lg:pt-12 lg:pb-6',
    },
  },
})

const footerInnerVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'max-w-[1142px]',
      wide: 'max-w-[1142px]',
      home: 'max-w-none',
    },
  },
})

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  variant?: SideNavLayoutVariant
  /** Per-section metrics rendered in the side nav, keyed by `NavGroup.match`. */
  sidebarCounts?: NavSectionCounts
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
  variant = 'default',
  sidebarCounts,
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const topChildren = <TopBanner className={topBannerVariants({ variant })} />

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
          counts={sidebarCounts}
        />
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:ml-3 lg:pt-0',
            childrenWrapperClassName,
          )}
        >
          <div className={bannerWrapperVariants({ variant })}>
            {topChildren}
          </div>
          <div className={contentAreaVariants({ variant })}>
            {children}
            {whatsNew && <WhatsNewWidgetCloseable whatsNew={whatsNew} />}
          </div>
          <Footer
            className={footerVariants({ variant })}
            innerContainerClassName={footerInnerVariants({ variant })}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}
