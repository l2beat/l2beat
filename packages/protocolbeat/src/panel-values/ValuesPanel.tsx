import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type {
  ApiAddressEntry,
  ApiProjectChain,
  ApiProjectContract,
} from '../api/types'
import { AddressIcon } from '../common/AddressIcon'
import { IconChevronDown } from '../icons/IconChevronDown'
import { IconChevronRight } from '../icons/IconChevronRight'
import { usePanelStore } from '../store/store'
import { AbiDisplay } from './AbiDisplay'
import { AddressDisplay } from './AddressDisplay'
import { FieldDisplay } from './Field'

export function ValuesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = usePanelStore((state) => state.selected)

  if (response.isPending) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }

  const selected = findSelected(response.data.chains, selectedAddress)

  return (
    <div className="h-full w-full overflow-x-auto">
      {!selected && <div>Select a contract</div>}
      {selected && <Display selected={selected} />}
    </div>
  )
}

function findSelected(chains: ApiProjectChain[], address: string | undefined) {
  if (!address) {
    return
  }
  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return contract
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return contract
      }
    }
    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        return eoa
      }
    }
  }
}

function Display({
  selected,
}: { selected: ApiProjectContract | ApiAddressEntry }) {
  return (
    <>
      <div id={selected.address} className="mb-2 px-5 text-lg">
        <p className="flex items-center gap-1 font-bold">
          <AddressIcon type={selected.type} />{' '}
          {selected.name ??
            (selected.type === 'Unverified' ? 'Unverified' : 'Unknown')}
        </p>
        {'template' in selected && selected.template && (
          <p className="font-mono text-aux-orange text-xs">
            template/{selected.template}
          </p>
        )}
        <div className="font-mono text-xs">
          <AddressDisplay
            simplified
            value={{
              type: 'address',
              address: selected.address,
              addressType: selected.type,
            }}
          />
        </div>
        {selected.description && (
          <p className="pt-1 pb-1 font-serif text-sm italic">
            {selected.description}
          </p>
        )}
      </div>
      {selected.referencedBy.length > 0 && (
        <Folder title="Referenced by">
          <ol className="bg-coffee-900 py-0.5 pl-5">
            {selected.referencedBy.map((value) => (
              <li key={value.address}>
                <AddressDisplay value={value} />
              </li>
            ))}
          </ol>
        </Folder>
      )}
      {'fields' in selected && selected.fields.length > 0 && (
        <Folder title="Fields">
          <ol>
            {selected.fields.map((field, i) => (
              <FieldDisplay key={i} field={field} />
            ))}
          </ol>
        </Folder>
      )}
      {'abis' in selected && selected.abis.length > 0 && (
        <Folder title="ABI" collapsed>
          <AbiDisplay abis={selected.abis} />
        </Folder>
      )}
    </>
  )
}

function Folder(props: {
  title: string
  children: ReactNode
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(!props.collapsed)

  return (
    <div className="border-coffee-600 border-t">
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-[22px] w-full cursor-pointer select-none items-center gap-1 font-bold text-xs uppercase"
      >
        {open && <IconChevronDown />}
        {!open && <IconChevronRight />}
        {props.title}
      </button>
      {open && props.children}
    </div>
  )
}
