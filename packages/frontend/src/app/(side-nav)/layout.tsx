import { SideNavLayout } from './side-nav-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SideNavLayout>{children}</SideNavLayout>
}
