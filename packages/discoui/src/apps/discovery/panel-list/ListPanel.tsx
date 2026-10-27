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
import { IconFolder } from '../../../icons/IconFolder'
import { IconFolderOpened } from '../../../icons/IconFolderOpened'
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
          {response.data.entries.map((chain, i) => (
            <ListItemChain
              key={`${chain.project}-${i}`}
              entry={chain}
              first={i === 0}
              openedProject={project}
            />
          ))}
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

function ListItemChain(props: {
  entry: ApiProjectChain
  first: boolean
  openedProject: string
}) {
  const [open, setOpen] = useState(true)
  const onFocus = useCallback(() => setOpen(true), [])

  return Object.entries(props.entry.blockNumbers).map(
    ([chain, blockNumber]) => (
      <li
        key={chain}
        className={cn(!props.first && 'border-t border-t-coffee-600')}
      >
        <div className="group flex min-h-6 items-center justify-between bg-coffee-900 px-1 hover:bg-coffee-800">
          <button
            onClick={() => setOpen((open) => !open)}
            className="flex min-w-0 flex-1 cursor-pointer select-none items-center gap-1 font-semibold text-[11px] text-coffee-200 uppercase tracking-wide"
          >
            {open && <IconChevronDown />}
            {!open && <IconChevronRight />}
            <span className="min-w-0 break-words text-left">{`${props.entry.project} on ${chain}`}</span>
          </button>
          {props.entry.project !== props.openedProject && (
            <Link
              to={`/ui/p/${props.entry.project}`}
              className="mr-2 whitespace-nowrap text-[11px] text-coffee-300 underline hover:text-coffee-100"
            >
              open
            </Link>
          )}
          <span className="whitespace-nowrap font-mono text-[11px] text-coffee-300 tabular-nums group-hover:text-coffee-200">
            @{blockNumber}
          </span>
        </div>
        {open && (
          <>
            <ListItemContracts
              title="Initial"
              onFocus={onFocus}
              entries={props.entry.initialContracts}
              chain={chain}
              openedProject={props.openedProject}
              sourceProject={props.entry.project}
            />
            <ListItemContracts
              title="Discovered"
              onFocus={onFocus}
              entries={props.entry.discoveredContracts}
              chain={chain}
              openedProject={props.openedProject}
              sourceProject={props.entry.project}
            />
            <ListItemContracts
              startClosed
              title="EOAs"
              onFocus={onFocus}
              entries={props.entry.eoas}
              chain={chain}
              openedProject={props.openedProject}
              sourceProject={props.entry.project}
            />
          </>
        )}
      </li>
    ),
  )
}

function ListItemContracts(props: {
  title: string
  entries: ApiAddressEntry[]
  onFocus?: () => void
  startClosed?: boolean
  chain: string
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
      onFocus?.()
    }
  }, [selectedHere, onFocus])

  if (sortedEntries.length === 0) {
    return null
  }
  return (
    <>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-[22px] w-full cursor-pointer select-none items-center gap-1 bg-coffee-800 pl-2 font-semibold text-coffee-300 text-xs hover:bg-coffee-700 hover:text-coffee-100"
      >
        {open && (
          <>
            <IconChevronDown />
            <IconFolderOpened />
          </>
        )}
        {!open && (
          <>
            <IconChevronRight />
            <IconFolder />
          </>
        )}
        {props.title}
      </button>
      {open && (
        <ol className="relative before:pointer-events-none before:absolute before:inset-y-0 before:left-4 before:z-1 before:w-px before:bg-coffee-600/60">
          {sortedEntries.map((entry) => (
            <AddressEntry
              key={entry.address}
              entry={entry}
              openedProject={props.openedProject}
              sourceProject={props.sourceProject}
            />
          ))}
        </ol>
      )}
    </>
  )
}

const AddressEntry = memo(function AddressEntry({
  entry,
  openedProject,
  sourceProject,
}: {
  entry: ApiAddressEntry
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
        isSelected &&
          'bg-autumn-300/15 text-coffee-100 shadow-[inset_2px_0_0_#BAD80A]',
        !isSelected && 'hover:bg-coffee-800',
      )}
      onClick={() => select([entry.address])}
      style={{
        opacity: isGrayedOut ? 0.2 : 1,
        filter: isGrayedOut ? 'grayscale(100%)' : 'none',
      }}
    >
      <AddressIcon
        type={entry.type}
        className={cn('size-3.5 shrink-0', isSelected && 'text-autumn-300')}
      />
      <span className="min-w-0 truncate tabular-nums">
        {entry.name ?? toShortenedAddress(entry.address)}
      </span>
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
