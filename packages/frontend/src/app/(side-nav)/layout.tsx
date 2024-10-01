import { About } from '~/components/about'
import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'
import { OtherSites } from '~/components/other-sites'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<Banner />}
      className="v2"
    >
      <div className="mx-auto mb-20 min-h-screen max-w-[1648px] md:px-6 xl:pl-0 xl:pr-6 2xl:pr-0">
        {children}
        <OtherSites />
        <About />
      </div>
      <Footer />
    </NavLayout>
  )
}
