import { Footer } from '../_components/footer'
import { NavLayout } from '../_components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/" legacyNav>
      <main className="min-h-screen mb-20">{children}</main>
      <Footer />
    </NavLayout>
  )
}
