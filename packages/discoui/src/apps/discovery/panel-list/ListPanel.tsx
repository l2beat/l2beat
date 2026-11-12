import { useQuery } from '@tanstack/react-query'
import {
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link, useParams } from 'react-router'
import type { ApiAddressEntry, ApiProjectChain } from '../../../api/types'
import { AddressIcon } from '../../../components/AddressIcon'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconEyeClosed } from '../../../icons/IconEyeClosed'
import { IconUnlinked } from '../../../icons/IconUnliked'
import { cn } from '../../../utils/cn'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { useStore as useNodesStore } from '../panel-nodes/store/store'
import { getGraphProjection } from '../panel-nodes/store/utils/graphProjection'
import { useGlobalSettingsStore } from '../store/global-settings-store'
import { usePanelStore } from '../store/panel-store'
import { UsageBadge } from '../usage/UsageBadge'
import { getAdjacentAddress, type ListDirection } from './getAdjacentAddress'
import { getDuplicatedNames } from './getDuplicatedNames'

export function ListPanel() {
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
  return (
    <div className="relative h-full w-full">
      <div
        tabIndex={0}
        onKeyDown={selectWithArrows}
        className="peer h-full w-full overflow-x-hidden outline-hidden"
      >
        <ol>
          {response.data.entries.flatMap((entry, i) =>
            Object.entries(entry.blockNumbers).map(([chain, blockNumber]) => (
              <ChainSection
                key={`${entry.project}-${i}-${chain}`}
                entry={entry}
                chain={chain}
                blockNumber={blockNumber}
                openedProject={project}
              />
            )),
          )}
        </ol>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 hidden ring-1 ring-autumn-300 ring-inset peer-focus-visible:block" />
    </div>
  )
}

function selectWithArrows(event: KeyboardEvent<HTMLElement>) {
  const direction = toListDirection(event)
  if (direction === undefined) {
    return
  }
  event.preventDefault()
  const elements = [
    ...event.currentTarget.querySelectorAll<HTMLElement>('[data-address]'),
  ]
  const addresses = elements.map((element) => element.dataset.address ?? '')
  const { selected, select } = usePanelStore.getState()
  const target = getAdjacentAddress(addresses, selected, direction)
  if (target === undefined) {
    return
  }
  select([target])
  elements[addresses.indexOf(target)]?.scrollIntoView({ block: 'nearest' })
}

function toListDirection(event: KeyboardEvent): ListDirection | undefined {
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
    return undefined
  }
  if (event.key === 'ArrowDown') {
    return 'next'
  }
  if (event.key === 'ArrowUp') {
    return 'previous'
  }
  return undefined
}

const CHAIN_HEADER_HEIGHT_CLASS = 'h-6'
const GROUP_HEADER_STICKY_CLASS = 'top-6'
const ROW_SCROLL_MARGIN_CLASS = 'scroll-mt-[46px]'

function ChainSection(props: {
  entry: ApiProjectChain
  chain: string
  blockNumber: number
  openedProject: string
}) {
  const [open, setOpen] = useState(true)
  const onFocus = useCallback(() => setOpen(true), [])
  const { entry, chain } = props
  const groups = useMemo(
    () => [
      { title: 'Initial', entries: entry.initialContracts, startClosed: false },
      {
        title: 'Discovered',
        entries: entry.discoveredContracts,
        startClosed: false,
      },
      { title: 'EOAs', entries: entry.eoas, startClosed: true },
    ],
    [entry],
  )
  const duplicatedNames = useMemo(
    () =>
      getDuplicatedNames(
        groups
          .flatMap((group) => group.entries)
          .filter((address) => address.chain === chain),
      ),
    [groups, chain],
  )

  return (
    <li>
      <ChainHeader
        project={entry.project}
        chain={chain}
        blockNumber={props.blockNumber}
        open={open}
        openedProject={props.openedProject}
        onToggle={() => setOpen((open) => !open)}
      />
      {open &&
        groups.map((group) => (
          <AddressGroup
            key={group.title}
            title={group.title}
            startClosed={group.startClosed}
            onFocus={onFocus}
            entries={group.entries}
            chain={chain}
            duplicatedNames={duplicatedNames}
            openedProject={props.openedProject}
            sourceProject={entry.project}
          />
        ))}
    </li>
  )
}

function ChainHeader(props: {
  project: string
  chain: string
  blockNumber: number
  open: boolean
  openedProject: string
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        'group sticky top-0 z-20 flex items-center gap-2 border-coffee-700 border-b bg-coffee-800 pr-2 pl-1 hover:bg-coffee-700',
        CHAIN_HEADER_HEIGHT_CLASS,
      )}
    >
      <button
        onClick={props.onToggle}
        title={`${props.project} on ${props.chain}`}
        className="flex h-full min-w-0 flex-1 cursor-pointer select-none items-center gap-1 text-left"
      >
        {props.open && <IconChevronDown className="shrink-0" />}
        {!props.open && <IconChevronRight className="shrink-0" />}
        <span className="min-w-0 truncate font-semibold text-coffee-100 text-xs">
          {props.project}
        </span>
        <span className="shrink-0 rounded-sm bg-coffee-600/70 px-1 font-medium text-[11px] text-coffee-200 leading-4">
          {props.chain}
        </span>
      </button>
      {props.project !== props.openedProject && (
        <Link
          to={`/ui/p/${props.project}`}
          className="whitespace-nowrap text-[11px] text-coffee-300 underline decoration-coffee-500 underline-offset-2 hover:text-coffee-100"
        >
          open
        </Link>
      )}
      <span className="whitespace-nowrap font-mono text-[11px] text-coffee-400 tabular-nums group-hover:text-coffee-200">
        @{props.blockNumber}
      </span>
    </div>
  )
}

