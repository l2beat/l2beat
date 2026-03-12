import { AppSidebar } from '~/components/AppSidebar'
import { SidebarInset } from '~/components/core/Sidebar'
import { cn } from '~/utils/cn'

export function AppLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className={cn('py-2 pr-2', className)}>
        {children}
      </SidebarInset>
    </>
  )
}
