import type { ReactNode } from 'react'
import { Logo } from '~/components/Logo'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'

/**
 * The set the mandate and the rename pages share: an opening beside the heart
 * on the page's own ground, then white sheets, all on one inset and type scale.
 */
export function DeclarationLayout({
  children,
  ...props
}: AppLayoutProps & { children: ReactNode }) {
  return (
    <AppLayout {...props}>
      {/* Home's colours: ink text, white sheets and pink links. */}
      <div className="home-theme contents">
        <SideNavLayout childrenWrapperClassName="max-md:bg-surface-primary">
          <main className="flex flex-col gap-4 max-md:gap-0">{children}</main>
        </SideNavLayout>
      </div>
    </AppLayout>
  )
}

/**
 * On the page's own ground, no card: the one block not on a sheet. Short
 * enough that the first sheet starts on a laptop's first screen. The children
 * take the room beside the heart, so give them `flex-1`.
 */
export function DeclarationHero({ children }: { children: ReactNode }) {
  return (
    <header
      className={cn(
        DECLARATION_INSET,
        'flex items-center gap-6 pt-8 pb-6 max-sm:flex-col-reverse max-sm:items-start sm:justify-between sm:gap-10 md:pt-12 md:pb-12 lg:pt-14',
      )}
    >
      {children}
      <Logo
        small
        animated={false}
        className="mt-0 h-14 w-auto shrink-0 sm:h-32 lg:h-44 xl:h-48"
      />
    </header>
  )
}

// One inset for every block, so the opening and every sheet start on the
// same edge.
export const DECLARATION_INSET = 'px-5 md:px-12 lg:px-16'
export const DECLARATION_SHEET = cn(DECLARATION_INSET, 'py-12 md:py-16')
// Inter Bold at −3%, the brand's headline setting.
export const DECLARATION_DISPLAY = 'font-inter font-bold tracking-[-0.03em]'
// About 60 characters a line at every width, the sheet's columns included.
export const DECLARATION_BODY =
  'max-w-[36rem] text-pretty text-[18px] leading-[1.65] md:text-[20px] md:leading-[1.6]'
// One step below the opening's h1.
export const DECLARATION_STATEMENT = cn(
  DECLARATION_DISPLAY,
  'text-[28px] leading-[1.1] md:text-[36px] lg:text-[40px] xl:text-[44px]',
)
