import { cva } from 'class-variance-authority'
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
        // Home sets its content apart from the nav and the page background.
        // Past 1920px the content stops growing (see contentAreaVariants)
        // and the page's grey shows either side of it. Its hairlines are
        // softer than the rest of the site's.
        home: 'bg-pure-white [--divider:var(--home-divider)] lg:ml-0 min-[1920px]:bg-transparent dark:bg-pure-black dark:min-[1920px]:bg-transparent',
      },
    },
  },
)

const contentAreaVariants = cva('mx-auto flex w-full min-w-0 grow flex-col', {
  variants: {
    variant: {
      default: 'max-w-(--breakpoint-lg) md:px-5 lg:pl-0',
      wide: 'max-w-412 md:px-5 lg:pl-0',
      // Edge to edge, so section hairlines run from the nav to the screen's
      // edge; the page pads its own content with one gutter.
      // A white (black) sheet no wider than it is at 1920px, centred, with a
      // hairline at its sides once the page's grey shows around it.
      home: 'max-w-[1680px] bg-pure-white min-[1920px]:border-divider min-[1920px]:border-x dark:bg-pure-black',
    },
  },
})

const footerVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      wide: 'md:px-12 md:pt-8 lg:pr-9 lg:pl-6',
      // The page's gutter, so the footer starts where the content above does.
      home: 'mx-auto w-full max-w-[1680px] bg-pure-white px-4 py-5 md:px-6 md:py-5 lg:py-5 xl:px-8 2xl:px-10 min-[1920px]:border-divider min-[1920px]:border-x dark:bg-pure-black',
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
    <SidebarProvider>
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
            {/* From lg the nav shows the announcement itself. */}
            {whatsNew && (
              <div className="lg:hidden">
                <WhatsNewWidgetCloseable whatsNew={whatsNew} />
              </div>
            )}
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
