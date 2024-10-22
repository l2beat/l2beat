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
import { kindToType } from '~/server/features/data-availability/utils/kind-to-layer-type'
import { cn } from '~/utils/cn'

interface Props {
  items: DaRiskEntry[]
  excludeBridge?: boolean
}

export function DaRiskTable({ items, excludeBridge = false }: Props) {
  return (
    <Table>
      <TableHeader className="border-b border-surface-tertiary">
        <TableHeaderRow>
          <FlexHead colSpan={3} className="px-4 md:px-4" />
          <RiskHeaderCell colSpan={2}>DA LAYER RISKS</RiskHeaderCell>
          {excludeBridge ? <FlexHead className="w-[40px]" /> : <FlexHead />}
          <RiskHeaderCell colSpan={3}>BRIDGE RISKS</RiskHeaderCell>
        </TableHeaderRow>
        <TableHeaderRow>
          <FlexHead>#</FlexHead>
          <FlexHead />
          <FlexHead>DA LAYER</FlexHead>
          <RiskSubHeaderCell>ECONOMIC SECURITY</RiskSubHeaderCell>
          <RiskSubHeaderCell>FRAUD DETECTION</RiskSubHeaderCell>
          {excludeBridge ? (
            <FlexHead className="w-[40px]" />
          ) : (
            <FlexHead className="px-4">BRIDGE</FlexHead>
          )}
          <RiskSubHeaderCell>COMMITTEE SECURITY</RiskSubHeaderCell>
          <RiskSubHeaderCell>UPGRADEABILITY</RiskSubHeaderCell>
          <RiskSubHeaderCell>RELAYER FAILURE</RiskSubHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {items.map((layer, layerIdx) => (
          <LayerRows
            key={`layer-${layerIdx}`}
            layer={layer}
            layerIdx={layerIdx}
            excludeBridge={excludeBridge}
          />
        ))}
        <FooterRow excludeBridge={excludeBridge} />
      </TableBody>
    </Table>
  )
}

function LayerRows({
  layer,
  layerIdx,
  excludeBridge,
}: {
  layer: DaRiskEntry
  layerIdx: number
  excludeBridge: boolean
}) {
  return (
    <>
      <TableRow className="border-b border-surface-tertiary dark:border-surface-tertiary">
        <TableCell rowSpan={layer.bridges.length}>
          <IndexCell>{layerIdx + 1}</IndexCell>
        </TableCell>
        <TableCell rowSpan={layer.bridges.length} className="pr-2 md:pr-2">
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
            <span className="text-base font-bold leading-5">{layer.name}</span>
            <span className="text-[13px] font-medium leading-none text-gray-500">
              {kindToType(layer.kind)}
            </span>
          </div>
        </TableCell>
        <RiskDataCell rowSpan={layer.bridges.length}>
          <RiskCell risk={layer.risks.economicSecurity} />
        </RiskDataCell>
        <RiskDataCell rowSpan={layer.bridges.length}>
          <RiskCell risk={layer.risks.fraudDetection} />
        </RiskDataCell>
        <BridgeCell
          excludeBridge={excludeBridge}
          bridgeName={layer.bridges[0]!.name}
        />
        <BridgeRiskCells bridge={layer.bridges[0]!} />
      </TableRow>
      {layer.bridges.slice(1).map((bridge, bridgeIdx) => (
        <TableRow
          key={`bridge-${layerIdx}-${bridgeIdx}`}
          className="border-b border-surface-tertiary dark:border-surface-tertiary"
        >
          <BridgeCell excludeBridge={excludeBridge} bridgeName={bridge.name} />
          <BridgeRiskCells bridge={bridge} />
        </TableRow>
      ))}
    </>
  )
}

function BridgeCell({
  excludeBridge,
  bridgeName,
}: {
  excludeBridge: boolean
  bridgeName: string
}) {
  return excludeBridge ? (
    <TableCell className="w-[40px]" />
  ) : (
    <TableCell className="px-4 text-sm font-bold first:px-4">
      {bridgeName}
    </TableCell>
  )
}

function BridgeRiskCells({
  bridge,
}: { bridge: DaRiskEntry['bridges'][number] }) {
  return (
    <>
      <RiskDataCell>
        <RiskCell risk={bridge.risks.committeeSecurity} />
      </RiskDataCell>
      <RiskDataCell>
        <RiskCell risk={bridge.risks.upgradeability} />
      </RiskDataCell>
      <RiskDataCell>
        <RiskCell risk={bridge.risks.relayerFailure} />
      </RiskDataCell>
    </>
  )
}

function FooterRow({ excludeBridge }: { excludeBridge: boolean }) {
  return (
    <TableRow className="border-b border-surface-tertiary dark:border-surface-tertiary">
      <TableCell colSpan={3} className="h-4 md:h-4" />
      <TableCell
        colSpan={2}
        className="h-4 rounded-b-lg bg-n-gray-200 px-4 text-black dark:bg-zinc-700 md:h-4"
      />
      {excludeBridge ? (
        <TableCell className="h-4 w-[40px]" />
      ) : (
        <TableCell className="h-4 md:h-4" />
      )}
      <TableCell
        colSpan={3}
        className="h-4 rounded-b-lg bg-n-gray-200 px-4 text-black dark:bg-zinc-700 md:h-4"
      />
    </TableRow>
  )
}

function RiskHeaderCell({
  children,
  colSpan,
}: {
  children: ReactNode
  colSpan: number
}) {
  return (
    <FlexHead
      colSpan={colSpan}
      className="rounded-t-lg bg-n-gray-200 px-4 py-0 font-bold text-black dark:bg-zinc-700 dark:text-white md:pt-4"
    >
      {children}
    </FlexHead>
  )
}

function RiskSubHeaderCell({ children }: { children: ReactNode }) {
  return (
    <FlexHead className="bg-n-gray-200 px-4 dark:bg-zinc-700">
      {children}
    </FlexHead>
  )
}

function RiskDataCell({
  children,
  rowSpan,
}: {
  children: ReactNode
  rowSpan?: number
}) {
  return (
    <TableCell
      rowSpan={rowSpan}
      className="bg-n-gray-200 px-4 dark:bg-zinc-700"
    >
      {children}
    </TableCell>
  )
}

function FlexHead({
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
