import { Navbar } from './_components/navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen flex-1">
      <Navbar />
      {children}
    </div>
  )
}
