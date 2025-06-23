import { Banner } from '~/components/Banner'
import { Footer } from '~/components/Footer'
import { NavLayout } from '~/components/nav/NavLayout'
import { RecategorisationPreviewBanner } from '~/components/recategorisation-preview/RecategorisationPreviewBanner'
import { RecategorisationUpcomingBanner } from '~/components/recategorisation-preview/RecategorisationUpcomingBanner'

export function TopNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/"
      topNavbar
      topChildren={
        <>
          <Banner />
          <RecategorisationUpcomingBanner />
          <RecategorisationPreviewBanner />
        </>
      }
    >
      <div className="min-h-screen pb-10 md:pb-16">{children}</div>
      <Footer />
    </NavLayout>
  )
}
