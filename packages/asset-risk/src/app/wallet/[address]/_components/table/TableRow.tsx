'use client'
import Image from 'next/image'
import { TdHTMLAttributes, useState } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { formatUnits } from 'viem'
import { ArrowIcon } from '~/app/assets/ArrowIcon'
import { cn } from '~/utils/cn'
import { groupRisks } from '~/utils/groupRisks'
import { StageBadge } from './StageBadge'
import { Token } from './TokensTable'
import { CriticalWarning, Warning } from './Warning'

export function TableRow({
  token,
}: {
  token: Token
}) {
  const [isOpen, setIsOpen] = useState(false)

  const groupedRisks = groupRisks(token.chain.risks ?? [])

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
          'cursor-pointer',
          'hover:bg-black/[0.05] dark:hover:bg-white/[0.1]',
          !isOpen && 'border-b border-b-gray-200 dark:border-b-zinc-700',
          'group-hover/body:bg-black/[0.05]',
        )}
        onClick={() => setIsOpen((s) => !s)}
      >
        <Cell>
          {/* TODO: add dolar value */}
          <div className="text-black dark:text-white font-bold text-lg">
            $0.00
          </div>
          <div className="text-gray-500 dark:text-gray-50 font-medium text-sm">
            {token.balance && formatUnits(token.balance, token.token.decimals)}
            &nbsp;
            {token.token.symbol}
          </div>
        </Cell>
        <Cell className="flex items-center gap-2">
          {token.token.iconUrl && (
            <Image
              src={token.token.iconUrl}
              alt={`${token.token.name} icon`}
              width={32}
              height={32}
              className="size-8"
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-lg">{token.token.name}</span>
            <div className="font-normal flex items-center text-sm text-gray-500 dark:text-gray-50">
              on <span className="font-medium">{token.chain.name}</span>
              &nbsp;
              {token.chain.stage && <StageBadge stage={token.chain.stage} />}
              &nbsp;
              {token.token.bridge && `bridged via ${token.token.bridge}`}
            </div>
          </div>
        </Cell>
        <Cell>TYPE</Cell>
        <Cell>
          <div className={cn('flex items-center justify-between gap-3')}>
            <div className="flex items-center gap-3">
              {!!criticalWarningsCount && (
                <CriticalWarning count={criticalWarningsCount} />
              )}
              {!!warningsCount && <Warning count={warningsCount} />}
            </div>
            <div className={cn(!isOpen && 'rotate-180')}>
              <ArrowIcon className="dark:fill-gray-50" />
            </div>
          </div>
        </Cell>
      </tr>
      {isOpen && (
        <tr
          className={cn(
            'cursor-pointer border-b border-b-gray-200 dark:border-b-zinc-700',
            'hover:bg-black/[0.05] dark:hover:bg-white/[0.1]',
            'group-hover/body:bg-black/[0.05]',
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
    <td
      className={cn(
        'h-16 min-w-max p-2 first:pl-[18px] last:pr-[18px]',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  )
}
