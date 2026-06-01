import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type {
  ApiAddressEntry,
  ApiProjectChain,
} from '../../../api/types'
import { buildDeclaredEntrypointAddressSet } from '../panel-nodes/store/utils/entrypointGroups'
import { AddressIcon } from '../../../components/AddressIcon'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconEyeClosed } from '../../../icons/IconEyeClosed'
import { IconFolder } from '../../../icons/IconFolder'
import { IconFolderOpened } from '../../../icons/IconFolderOpened'
import { IconUnlinked } from '../../../icons/IconUnliked'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { useStore as useNodesStore } from '../panel-nodes/store/store'
import { useGlobalSettingsStore } from '../store/global-settings-store'
import { usePanelStore } from '../store/panel-store'

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
  // Only projects explicitly linked via sharedModules get the "Shared module"
  // badge. The opened project itself never gets it, even if it declares
  // entrypoints.
  const sharedModules = new Set(response.data.sharedModules)
  const entrypointAddresses = buildDeclaredEntrypointAddressSet(
    response.data.entrypointGroups,
  )
  return (
    <div className="h-full w-full overflow-x-hidden">
      <ol>
        {response.data.entries.map((chain, i) => (
          <ListItemChain
            key={`${chain.project}-${i}`}
            entry={chain}
            first={i === 0}
            isSharedModule={
              chain.project !== project && sharedModules.has(chain.project)
            }
            entrypointAddresses={entrypointAddresses}
          />
        ))}
      </ol>
    </div>
  )
}

function ListItemChain(props: {
  entry: ApiProjectChain
  first: boolean
  isSharedModule: boolean
  entrypointAddresses: ReadonlySet<string>
}) {
  const [open, setOpen] = useState(true)

  function onFocus() {
    setOpen(true)
  }

  return Object.entries(props.entry.blockNumbers).map(
    ([chain, blockNumber]) => (
      <li
        key={chain}
        className={clsx(!props.first && 'border-t border-t-coffee-600')}
      >
        <div className="group flex min-h-[22px] items-start justify-between gap-2 pr-1 hover:bg-aux-brown">
          <button
            onClick={() => setOpen((open) => !open)}
            className="flex min-w-0 flex-1 cursor-pointer select-none items-center justify-start gap-1 text-left font-bold text-xs uppercase"
          >
            {open && <IconChevronDown />}
            {!open && <IconChevronRight />}
            <span className="text-left leading-tight">{`${props.entry.project} on ${chain}`}</span>
            {props.isSharedModule && (
              <span className="inline-flex h-5 shrink-0 items-center rounded border border-coffee-500 px-1 text-[10px] text-coffee-300 normal-case">
                Shared module
              </span>
            )}
          </button>
          <span className="shrink-0 whitespace-nowrap pt-0.5 text-coffee-400 text-xs italic group-hover:text-coffee-200">
            @ {blockNumber}
          </span>
        </div>
        {open && (
          <>
            <ListItemContracts
              title="Initial"
              onFocus={onFocus}
              entries={props.entry.initialContracts}
              chain={chain}
              entrypointAddresses={props.entrypointAddresses}
            />
            <ListItemContracts
              title="Discovered"
              onFocus={onFocus}
              entries={props.entry.discoveredContracts}
              chain={chain}
              entrypointAddresses={props.entrypointAddresses}
            />
            <ListItemContracts
              startClosed
              title="EOAs"
              onFocus={onFocus}
              entries={props.entry.eoas}
              chain={chain}
              entrypointAddresses={props.entrypointAddresses}
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
  entrypointAddresses: ReadonlySet<string>
}) {
  const [open, setOpen] = useState(!props.startClosed)
  const selected = usePanelStore((state) => state.selected)

  const filteredEntries = props.entries.filter(
    (entry) => entry.chain === props.chain,
  )
  useEffect(() => {
    const selectedSet = new Set<string>(selected)
    for (const { address } of filteredEntries) {
      if (selectedSet.has(address)) {
        setOpen(true)
        props.onFocus?.()
        break
      }
    }
  }, [filteredEntries, selected, props.onFocus])

  if (filteredEntries.length === 0) {
    return null
  }
  return (
    <>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 pl-2 font-medium text-coffee-400 text-sm hover:bg-aux-brown hover:text-coffee-200"
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
        <ol>
          {filteredEntries
            .toSorted((a, b) => b.type.localeCompare(a.type))
            .map((entry) => (
              <AddressEntry
                key={entry.address}
                entry={entry}
                isEntrypoint={props.entrypointAddresses.has(entry.address)}
              />
            ))}
        </ol>
      )}
    </>
  )
}

function AddressEntry({
  entry,
  isEntrypoint,
}: {
  entry: ApiAddressEntry
  isEntrypoint: boolean
}) {
  const isSelected = usePanelStore((state) => state.selected === entry.address)
  const select = usePanelStore((state) => state.select)
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const isHidden = useNodesStore((state) =>
    state.hidden.includes(entry.address),
  )
  const isGrayedOut = isHidden || (markUnreachableEntries && !entry.isReachable)

  return (
    <li
      className={clsx(
        'flex min-h-[22px] cursor-pointer select-none items-center gap-1 whitespace-pre pl-4 text-sm',
        isSelected && 'bg-autumn-300 text-black',
        !isSelected && 'bg-coffee-800 hover:bg-aux-brown',
      )}
      onClick={() => select(entry.address)}
      style={{
        opacity: isGrayedOut ? 0.2 : 1,
        filter: isGrayedOut ? 'grayscale(100%)' : 'none',
      }}
    >
      <div className="mr-[7px] min-h-[22px] border-coffee-600 border-l" />
      <AddressIcon type={entry.type} />
      <span className="overflow-hidden text-ellipsis tabular-nums">
        {entry.name ?? toShortenedAddress(entry.address)}
      </span>
      {isEntrypoint && (
        <span
          title="Declared as an entrypoint"
          className={clsx(
            'shrink-0 rounded border px-1 text-[9px] uppercase leading-[14px] tracking-wide',
            isSelected
              ? 'border-black/40 text-black/70'
              : 'border-coffee-500 text-coffee-300',
          )}
        >
          entrypoint
        </span>
      )}
      <div className="mr-1 ml-auto flex gap-1 text-coffee-400">
        {isHidden && <IconEyeClosed />}
        {!entry.isReachable && <IconUnlinked />}
      </div>
    </li>
  )
}
