import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<Banner />}
      className="v2"
    >
      <div className="mx-auto mb-20 min-h-screen max-w-[1648px] md:px-6 lg:pl-0 lg:pr-6 xl:pr-0">
        {children}
      </div>
      <Footer />
    </NavLayout>
  )
}
