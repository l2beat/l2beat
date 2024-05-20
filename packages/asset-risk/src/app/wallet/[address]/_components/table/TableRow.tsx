'use client'
import { DOMAttributes, TdHTMLAttributes, useState } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { ArrowIcon } from '~/app/assets/ArrowIcon'
import { cn } from '~/utils/cn'

export function TableRow({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <tr
        className={cn(
          'border-b cursor-pointer border-b-gray-200 dark:border-b-zinc-700',
          'hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]',
        )}
        onClick={() => setIsOpen((s) => !s)}
      >
        {children}
        <Cell className={cn(!isOpen && 'rotate-180')}>
          <ArrowIcon />
        </Cell>
      </tr>
      {isOpen && (
        <tr
          className={cn(
            'cursor-pointer border-b border-b-gray-200 dark:border-b-zinc-700',
            'hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]',
          )}
        >
          <Cell className="col-span-5" colSpan={5}>
            Risks
          </Cell>
        </tr>
      )}
    </>
  )
}

export function Cell({
  children,
  className,
  colSpan,
  onClick,
}: {
  children: React.ReactNode
  className?: ClassNameValue
  colSpan?: TdHTMLAttributes<HTMLTableDataCellElement>['colSpan']
  onClick?: DOMAttributes<HTMLTableDataCellElement>['onClick']
}) {
  return (
    <td
      className={cn('h-16 min-w-max p-2', className)}
      onClick={onClick}
      colSpan={colSpan}
    >
      {children}
    </td>
  )
}
