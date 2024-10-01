import Link from 'next/link'
import { cn } from '~/utils/cn'

export function DaTableSubRowCell({
  href,
  children,
  lastRow,
}: {
  href: string
  children: React.ReactNode
  className?: string
  lastRow?: boolean
}) {
  return (
    <td
      className={cn(
        'size-full whitespace-pre bg-black/[0.05] pr-3 group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
        !lastRow && 'border-b border-b-gray-200 dark:border-b-zinc-700',
      )}
    >
      <Link href={href}>
        <div className="flex size-full items-center">{children}</div>
      </Link>
    </td>
  )
}
