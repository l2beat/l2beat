'use client'
import Image from 'next/image'
import { type ReactNode } from 'react'
import { IndexCell } from '~/components/table/cells/index-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
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
import { cn } from '~/utils/cn'

interface Props {
  items: DaRiskEntry[]
}

export function DaRiskTableNew({ items }: Props) {
  return (
    <Table>
      <TableHeader className="border-b border-surface-tertiary">
        <TableHeaderRow>
          <AutoHead
            colSpan={3}
            className="px-4
md:px-4"
          />
          <AutoHead
            colSpan={2}
            className="rounded-t-lg bg-n-gray-200 px-4 py-0 font-bold text-black dark:bg-zinc-700 dark:text-white md:pt-4"
          >
            DA LAYER RISKS
          </AutoHead>
          <AutoHead />
          <AutoHead
            colSpan={3}
            className="rounded-t-lg bg-n-gray-200 px-4 pb-0 font-bold  text-black dark:bg-zinc-700 dark:text-white md:pt-4"
          >
            BRIDGE RISKS
          </AutoHead>
        </TableHeaderRow>
        <TableHeaderRow>
          <AutoHead>#</AutoHead>
          <AutoHead></AutoHead>
          <AutoHead>DA LAYER</AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
            ECONOMIC SECURITY
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700 ">
            FRAUD DETECTION
          </AutoHead>
          <AutoHead className="px-4 ">BRIDGE</AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700 ">
            COMMITTEE SECURITY
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700 ">
            UPGRADEABILITY
          </AutoHead>
          <AutoHead className="bg-n-gray-200 px-4 dark:bg-zinc-700 ">
            RELAYER FAILURE
          </AutoHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {items.map((layer, layerIdx) => (
          <>
            {/* First row with spanning cells */}
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
                <RiskCell risk={layer.risks.economicSecurity} />
              </TableCell>
              <TableCell
                rowSpan={layer.bridges.length}
                className="bg-n-gray-200 px-4 dark:bg-zinc-700"
              >
                <RiskCell risk={layer.risks.fraudDetection} />
              </TableCell>

              {/* First bridge in the same row */}
              <TableCell className="px-4 text-sm font-bold first:px-4">
                {layer.bridges[0]!.name}
              </TableCell>
              <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                <RiskCell risk={layer.bridges[0]!.risks.committeeSecurity} />
              </TableCell>
              <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                <RiskCell risk={layer.bridges[0]!.risks.upgradeability} />
              </TableCell>
              <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                <RiskCell risk={layer.bridges[0]!.risks.relayerFailure} />
              </TableCell>
            </TableRow>

            {/* Additional rows for remaining bridges */}
            {layer.bridges.slice(1).map((bridge, bridgeIdx) => (
              <TableRow
                key={`bridge-${layerIdx}-${bridgeIdx}`}
                className="border-b border-surface-tertiary dark:border-surface-tertiary"
              >
                <TableCell className="px-4 text-sm font-bold first:px-4">
                  {bridge.name}
                </TableCell>
                <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                  <RiskCell risk={bridge.risks.committeeSecurity} />
                </TableCell>
                <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                  <RiskCell risk={bridge.risks.upgradeability} />
                </TableCell>
                <TableCell className="bg-n-gray-200 px-4 dark:bg-zinc-700">
                  <RiskCell risk={bridge.risks.relayerFailure} />
                </TableCell>
              </TableRow>
            ))}
          </>
        ))}
        <TableRow className="border-b border-surface-tertiary dark:border-surface-tertiary">
          <TableCell colSpan={3} className="h-4 md:h-4" />
          <TableCell
            colSpan={2}
            className="h-4 rounded-b-lg bg-n-gray-200 px-4 text-black dark:bg-zinc-700 md:h-4"
          />
          <TableCell className="h-4 md:h-4" />
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
