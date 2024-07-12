export interface NavLinkGroupProps {
  title: string
  children?: React.ReactNode
}

/**
 * Group of nav links with a title used in the sidenav.
 */
export function NavLinkGroup({ title, children }: NavLinkGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-1 text-slate-600 dark:text-gray-50 text-[0.9375rem] leading-[0.9375rem] uppercase font-medium xl:sidenav-collapsed:hidden tracking-tight">
        {title}
      </div>
      <div className="h-px w-8 bg-slate-600 dark:bg-gray-50 hidden xl:sidenav-collapsed:block mt-[12px]" />
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  )
}
