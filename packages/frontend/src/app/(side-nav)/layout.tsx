import { Banner } from '~/components/banner'
import { Footer } from '~/components/footer'
import { NavLayout } from '~/components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout
      logoLink="/scaling/summary"
      topChildren={<Banner className="lg:rounded-b-xl xl:rounded-br-none" />}
      className="sidebar"
    >
      <div className="mx-auto min-h-screen max-w-[1648px] md:px-6 lg:pl-0 lg:pr-3">
        {children}
      </div>
      <Footer />
    </NavLayout>
  )
}
