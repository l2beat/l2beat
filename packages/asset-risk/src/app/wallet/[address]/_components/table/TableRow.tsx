'use client'
import { ScalingProjectTechnology } from '@l2beat/config'
import { TdHTMLAttributes, useState } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { ArrowIcon } from '~/app/assets/ArrowIcon'
import { cn } from '~/utils/cn'
import { groupRisks } from '~/utils/groupRisks'
import { CriticalWarning, Warning } from './Warning'

export function TableRow({
  children,
  chain,
}: {
  children: React.ReactNode
  chain: ScalingProjectTechnology | null | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)

  const risks = chain
    ? [
        chain.stateCorrectness,
        chain.newCryptography,
        chain.dataAvailability,
        chain.operator,
        chain.forceTransactions,
        ...chain.exitMechanisms,
        chain.massExit,
        ...(chain.otherConsiderations ?? []),
      ].flatMap((choice) => choice?.risks ?? [])
    : []

  const groupedRisks = groupRisks(risks)

  const criticalWarnings = groupedRisks.flatMap((r) => ({
    name: r.name,
    items: r.items.filter((i) => i.isCritical),
  }))

  const warnings = groupedRisks.flatMap((r) => ({
    name: r.name,
    items: r.items.filter((i) => !i.isCritical),
  }))

  const criticalWarningsCount = criticalWarnings.reduce(
    (acc, r) => acc + r.items.length,
    0,
  )

  const warningsCount = warnings.reduce((acc, r) => acc + r.items.length, 0)

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
        <Cell>
          <div className={cn('flex items-center justify-between gap-3')}>
            <div className="flex items-center gap-3">
              {!!criticalWarningsCount && (
                <CriticalWarning count={criticalWarningsCount} />
              )}
              {!!warningsCount && <Warning count={warningsCount} />}
            </div>
            <div className={cn(!isOpen && 'rotate-180')}>
              <ArrowIcon />
            </div>
          </div>
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
  ...rest
}: {
  children: React.ReactNode
  className?: ClassNameValue
} & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('h-16 min-w-max p-2', className)} {...rest}>
      {children}
    </td>
  )
}
