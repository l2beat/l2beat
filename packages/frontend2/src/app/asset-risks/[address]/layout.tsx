import { Navbar } from './_components/navbar/navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen flex-1 bg-[#E6E7EC]">
      <Navbar />
      {children}
    </div>
  )
}
