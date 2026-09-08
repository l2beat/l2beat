import { formatInteger } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  AuditCoverageNumbers,
  AuditStatusCounts,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import {
  LineCoverageBar,
  LineCoverageTooltipContent,
  UnitStatusBar,
  UnitStatusBarTooltipContent,
} from '../../components/AuditCoverageBar'
import {
  AUDIT_STATUS_META,
  AUDIT_STATUS_ORDER,
  formatShare,
  totalUnits,
} from '../../components/auditStatus'

interface Props {
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  contracts: number
  contractsWithoutSource: number
}

export function AuditCoverageStats({
  coverage,
  uniqueUnits,
  contracts,
  contractsWithoutSource,
}: Props) {
  const total = totalUnits(coverage.units)
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {AUDIT_STATUS_ORDER.map((status) => (
          <Tooltip key={status}>
            <TooltipTrigger asChild>
              <div className="flex flex-col gap-0.5 rounded-lg bg-surface-secondary px-3 py-2">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <span
                    className={cn(
                      'size-2.5 rounded-sm',
                      AUDIT_STATUS_META[status].bg,
                    )}
                  />
                  {AUDIT_STATUS_META[status].label}
                </div>
                <div className="font-bold text-2xl">
                  {formatInteger(coverage.units[status])}
                  <span className="ml-1 font-medium text-secondary text-xs">
                    {formatShare(coverage.units[status], total)}
                  </span>
                </div>
                <div className="text-secondary text-xs">
                  {formatInteger(uniqueUnits[status])} unique
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {AUDIT_STATUS_META[status].description}
            </TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col gap-0.5 rounded-lg bg-surface-secondary px-3 py-2">
              <div className="font-medium text-xs">Lines covered</div>
              <div className="font-bold text-2xl">
                {formatShare(coverage.lines.covered, coverage.lines.total)}
              </div>
              <div className="text-secondary text-xs">
                {formatInteger(coverage.lines.covered)} of{' '}
                {formatInteger(coverage.lines.total)} lines
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <LineCoverageTooltipContent lines={coverage.lines} />
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">
              Units ({formatInteger(total)} in {formatInteger(contracts)}{' '}
              contracts
              {contractsWithoutSource > 0 &&
                `, ${contractsWithoutSource} without source`}
              )
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <UnitStatusBar counts={coverage.units} className="h-3" />
            </TooltipTrigger>
            <TooltipContent>
              <UnitStatusBarTooltipContent counts={coverage.units} />
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">Lines of code</span>
            <span className="text-secondary">
              {formatInteger(coverage.lines.covered)} covered /{' '}
              {formatInteger(coverage.lines.uncovered)} not covered
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <LineCoverageBar lines={coverage.lines} className="h-3" />
            </TooltipTrigger>
            <TooltipContent>
              <LineCoverageTooltipContent lines={coverage.lines} />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
