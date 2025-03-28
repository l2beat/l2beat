import { RecategorisationPreviewBanner } from '~/components/recategorisation-preview/recategorisation-preview-banner'
import { env } from '~/env'
import { Banner } from '../../components/banner'
import { Footer } from '../../components/footer'
import { NavLayout } from '../../components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  const showHiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE
  return (
    <NavLayout
      logoLink="/"
      topNavbar
      showHiringBadge={showHiringBadge}
      topChildren={
        <>
          <Banner />
          <RecategorisationPreviewBanner />
        </>
      }
    >
      <div className="min-h-screen pb-10 md:pb-16">{children}</div>
      <Footer />
    </NavLayout>
  )
}
