import { Outlet } from 'react-router-dom'
import { FeedbackButton } from './FeedbackButton'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FeedbackButton />
    </div>
  )
}
