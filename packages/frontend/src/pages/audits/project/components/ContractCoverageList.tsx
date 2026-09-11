import { formatInteger } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  AuditsContractEntry,
  AuditUnitStatus,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { UnitStatusBar } from '../../components/AuditCoverageBar'
import {
  AUDIT_STATUS_META,
  AUDIT_STATUS_ORDER,
  hasUnresolvedMajorFinding,
  MAJOR_FINDING_DESCRIPTION,
  totalUnits,
} from '../../components/auditStatus'
import { UnitRow } from './UnitRow'

interface Props {
  slug: string
  contracts: AuditsContractEntry[]
}

/**
 * One collapsible row per deployed contract, expanding to its source files
 * and their units. Filtering by status and unit name is local state.
 */
/** A zk entry can share the address of its deployed verifier contract. */
function rowKey(contract: AuditsContractEntry): string {
  return contract.zk
    ? `zk:${contract.name}`
    : `${contract.chain}:${contract.address}`
}

export function ContractCoverageList({ slug, contracts }: Props) {
  const [statuses, setStatuses] = useState<Set<AuditUnitStatus>>(
    () => new Set(AUDIT_STATUS_ORDER),
  )
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return contracts.map((contract) => ({
      contract,
      files: contract.files.map((file) => ({
        file,
        units: file.units.filter(
          (u) =>
            statuses.has(u.status) &&
            (needle === '' ||
              u.name.toLowerCase().includes(needle) ||
              u.match?.auditedName.toLowerCase().includes(needle)),
        ),
      })),
    }))
  }, [contracts, statuses, search])

  function toggleStatus(status: AuditUnitStatus) {
    setStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  function toggleOpen(address: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(address)) next.delete(address)
      else next.add(address)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-lg">Deployed contracts</h2>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="text-secondary hover:text-primary"
            onClick={() => setOpen(new Set(contracts.map(rowKey)))}
          >
            Expand all
          </button>
          <button
            type="button"
            className="text-secondary hover:text-primary"
            onClick={() => setOpen(new Set())}
          >
            Collapse all
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {AUDIT_STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={statuses.has(status)}
            onClick={() => toggleStatus(status)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border border-divider px-2.5 py-1 text-xs',
              statuses.has(status)
                ? 'bg-surface-secondary text-primary'
                : 'text-secondary opacity-60',
            )}
          >
            <span
              className={cn('size-2 rounded-sm', AUDIT_STATUS_META[status].bg)}
            />
            {AUDIT_STATUS_META[status].label}
          </button>
        ))}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter units by name"
          className="ml-auto min-w-[200px] rounded-md border border-divider bg-surface-secondary px-2 py-1 text-xs"
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map(({ contract, files }) => {
          const key = rowKey(contract)
          const isOpen = open.has(key)
          const visibleUnits = files.reduce((n, f) => n + f.units.length, 0)
          const majorFindingUnits = contract.files
            .flatMap((f) => f.units)
            .filter(hasUnresolvedMajorFinding).length
          return (
            <div
              key={key}
              className={cn(
                'rounded-lg border',
                majorFindingUnits > 0 ? 'border-negative' : 'border-divider',
              )}
            >
              <button
                type="button"
                onClick={() => toggleOpen(key)}
                className="grid w-full grid-cols-[16px_minmax(0,1fr)] items-center gap-3 px-3 py-2 text-left hover:bg-surface-secondary md:grid-cols-[16px_minmax(200px,1.5fr)_minmax(0,1fr)_160px]"
              >
                <ChevronIcon
                  className={cn(
                    'size-3 text-secondary transition-transform',
                    isOpen ? 'rotate-0' : '-rotate-90',
                  )}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold text-sm">
                      {contract.name}
                    </span>
                    {contract.zk && (
                      <span className="rounded border border-chart-stacked-blue px-1 font-medium text-[10px] text-chart-stacked-blue uppercase">
                        zk {contract.zk.type}
                      </span>
                    )}
                    {contract.files.some((f) => f.role === 'proxy') && (
                      <span className="rounded border border-divider px-1 font-medium text-[10px] text-secondary uppercase">
                        proxy
                      </span>
                    )}
                    {contract.noSource && (
                      <span className="rounded border border-negative px-1 font-medium text-[10px] text-negative uppercase">
                        no source
                      </span>
                    )}
                    {majorFindingUnits > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="rounded border border-negative bg-negative/10 px-1 font-medium text-[10px] text-negative uppercase">
                            major finding
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[360px]">
                          <div className="mb-1 font-medium">
                            {majorFindingUnits}{' '}
                            {majorFindingUnits === 1 ? 'unit' : 'units'} of this
                            contract {majorFindingUnits === 1 ? 'has' : 'have'}{' '}
                            an unresolved major finding.
                          </div>
                          {MAJOR_FINDING_DESCRIPTION}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="truncate font-mono text-secondary text-xs">
                    {contract.address
                      ? `${contract.chain}:${contract.address}`
                      : contract.zk?.link}
                    {contract.template && (
                      <span className="ml-2 font-sans">
                        template {contract.template}
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-md:hidden">
                  {!contract.noSource && (
                    <UnitStatusBar counts={contract.coverage.units} />
                  )}
                </div>
                <div className="text-right text-xs max-md:hidden">
                  {contract.noSource ? (
                    <span className="text-secondary">unverified bytecode</span>
                  ) : (
                    <>
                      <span className="font-medium">
                        {formatInteger(totalUnits(contract.coverage.units))}{' '}
                        units
                      </span>
                      <span className="ml-2 text-secondary">
                        {formatInteger(contract.coverage.lines.covered)}/
                        {formatInteger(contract.coverage.lines.total)} lines
                      </span>
                    </>
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="border-divider border-t">
                  <div className="flex flex-wrap items-baseline gap-x-3 px-3 py-1.5 text-xs">
                    {contract.address && (
                      <>
                        <span className="text-secondary">Address</span>
                        <span className="select-all font-mono">
                          {contract.chain}:{contract.address}
                        </span>
                      </>
                    )}
                    {contract.zk && (
                      <span className="text-secondary">
                        sources{' '}
                        <a
                          href={contract.zk.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono hover:text-primary hover:underline"
                        >
                          {contract.zk.link.replace('https://github.com/', '')}
                        </a>{' '}
                        @{' '}
                        <span className="font-mono">
                          {contract.zk.commit.slice(0, 8)}
                        </span>
                      </span>
                    )}
                    {contract.template && (
                      <span className="text-secondary">
                        template{' '}
                        <span className="font-mono">{contract.template}</span>
                      </span>
                    )}
                  </div>
                  {visibleUnits === 0 && (
                    <p className="px-3 py-2 text-secondary text-xs">
                      {contract.noSource
                        ? contract.zk
                          ? 'No source files were fetched for this entry.'
                          : 'No verified source for this contract.'
                        : 'No units match the current filter.'}
                    </p>
                  )}
                  {files.map(({ file, units }) =>
                    units.length === 0 ? null : (
                      <div key={file.path}>
                        <div className="flex items-center gap-2 bg-surface-secondary px-3 py-1 font-mono text-secondary text-xs">
                          {file.path}
                          {file.role !== 'implementation' && (
                            <span className="rounded border border-divider px-1 font-medium font-sans text-[10px] uppercase">
                              {file.role}
                            </span>
                          )}
                          <span className="ml-auto font-sans">
                            {formatInteger(file.lines)} lines
                          </span>
                        </div>
                        {units.map((unit) => (
                          <UnitRow key={unit.id} slug={slug} unit={unit} />
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
