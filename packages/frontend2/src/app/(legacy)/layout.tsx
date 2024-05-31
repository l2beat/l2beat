import { Footer } from '../_components/footer'
import { NavLayout } from '../_components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/" legacyNav>
      <div className="min-h-screen pb-20">{children}</div>
      <Footer />
    </NavLayout>
  )
}
