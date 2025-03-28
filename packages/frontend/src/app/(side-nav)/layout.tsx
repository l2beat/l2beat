import { env } from '~/env'
import { SideNavLayout } from './side-nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  const showHiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE
  return (
    <SideNavLayout showHiringBadge={showHiringBadge}>{children}</SideNavLayout>
  )
}
