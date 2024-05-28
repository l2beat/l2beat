import { Footer } from '~/app/_components/Footer'
import { NavLayout } from '~/app/_components/nav/NavLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/bridges">
      <div className="min-h-screen">{children}</div>
      <Footer />
    </NavLayout>
  )
}
