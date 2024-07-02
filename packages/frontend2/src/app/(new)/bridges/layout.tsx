import { Footer } from '~/app/_components/footer'
import { NavLayout } from '~/app/_components/nav/nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/bridges/summary">
      <div className="min-h-screen">{children}</div>
      <Footer />
    </NavLayout>
  )
}
