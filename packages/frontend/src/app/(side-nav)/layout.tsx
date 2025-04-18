import { env } from '~/env'
import { SideNavLayout } from './side-nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SideNavLayout
      ecosystemsEnabled={env.NEXT_PUBLIC_ECOSYSTEMS}
      showHiringBadge={env.NEXT_PUBLIC_SHOW_HIRING_BADGE}
    >
      {children}
    </SideNavLayout>
  )
}
