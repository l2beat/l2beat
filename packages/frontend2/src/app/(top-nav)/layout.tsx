import { Banner } from '../../components/banner'
import { Footer } from '../../components/footer'
import { NavLayout } from '../../components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Banner />
      <NavLayout logoLink="/" legacyNav>
        <div className="min-h-screen pb-20">{children}</div>
        <Footer />
      </NavLayout>
    </>
  )
}
