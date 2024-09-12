export interface NavSmallLinkGroupProps {
  children?: React.ReactNode
}

/**
 * Group of small nav links.
 */
export function NavSmallLinkGroup({ children }: NavSmallLinkGroupProps) {
  return (
    <ul className="ml-1 flex flex-col gap-2 xl:sidenav-collapsed:hidden">
      {children}
    </ul>
  )
}
