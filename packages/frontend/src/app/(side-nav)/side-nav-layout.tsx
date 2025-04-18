import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'
import { RecategorisationPreviewBanner } from '~/components/recategorisation-preview/recategorisation-preview-banner'

export interface SideNavLayoutProps {
  ecosystemsEnabled: boolean
  showHiringBadge: boolean
}

export function SideNavLayout({
  children,
  ecosystemsEnabled,
  showHiringBadge,
}: SideNavLayoutProps & { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      ecosystemsEnabled={ecosystemsEnabled}
      showHiringBadge={showHiringBadge}
      topChildren={
        <>
          <RecategorisationPreviewBanner className="only:lg:rounded-b-xl only:xl:rounded-br-none" />
          <Banner className="lg:rounded-b-xl xl:rounded-br-none" />
        </>
      }
    >
      <div className="mx-auto min-h-screen max-w-screen-lg md:px-6 lg:pl-0">
        {children}
      </div>
      <Footer
        className="md:px-12 md:pt-8 lg:pl-6 lg:pr-9"
        innerContainerClassName="max-w-[1142px]"
      />
    </NavLayout>
  )
}
