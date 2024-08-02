import { Navbar } from './_components/navbar/navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#E6E7EC]">
      <Navbar />
      {children}
    </div>
  )
}
