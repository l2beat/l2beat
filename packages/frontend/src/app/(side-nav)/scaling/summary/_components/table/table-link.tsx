import { cn } from '~/utils/cn'

export function TableLink({
  href,
  children,
  className,
}: {
  href: string | undefined
  children: React.ReactNode
  className?: string
}) {
  if (href) {
    return (
      <a
        className={cn(
          'relative block w-max',
          'before:absolute before:-inset-x-3 before:-inset-y-2 before:rounded max-md:before:content-none',
          'before:hover:bg-pure-black/5 dark:before:hover:bg-pure-white/20',
          className,
        )}
        href={href}
      >
        {children}
      </a>
    )
  }
  return children
}
