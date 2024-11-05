import { Flowbite } from 'flowbite-react'
import { MainNavbar } from './navbar'

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
