import { NavLayout } from '../_components/nav/NavLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavLayout logoLink="/" legacyNav>
      {children}
    </NavLayout>
  )
}
