import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { type ReactNode, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import type { ApiProjectChain } from '../../../api/types'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import {
  type ModuleCandidate,
  type ModuleUsage,
  type OverlapAddress,
  type ProjectOverlap,
  type ProjectUsageSummary,
  summarizeProjectUsage,
} from './addressUsage'
import { ProjectLink } from './ProjectLink'
import { useAddressUsage } from './useAddressUsage'

export function UsagePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery(useProjectQueryOptions(project))

  if (response.isPending) {
    return <LoadingState />
  }
  if (response.isError) {
    return <ErrorState />
  }
  return <ProjectUsage project={project} chains={response.data.entries} />
}

function ProjectUsage(props: { project: string; chains: ApiProjectChain[] }) {
  const usage = useAddressUsage()
  const summary = useMemo(
    () =>
      usage.data === undefined
        ? undefined
        : summarizeProjectUsage(usage.data, props.project, props.chains),
    [usage.data, props.project, props.chains],
  )

  if (usage.isError) {
    return <ErrorState />
  }
  if (summary === undefined) {
    return <LoadingState />
  }
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-4 text-sm">
      <Totals summary={summary} />
      <Section title={`Shared modules (${summary.modules.length})`}>
        {summary.modules.length === 0 && (
          <Empty>{props.project} uses no shared module.</Empty>
        )}
        {summary.modules.map((module) => (
          <ModuleRow key={module.module} module={module} />
        ))}
      </Section>
      <Section
        title={`Shared module candidates (${summary.candidates.length})`}
      >
        {summary.candidates.length === 0 && (
          <Empty>No two addresses are used by the same other projects.</Empty>
        )}
        {summary.candidates.map((candidate) => (
          <CandidateRow
            key={candidate.projects.join(',')}
            candidate={candidate}
          />
        ))}
      </Section>
      <Section title={`Also discovered by (${summary.overlaps.length})`}>
        {summary.overlaps.length === 0 && (
          <Empty>No other project discovers an address of this one.</Empty>
        )}
        {summary.overlaps.map((overlap) => (
          <OverlapRow key={overlap.project} overlap={overlap} />
        ))}
      </Section>
    </div>
  )
}

function Totals(props: { summary: ProjectUsageSummary }) {
  const { summary } = props
  return (
    <div className="flex gap-4 border-coffee-600 border-b px-4 py-2 text-xs">
      <Total label="addresses" value={summary.addressCount} />
      <Total
        label="standalone"
        value={summary.standaloneCount}
        className="text-coffee-200"
      />
      <Total
        label="also elsewhere"
        value={summary.duplicatedCount}
        className="text-aux-yellow"
      />
      <Total
        label="from shared modules"
        value={summary.moduleAddressCount}
        className="text-aux-orange"
      />
    </div>
  )
}

function Total(props: { label: string; value: number; className?: string }) {
  return (
    <div className="flex flex-col">
      <span className={clsx('font-bold font-mono text-base', props.className)}>
        {props.value}
      </span>
      <span className="text-coffee-400">{props.label}</span>
    </div>
  )
}

function Section(props: { title: string; children: ReactNode }) {
  return (
    <div className="border-coffee-600 border-b py-1">
      <div className="px-2 py-1 font-bold text-coffee-400 text-xs uppercase">
        {props.title}
      </div>
      {props.children}
    </div>
  )
}

function Empty(props: { children: ReactNode }) {
  return <p className="px-4 py-0.5 text-coffee-400 italic">{props.children}</p>
}

function ModuleRow(props: { module: ModuleUsage }) {
  const { module } = props
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-0.5">
      <ProjectLink
        project={module.module}
        className="font-mono text-aux-orange hover:underline"
      >
        {module.module}
      </ProjectLink>
      <span className="text-coffee-400 text-xs">
        {pluralize(module.addressCount, 'address', 'addresses')} here, used by{' '}
        {pluralize(module.consumerCount, 'project', 'projects')}
      </span>
    </div>
  )
}

function CandidateRow(props: { candidate: ModuleCandidate }) {
  const [open, setOpen] = useState(false)
  const { candidate } = props

  return (
    <div>
      <ExpandButton open={open} onClick={() => setOpen((open) => !open)}>
        <span className="min-w-0 truncate">
          {candidate.addresses.map(addressLabel).join(', ')}
        </span>
        <span className="ml-auto whitespace-nowrap text-coffee-400 text-xs">
          {pluralize(candidate.addresses.length, 'address', 'addresses')},{' '}
          {pluralize(candidate.projects.length, 'project', 'projects')}
        </span>
      </ExpandButton>
      {open && (
        <>
          <div className="flex flex-wrap gap-1 py-1 pr-2 pl-9">
            {candidate.projects.map((project) => (
              <ProjectLink
                key={project}
                project={project}
                selectAddress={candidate.addresses[0]?.address}
                className="rounded-sm border border-aux-cyan/60 px-1.5 py-0.5 font-mono text-aux-cyan text-xs hover:underline"
              >
                {project}
              </ProjectLink>
            ))}
          </div>
          <AddressList addresses={candidate.addresses} />
        </>
      )}
    </div>
  )
}

function OverlapRow(props: { overlap: ProjectOverlap }) {
  const [open, setOpen] = useState(false)
  const { overlap } = props

  return (
    <div>
      <div className="flex items-center gap-1 pr-2 hover:bg-aux-brown">
        <ExpandButton open={open} onClick={() => setOpen((open) => !open)}>
          <span className="font-mono">{overlap.project}</span>
          <span className="ml-auto rounded-sm bg-aux-yellow/20 px-1 font-mono text-aux-yellow text-xs">
            {overlap.addresses.length}
          </span>
        </ExpandButton>
        <ProjectLink
          project={overlap.project}
          selectAddress={overlap.addresses[0]?.address}
          className="px-1 text-coffee-400 text-xs hover:text-coffee-200"
        >
          open
        </ProjectLink>
      </div>
      {open && <AddressList addresses={overlap.addresses} />}
    </div>
  )
}

function ExpandButton(props: {
  open: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={props.onClick}
      className="flex w-full min-w-0 flex-1 cursor-pointer items-center gap-1 px-2 py-0.5 text-left hover:bg-aux-brown"
    >
      {props.open ? <IconChevronDown /> : <IconChevronRight />}
      {props.children}
    </button>
  )
}

function AddressList(props: { addresses: OverlapAddress[] }) {
  const select = usePanelStore((state) => state.select)
  const selected = usePanelStore((state) => state.selected)

  return (
    <ol>
      {props.addresses.map((entry) => (
        <li
          key={entry.address}
          onClick={() => select([entry.address])}
          className={clsx(
            'flex cursor-pointer justify-between gap-2 py-0.5 pr-2 pl-9',
            selected.includes(entry.address)
              ? 'bg-autumn-300 text-black'
              : 'hover:bg-aux-brown',
          )}
        >
          <span className="min-w-0 truncate">{entry.name}</span>
          <span className="font-mono text-xs opacity-60">
            {toShortenedAddress(entry.address)}
          </span>
        </li>
      ))}
    </ol>
  )
}

function addressLabel(entry: OverlapAddress): string {
  return entry.name ?? toShortenedAddress(entry.address)
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}
