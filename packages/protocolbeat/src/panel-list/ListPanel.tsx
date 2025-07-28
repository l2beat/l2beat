import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type { ApiAddressEntry, ApiProjectChain } from '../api/types'
import { AddressIcon } from '../common/AddressIcon'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { IconChevronDown } from '../icons/IconChevronDown'
import { IconChevronRight } from '../icons/IconChevronRight'
import { IconFolder } from '../icons/IconFolder'
import { IconFolderOpened } from '../icons/IconFolderOpened'
import { usePanelStore } from '../store/store'

export function ListPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  if (response.isPending) {
    return <LoadingState />
  }
  if (response.isError) {
    return <ErrorState />
  }
  return (
    <div className="h-full w-full overflow-x-hidden">
      <ol>
        {response.data.entries.map((chain, i) => (
          <ListItemChain key={i} entry={chain} first={i === 0} />
        ))}
      </ol>
    </div>
  )
}

function ListItemChain(props: { entry: ApiProjectChain; first: boolean }) {
  const [open, setOpen] = useState(true)

  function onFocus() {
    setOpen(true)
  }

  return (
    <li className={clsx(!props.first && 'border-t border-t-coffee-600')}>
      <div className="group flex min-h-[22px] items-center justify-between pr-1 hover:bg-aux-brown">
        <button
          onClick={() => setOpen((open) => !open)}
          className="flex w-full cursor-pointer select-none items-center gap-1 font-bold text-xs uppercase"
        >
          {open && <IconChevronDown />}
          {!open && <IconChevronRight />}
          {`${props.entry.project} on ${props.entry.chain}`}
        </button>
        <span className="whitespace-nowrap text-coffee-400 text-xs italic group-hover:text-coffee-200">
          @ {props.entry.blockNumber}
        </span>
      </div>
      {open && (
        <>
          <ListItemContracts
            title="Initial"
            onFocus={onFocus}
            entries={props.entry.initialContracts}
          />
          <ListItemContracts
            title="Discovered"
            onFocus={onFocus}
            entries={props.entry.discoveredContracts}
          />
          <ListItemContracts
            startClosed
            title="EOAs"
            onFocus={onFocus}
            entries={props.entry.eoas}
          />
        </>
      )}
    </li>
  )
}

function ListItemContracts(props: {
  title: string
  entries: ApiAddressEntry[]
  onFocus?: () => void
  startClosed?: boolean
}) {
  const [open, setOpen] = useState(!props.startClosed)
  const selected = usePanelStore((state) => state.selected)
  useEffect(() => {
    const selectedSet = new Set<string>(selected)
    for (const { address } of props.entries) {
      if (selectedSet.has(address)) {
        setOpen(true)
        props.onFocus?.()
        break
      }
    }
  }, [props.entries, selected, props.onFocus])

  if (props.entries.length === 0) {
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
          {props.entries
            .toSorted((a, b) => b.type.localeCompare(a.type))
            .map((entry) => (
              <AddressEntry key={entry.address} entry={entry} />
            ))}
        </ol>
      )}
    </>
  )
}

function AddressEntry({ entry }: { entry: ApiAddressEntry }) {
  const isSelected = usePanelStore((state) => state.selected === entry.address)
  const select = usePanelStore((state) => state.select)
  return (
    <li
      className={clsx(
        'flex min-h-[22px] cursor-pointer select-none items-center gap-1 whitespace-pre pl-4 text-sm',
        isSelected && 'bg-autumn-300 text-black',
        !isSelected && 'bg-coffee-800 hover:bg-aux-brown',
      )}
      onClick={() => select(entry.address)}
    >
      <div className="mr-[7px] min-h-[22px] border-coffee-600 border-l" />
      <AddressIcon type={entry.type} />
      <span className="overflow-hidden text-ellipsis tabular-nums">
        {entry.name ?? toShortenedAddress(entry.address)}
      </span>
    </li>
  )
}
