'use client'
import Image from 'next/image'
import { type ReactNode } from 'react'
import { IndexCell } from '~/components/table/cells/index-cell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/table'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaEconomicSecurityCell } from './da-economic-security-cell'
import { ProjectsUsedIn } from './projects-used-in'

interface Props {
  items: DaSummaryEntry[]
  excludeBridge?: boolean // Control to exclude the bridge name column
}

export function DaSummaryTable({ items, excludeBridge = false }: Props) {
  console.log(items)
  return (
    <Table>
      <TableHeader className="border-b border-surface-tertiary">
        <TableHeaderRow>
          <AutoHead colSpan={3} className="px-4 md:px-4" />
          <AutoHead
            colSpan={3}
            className="rounded-t-lg bg-n-gray-200 px-4 py-0 font-bold text-black dark:bg-zinc-700 dark:text-white md:pt-4"
          >
            DA LAYER
          </AutoHead>
          {excludeBridge ? <AutoHead className="w-[40px]" /> : <AutoHead />}{' '}
          {/* Spacer Column */}
          <AutoHead
            colSpan={3}
            className="rounded-t-lg bg-n-gray-200 px-4 pb-0 font-bold text-black dark:bg-zinc-700 dark:text-white md:pt-4"
          >
            DA BRIDGE
          </AutoHead>
        </TableHeaderRow>
        <TableHeaderRow>
          <AutoHead>#</AutoHead>
          <AutoHead></AutoHead>
          <AutoHead>DA LAYER</AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
            DA RISKS
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4  dark:bg-zinc-700">
            TVS
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 text-right dark:bg-zinc-700">
            SLASHABLE
            <br />
            STAKE
          </AutoHead>
          <AutoHead className="px-4">BRIDGE</AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
            BRIDGE RISKS
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
            VALUE SECURED
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
            USED BY
          </AutoHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {items.map((layer, layerIdx) => (
          <>
            <TableRow
              key={`layer-${layerIdx}`}
              className="border-b border-surface-tertiary dark:border-surface-tertiary"
            >
              <TableCell rowSpan={layer.bridges.length}>
                <IndexCell>{layerIdx + 1}</IndexCell>
              </TableCell>
              <TableCell
                rowSpan={layer.bridges.length}
                className="pr-2 md:pr-2"
              >
                <Image
                  className="min-h-[20px] min-w-[20px]"
                  src={`/icons/${layer.slug}.png`}
                  width={20}
                  height={20}
                  alt={`${layer.name} logo`}
                />
              </TableCell>
              <TableCell rowSpan={layer.bridges.length}>
                <div className="flex flex-col gap-0">
                  <span className="text-base font-bold leading-5">
                    {layer.name}
                  </span>
                  <span className="text-[13px] font-medium leading-none text-gray-500">
                    {toDisplayName(layer)}
                  </span>
                </div>
              </TableCell>
              <TableCell
                rowSpan={layer.bridges.length}
                className="bg-n-gray-200 px-4 dark:bg-zinc-700"
              >
                RISKS HERE
              </TableCell>
              <TableCell
                rowSpan={layer.bridges.length}
                className="bg-n-gray-200 px-4 text-right dark:bg-zinc-700"
              >
                {formatCurrency(layer.tvs, 'usd')}
              </TableCell>

              <TableCell
                rowSpan={layer.bridges.length}
                className="bg-n-gray-200 px-4 text-sm font-bold first:px-4 dark:bg-zinc-700"
              >
                <DaEconomicSecurityCell value={layer.economicSecurity} />
              </TableCell>
              <TableCell className="px-4">{layer.bridges[0]!.name}</TableCell>
              <TableCell className="px-4">RISKS HERE</TableCell>
              <TableCell className="text-right">
                {formatCurrency(layer.bridges[0]!.tvs, 'usd')}
              </TableCell>
              <TableCell className="px-4">
                <ProjectsUsedIn usedIn={layer.bridges[0]!.usedIn} />
              </TableCell>
            </TableRow>

            {layer.bridges.slice(1).map((bridge, bridgeIdx) => (
              <TableRow
                key={`bridge-${layerIdx}-${bridgeIdx}`}
                className="border-b border-surface-tertiary dark:border-surface-tertiary"
              >
                <TableCell className="px-4">{bridge.name}</TableCell>
                <TableCell className="px-4">RISKS HERE</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bridge.tvs, 'usd')}
                </TableCell>
                <TableCell className="px-4">
                  <ProjectsUsedIn usedIn={bridge.usedIn} />
                </TableCell>
              </TableRow>
            ))}
          </>
        ))}
        <TableRow className="border-b border-surface-tertiary dark:border-surface-tertiary">
          <TableCell colSpan={3} className="h-4 md:h-4" />
          <TableCell
            colSpan={3}
            className="h-4 rounded-b-lg bg-n-gray-200 px-4 text-black dark:bg-zinc-700 md:h-4"
          />
          {excludeBridge ? (
            <TableCell className="h-4 w-[40px]" />
          ) : (
            <TableCell className="h-4 md:h-4" />
          )}{' '}
          {/* Spacer or Bridge */}
          <TableCell
            colSpan={3}
            className="h-4 rounded-b-lg bg-n-gray-200 px-4 text-black dark:bg-zinc-700 md:h-4"
          />
        </TableRow>
      </TableBody>
    </Table>
  )
}

function toDisplayName(entry: DaRiskEntry) {
  return entry.kind === 'PublicBlockchain' ? 'Public Blockchain' : 'DA Service'
}

function AutoHead({
  children,
  className,
  ...rest
}: { children?: ReactNode } & React.ThHTMLAttributes<HTMLTableCellElement> & {
    href?: string
    align?: 'right' | 'center'
  }) {
  return (
    <TableHead {...rest} className={cn('h-auto md:h-auto', className)}>
      {children}
    </TableHead>
  )
}
