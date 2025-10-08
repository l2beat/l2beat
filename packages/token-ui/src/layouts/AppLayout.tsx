import { AppSidebar } from '~/components/AppSidebar'
import { SidebarProvider } from '~/components/core/Sidebar'
import { Toaster } from '~/components/core/Sonner'
import { cn } from '~/utils/cn'

export function AppLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <main className={cn('min-h-screen w-full py-2 pr-2', className)}>
        {children}
      </main>
    </SidebarProvider>
  )
}
