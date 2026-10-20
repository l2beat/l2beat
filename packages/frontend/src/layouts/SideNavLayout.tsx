import { cva } from 'class-variance-authority'
import { SidebarProvider, useSidebar } from '~/components/core/Sidebar'
import { Footer } from '~/components/Footer'
import { MobileTopNavbar } from '~/components/nav/mobile/MobileTopNavbar'
import { NavSidebar } from '~/components/nav/sidebar/NavSidebar'
import { TopBanner } from '~/components/TopBanner'
import { useWhatsNewContext } from '~/components/whats-new/WhatsNewContext'
import type { WhatsNewWidget } from '~/components/whats-new/WhatsNewWidget'
import { WhatsNewWidgetCloseable } from '~/components/whats-new/WhatsNewWidgetCloseable'
import { navGroups } from '~/consts/navGroups'
import { navSecondaryLinks } from '~/consts/navSecondaryLinks'
import { cn } from '~/utils/cn'

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

const contentWrapperVariants = cva(
  'flex min-w-0 flex-1 flex-col has-data-hide-overflow-x:overflow-x-clip md:pt-5 lg:pt-0',
  {
    variants: {
      variant: {
        default: 'lg:ml-3',
        wide: 'lg:ml-3',
        home: 'lg:ml-0',
      },
    },
  },
)

const contentAreaVariants = cva('mx-auto flex w-full min-w-0 grow flex-col', {
  variants: {
    variant: {
      default: 'max-w-(--breakpoint-lg) md:px-5 lg:pl-0',
      wide: 'max-w-412 md:px-5 lg:pl-0',
      home: 'max-w-none px-4 pb-6 max-md:px-0 max-md:pb-0 md:px-6 xl:px-10 2xl:max-w-[1840px]',
    },
  },
})

const footerVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      wide: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      // The content area's own margins, so the footer lines up with the cards.
      home: 'md:px-6 md:pt-10 lg:pt-12 lg:pb-6 xl:px-10',
    },
  },
})

const footerInnerVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'max-w-[1142px]',
      wide: 'max-w-[1142px]',
      home: 'max-w-none 2xl:max-w-[1840px]',
    },
  },
})

export interface SideNavLayoutProps {
  children: React.ReactNode
  childrenWrapperClassName?: string
  variant?: SideNavLayoutVariant
  /** Scenery behind the whole page, nav included - see `PageBackdrop`. */
  backdrop?: React.ReactNode
}

export function SideNavLayout({
  children,
  childrenWrapperClassName,
  variant = 'default',
  backdrop,
}: SideNavLayoutProps) {
  const whatsNew = useWhatsNewContext()
  const topChildren = <TopBanner className={topBannerVariants({ variant })} />

  return (
    <SidebarProvider data-with-backdrop={backdrop ? '' : undefined}>
      {backdrop}
      <div className="relative flex grow flex-col lg:flex-row">
        <div className="block lg:hidden">{topChildren}</div>
        <MobileTopNavbar
          groups={navGroups}
          logoLink="/"
          sideLinks={navSecondaryLinks}
        />
        <NavSidebar logoLink="/" groups={navGroups} />
        <div
          className={cn(
            contentWrapperVariants({ variant }),
            childrenWrapperClassName,
          )}
        >
          <div className={bannerWrapperVariants({ variant })}>
            {topChildren}
          </div>
          <div className={contentAreaVariants({ variant })}>
            {children}
            {whatsNew && <FloatingWhatsNew whatsNew={whatsNew} />}
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

/**
 * The announcement in a corner, below lg; from lg the nav shows it itself.
 * Not while the mobile menu is open: the menu is a hair see-through (see
 * Sidebar), and a bright card under it shows.
 */
function FloatingWhatsNew({ whatsNew }: { whatsNew: WhatsNewWidget }) {
  const { openMobile } = useSidebar()
  // Hidden rather than unmounted, so closing the menu does not replay its
  // entrance.
  return (
    <div className={cn('lg:hidden', openMobile && 'hidden')}>
      <WhatsNewWidgetCloseable whatsNew={whatsNew} />
    </div>
  )
}
