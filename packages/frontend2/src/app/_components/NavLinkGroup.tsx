export interface NavLinkGroupProps {
  title: string
  children?: React.ReactNode
}

export function NavLinkGroup({ title, children }: NavLinkGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-1 text-slate-600 dark:text-zinc-500 text-[0.8125rem] leading-[0.8125rem] uppercase font-medium xl:sidenav-collapsed:hidden">
        {title}
      </div>
      <div className="h-px w-8 bg-slate-600 dark:bg-zinc-500 hidden xl:sidenav-collapsed:block mt-[12px]" />
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  )
}
