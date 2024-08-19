import { About } from '~/app/_components/about'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { Footer } from '~/app/_components/footer'
import { NavLayout } from '~/app/_components/nav/nav-layout'
import { OtherSites } from '~/app/_components/other-sites'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/scaling/summary">
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
