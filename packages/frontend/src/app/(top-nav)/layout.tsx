import { Banner } from '../../components/banner'
import { Footer } from '../../components/footer'
import { NavLayout } from '../../components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/" legacyNav topChildren={<Banner />}>
      <div className="min-h-screen pb-10 md:pb-16">{children}</div>
      <Footer />
    </NavLayout>
  )
}
