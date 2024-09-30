import { About } from '~/components/about'
import { Banner } from '~/components/banner'
import { ContentWrapper } from '~/components/content-wrapper'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'
import { OtherSites } from '~/components/other-sites'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/scaling/summary" topChildren={<Banner />}>
      <div className="min-h-screen">
        <ContentWrapper className="mt-4 md:mt-12">
          <div className="mb-20">
            {children}
            <OtherSites />
            <About />
          </div>
        </ContentWrapper>
      </div>
      <Footer />
    </NavLayout>
  )
}
