import Link from 'next/link'
import { cn } from '~/utils/cn'

export function DaTableLastSubRowCell({
  href,
  children,
  firstRow,
  lastRow,
}: {
  href: string
  children: React.ReactNode
  firstRow: boolean
  lastRow: boolean
}) {
  return (
    <td
      className={cn(
        'group whitespace-pre bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
        firstRow && 'rounded-tr-xl',
        lastRow && 'rounded-br-xl',
        !lastRow && 'border-b border-b-gray-200 dark:border-b-zinc-700 ',
      )}
    >
      <Link href={href}>
        <div className="flex size-full items-center">{children}</div>
      </Link>
    </td>
  )
}
