import { AppSidebar } from '~/components/AppSidebar'
import { SidebarProvider } from '~/components/core/Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full py-2 pr-2">{children}</main>
    </SidebarProvider>
  )
}
