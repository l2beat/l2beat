import { RecategorisationPreviewBanner } from '~/components/recategorisation-preview/recategorisation-preview-banner'
import { Banner } from '../../components/banner'
import { Footer } from '../../components/footer'
import { NavLayout } from '../../components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/"
      topNavbar
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
