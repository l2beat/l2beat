import { cn } from '~/utils/cn'

export function TableCellLink({
  href,
  children,
}: { href: string; children: React.ReactNode }) {
  return (
    <a
      className={cn(
        'relative inline-block w-max',
        'before:absolute before:-inset-x-3 before:-inset-y-2 before:rounded',
        'before:hover:bg-pure-black/5 dark:before:hover:bg-pure-white/20',
      )}
      href={href}
    >
      {children}
    </a>
  )
}
