import { NavWrapper } from '../_components/NavWrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <NavWrapper>{children}</NavWrapper>
}
