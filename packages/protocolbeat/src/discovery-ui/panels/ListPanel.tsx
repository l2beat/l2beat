import { useState } from 'react'
import { ApiAddressEntry, ApiProjectChain } from '../api/types'
import { IconChevronDown } from '../icons/IconChevronDown'
import { IconChevronRight } from '../icons/IconChevronRight'
import { IconContract } from '../icons/IconContract'
import { IconContractUnverified } from '../icons/IconContractUnverified'
import { IconDiamond } from '../icons/IconDiamond'
import { IconEoa } from '../icons/IconEoa'
import { IconFolder } from '../icons/IconFolder'
import { IconFolderOpened } from '../icons/IconFolderOpened'
import { IconMultisig } from '../icons/IconMultisig'
import { IconTimelock } from '../icons/IconTimelock'
import { IconToken } from '../icons/IconToken'
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
        {response.data.chains.map((chain, i) => (
          <ListItemChain key={i} chain={chain} />
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
        className="flex h-[22px] w-full cursor-pointer select-none items-center gap-1 font-bold text-xs uppercase hover:bg-slate-400"
      >
        {open && <IconChevronDown />}
        {!open && <IconChevronRight />}
        {props.chain.name}
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
        className="flex h-[22px] w-full cursor-pointer select-none items-center gap-1 pl-2 text-sm hover:bg-slate-400"
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
          {props.entries.map((entry) => (
            <li
              className="flex h-[22px] cursor-pointer select-none items-center gap-1 pl-4 text-sm hover:bg-slate-400"
              key={entry.address}
            >
              <div className="mr-[7px] h-[22px] border-black border-l" />
              <AddressIcon type={entry.type} />
              {entry.name ? (
                <span className="overflow-hidden text-ellipsis">
                  {entry.name}
                </span>
              ) : (
                <span className="overflow-hidden text-ellipsis font-mono text-xs">
                  {toShortenedAddress(entry.address)}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

function toShortenedAddress(input: string) {
  const [chain, address] = input.split(':') as [string, string]
  return `${chain}:${address.slice(0, 6)}…${address.slice(-4)}`
}

function AddressIcon(props: { type: ApiAddressEntry['type'] }) {
  const Icon = {
    EOA: IconEoa,
    Unverified: IconContractUnverified,
    Token: IconToken,
    Multisig: IconMultisig,
    Timelock: IconTimelock,
    Diamond: IconDiamond,
    Contract: IconContract,
  }[props.type]

  return <Icon />
}