function AddressGroup(props: {
  title: string
  entries: ApiAddressEntry[]
  onFocus: () => void
  startClosed: boolean
  chain: string
  duplicatedNames: ReadonlySet<string>
  openedProject: string
  sourceProject: string
}) {
  const [open, setOpen] = useState(!props.startClosed)
  const sortedEntries = useMemo(
    () =>
      props.entries
        .filter((entry) => entry.chain === props.chain)
        .sort((a, b) => b.type.localeCompare(a.type)),
    [props.entries, props.chain],
  )
  const addresses = useMemo(
    () => new Set(sortedEntries.map((entry) => entry.address)),
    [sortedEntries],
  )
  const selectedHere = usePanelStore((state) =>
    state.selected.find((address) => addresses.has(address)),
  )
  const { onFocus } = props
  useEffect(() => {
    if (selectedHere !== undefined) {
      setOpen(true)
      onFocus()
    }
  }, [selectedHere, onFocus])

  if (sortedEntries.length === 0) {
    return null
  }
  return (
    <div>
      <button
        onClick={() => setOpen((open) => !open)}
        className={cn(
          'sticky z-10 flex h-[22px] w-full cursor-pointer select-none items-center gap-1 bg-coffee-900 pr-2 pl-2 font-semibold text-[11px] text-coffee-300 uppercase tracking-wide hover:bg-coffee-800 hover:text-coffee-100',
          GROUP_HEADER_STICKY_CLASS,
        )}
      >
        {open && <IconChevronDown className="shrink-0" />}
        {!open && <IconChevronRight className="shrink-0" />}
        {props.title}
        <span className="ml-auto font-medium text-coffee-400 tabular-nums">
          {sortedEntries.length}
        </span>
      </button>
      {open && (
        <ol className="relative pb-1 before:pointer-events-none before:absolute before:inset-y-0 before:left-4 before:z-1 before:w-px before:bg-coffee-600/60">
          {sortedEntries.map((entry) => (
            <AddressEntry
              key={entry.address}
              entry={entry}
              showAddress={
                entry.name !== undefined &&
                props.duplicatedNames.has(entry.name)
              }
              openedProject={props.openedProject}
              sourceProject={props.sourceProject}
            />
          ))}
        </ol>
      )}
    </div>
  )
}

const AddressEntry = memo(function AddressEntry({
  entry,
  showAddress,
  openedProject,
  sourceProject,
}: {
  entry: ApiAddressEntry
  showAddress: boolean
  openedProject: string
  sourceProject: string
}) {
  const isSelected = usePanelStore((state) =>
    state.selected.includes(entry.address),
  )
  const select = usePanelStore((state) => state.select)
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const isHidden = useNodesStore((state) =>
    getGraphProjection(state.nodes).hiddenNodeIds.has(entry.address),
  )
  const isGrayedOut = isHidden || (markUnreachableEntries && !entry.isReachable)

  return (
    <li
      data-address={entry.address}
      className={cn(
        'flex min-h-[22px] cursor-pointer select-none items-center gap-1.5 whitespace-pre pl-6 text-[13px] leading-[18px]',
        ROW_SCROLL_MARGIN_CLASS,
        isSelected &&
          'bg-autumn-300/15 text-coffee-100 shadow-[inset_2px_0_0_var(--color-autumn-300)]',
        !isSelected && 'hover:bg-coffee-800',
        isGrayedOut && 'opacity-40 grayscale',
      )}
      onClick={() => select([entry.address])}
    >
      <AddressIcon
        type={entry.type}
        className={cn(
          'size-3.5 shrink-0',
          isSelected && 'text-autumn-300',
          !isSelected && 'text-coffee-300',
        )}
      />
      <span className="min-w-0 truncate tabular-nums">
        {entry.name ?? toShortenedAddress(entry.address)}
      </span>
      {showAddress && (
        <span className="shrink-0 font-mono text-[11px] text-coffee-400">
          {toShortenedAddress(withoutChainPrefix(entry.address))}
        </span>
      )}
      <div className="mr-1 ml-auto flex items-center gap-1 text-coffee-400">
        {!IS_READONLY && (
          <UsageBadge
            address={entry.address}
            openedProject={openedProject}
            sourceProject={sourceProject}
          />
        )}
        {isHidden && <IconEyeClosed />}
        {!entry.isReachable && <IconUnlinked />}
      </div>
    </li>
  )
})

function withoutChainPrefix(address: string): string {
  return address.slice(address.indexOf(':') + 1)
}
