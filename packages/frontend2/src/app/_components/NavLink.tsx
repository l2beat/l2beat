import { type ActiveLinkProps, useActiveLink } from '~/utils/active-link'
import { cn } from '~/utils/cn'

export type NavLinkProps = {
  icon: React.FC<React.SVGProps<SVGElement>>
  title: string
} & ActiveLinkProps

export function NavLink({
  icon: Icon,
  title,
  href,
  activeBehavior,
}: NavLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <a href={href}>
      <li
        className={cn(
          'flex items-center gap-[0.625rem] p-1.5 rounded-[0.25rem] hover:bg-[#F1D6FF] dark:hover:bg-[#272A2F] transition-colors',
          'xl:sidenav-collapsed:w-8 xl:sidenav-collapsed:h-8 xl:sidenav-collapsed:p-0 xl:sidenav-collapsed:justify-center ease-out duration-300',
          active && 'bg-[#d3d5d9] dark:bg-[#393C43]',
        )}
      >
        <Icon />
        <span className="font-semibold text-base leading-none xl:sidenav-collapsed:hidden">
          {title}
        </span>
      </li>
    </a>
  )
}
