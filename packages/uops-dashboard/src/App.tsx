import Layout from '@/components/layout'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'

// Every navigation is a full page load, so the path never changes after mount
// and two pages don't justify a router dependency.
const PAGES: Record<string, () => React.ReactNode> = {
  '/': HomePage,
  '/stats': StatsPage,
}

export function App() {
  const Page = PAGES[window.location.pathname] ?? HomePage
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
