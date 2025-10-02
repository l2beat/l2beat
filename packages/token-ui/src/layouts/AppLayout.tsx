import { AppSidebar } from '~/components/AppSidebar'
import { SidebarProvider } from '~/components/core/Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="py-2">{children}</main>
    </SidebarProvider>
  )
}
