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
      <div className="ml-1 text-[0.9375rem] font-medium uppercase leading-[0.9375rem] tracking-tight text-slate-600 dark:text-gray-50 xl:sidenav-collapsed:hidden">
        {title}
      </div>
      <div className="mt-[14px] hidden h-px w-8 bg-slate-600 dark:bg-gray-50 xl:sidenav-collapsed:block" />
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  )
}
