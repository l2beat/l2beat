import { Footer } from '~/components/footer/Footer'
import { Navbar } from '~/components/navbar/Navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen flex-1">
      <Navbar />
      {children}
      <Footer className="max-w-[1176px] px-6 sm:px-10 md:px-[72px]" />
    </div>
  )
}
