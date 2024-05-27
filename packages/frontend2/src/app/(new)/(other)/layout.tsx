import { NavLayout } from '~/app/_components/nav/NavLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <NavLayout logoLink="/">{children}</NavLayout>
}
