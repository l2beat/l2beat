import { Flowbite } from 'flowbite-react'
import { MainNavbar } from './Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Flowbite theme={{ mode: 'dark' }}>
        <MainNavbar />
        <main>{children}</main>
      </Flowbite>
    </>
  )
}
