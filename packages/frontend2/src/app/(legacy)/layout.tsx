import { Footer } from '../_components/Footer'
import { NavLayout } from '../_components/nav/NavLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/" legacyNav>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </NavLayout>
  )
}
