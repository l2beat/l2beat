import { AppSidebar } from '~/components/AppSidebar'
import { SidebarInset, SidebarTrigger } from '~/components/core/Sidebar'
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
      <SidebarInset
        className={cn(
          'min-h-[calc(100svh-var(--spacing-environment-banner))] py-2 pr-2',
          className,
        )}
      >
        <div className="flex min-h-full flex-col gap-2">
          <div className="flex items-center px-2 md:hidden">
            <SidebarTrigger className="size-8" />
          </div>
          {children}
        </div>
      </SidebarInset>
    </>
  )
}
