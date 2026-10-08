import { MainNavbar } from './Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNavbar />
      <main>{children}</main>
    </>
  )
}
