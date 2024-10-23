import { useState } from 'react'
import { ApiAddressEntry, ApiProjectChain } from '../api/types'
import { IconChevronDown } from '../icons/IconChevronDown'
import { IconChevronRight } from '../icons/IconChevronRight'
import { useApiProject } from './useApiProject'

export function ListPanel() {
  const response = useApiProject()
  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }
  return (
    <div className="h-full w-full overflow-x-hidden font-ui">
      <ol>
        {response.data.chains.map((chain) => (
          <ListItemChain key={chain.chain} chain={chain} />
        ))}
      </ol>
    </div>
  )
}

function ListItemChain(props: { chain: ApiProjectChain }) {
  const [open, setOpen] = useState(true)
  return (
    <li>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-5 w-full cursor-pointer select-none items-center gap-1 font-bold text-xs uppercase hover:bg-slate-400"
      >
        {open && <IconChevronDown />}
        {!open && <IconChevronRight />}
        {props.chain.chain}
      </button>
      {open && (
        <>
          <ListItemContracts
            title="Initial"
            entries={props.chain.initialContracts}
          />
          <ListItemContracts
            title="Discovered"
            entries={props.chain.discoveredContracts}
          />
          <ListItemContracts
            startClosed
            title="Ignored"
            entries={props.chain.ignoredContracts}
          />
          <ListItemContracts
            startClosed
            title="EOAs"
            entries={props.chain.eoas}
          />
        </>
      )}
    </li>
  )
}

function ListItemContracts(props: {
  title: string
  entries: ApiAddressEntry[]
  startClosed?: boolean
}) {
  const [open, setOpen] = useState(!props.startClosed)

  if (props.entries.length === 0) {
    return null
  }
  return (
    <>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-5 w-full cursor-pointer select-none items-center gap-1 pl-2 text-sm hover:bg-slate-400"
      >
        {open && <IconChevronDown />}
        {!open && <IconChevronRight />}
        {props.title}
      </button>
      {open && (
        <ol>
          {props.entries.map((entry) => (
            <li
              className="h-5 cursor-pointer select-none pl-7 text-sm hover:bg-slate-400"
              key={entry.address}
            >
              {entry.name || entry.address}
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
