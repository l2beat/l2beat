import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  AuditReading,
  AuditsContractEntry,
  AuditsProjectScope,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { ContractCoverageList } from './ContractCoverageList'

export const READING_META: Record<
  AuditReading,
  { label: string; description: string }
> = {
  strict: {
    label: 'Strict',
    description:
      'Only code an audit report explicitly includes counts as audited. Code a report never names looks unaudited, even when the audited contracts depend on it.',
  },
  relaxed: {
    label: 'Relaxed',
    description:
      'Code an audit report never names also counts as audited when the code it does name depends on it: base contracts, libraries, called contracts and external dependencies at the audited version. Such units are marked "implied".',
  },
}

/**
 * The deployed contracts against audited code. Projects with a scope show it
 * under one of two readings of the audit reports, strict by default.
 */
export function AuditsDiffSection({
  slug,
  contracts,
  scope,
}: {
  slug: string
  contracts: AuditsContractEntry[]
  scope?: AuditsProjectScope
}) {
  const [reading, setReading] = useState<AuditReading>('strict')
  if (!scope) {
    return <ContractCoverageList slug={slug} contracts={contracts} />
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-secondary">Reading of the audit reports</span>
        <div className="inline-flex rounded-md border border-divider p-0.5">
          {(['strict', 'relaxed'] as const).map((option) => (
            <Tooltip key={option}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-pressed={reading === option}
                  onClick={() => setReading(option)}
                  className={cn(
                    'rounded px-2.5 py-0.5 font-medium',
                    reading === option
                      ? 'bg-brand text-white'
                      : 'text-secondary hover:text-primary',
                  )}
                >
                  {READING_META[option].label}
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[340px]">
                {READING_META[option].description}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <span className="text-secondary">
          {READING_META[reading].description}
        </span>
      </div>
      <ContractCoverageList
        slug={slug}
        contracts={scope[reading].contractEntries}
        reading={reading}
      />
    </div>
  )
}
