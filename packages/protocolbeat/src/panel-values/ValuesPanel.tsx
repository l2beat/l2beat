import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type {
  ApiAddressEntry,
  ApiProjectChain,
  ApiProjectContract,
} from '../api/types'
import { AddressIcon } from '../common/AddressIcon'
import { isReadOnly } from '../config'
import { IconCopy } from '../icons/IconCopy'
import { IconTick } from '../icons/IconTick'
import { usePanelStore } from '../store/store'
import { AbiDisplay } from './AbiDisplay'
import { AddressDisplay } from './AddressDisplay'
import { FieldDisplay } from './Field'
import { Folder } from './Folder'

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

  const selected = findSelected(response.data.entries, selectedAddress)

  return (
    <div className="h-full w-full overflow-x-auto">
      {!selected && <div>Select a contract</div>}
      {selected && (
        <Display
          selected={selected}
          chain={selected.chain}
          blockNumber={selected.blockNumber}
        />
      )}
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
        return {
          ...contract,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return {
          ...contract,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        return {
          ...eoa,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
  }
}

function Display({
  selected,
  chain,
  blockNumber,
}: {
  selected: ApiProjectContract | ApiAddressEntry
  chain: string
  blockNumber: number
}) {
  const address = getAddressToCopy(selected)

  const copy = address && canCopy(selected) && !isReadOnly && (
    <CopyAddShapeCommand
      chain={chain}
      address={address}
      name={selected.name}
      blockNumber={blockNumber}
    />
  )

  return (
    <>
      <div id={selected.address} className="mb-2 px-5 text-lg">
        <p className="flex items-center">
          <p className="flex items-center gap-1 font-bold">
            <AddressIcon type={selected.type} />
            {selected.name ??
              (selected.type === 'Unverified' ? 'Unverified' : 'Unknown')}
          </p>
          {copy}
        </p>
        <div className="flex flex-row divide-x divide-coffee-400 font-mono text-xs">
          {'proxyType' in selected && selected.proxyType && (
            <p className="px-1 text-aux-cyan first:pl-0">
              {selected.proxyType}
            </p>
          )}
          {'template' in selected && selected.template && (
            <p className="px-1 text-aux-orange first:pl-0">
              template/{selected.template}
            </p>
          )}
        </div>
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

function CopyAddShapeCommand(props: {
  chain: string
  address: string
  blockNumber: number
  name?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const command = `l2b add-shape ${props.chain} ${props.address} ${props.blockNumber} "${props.name ?? '<NAME>'}.sol" <TEMPLATE_NAME>`

      void navigator.clipboard.writeText(command)
      const timeout = setTimeout(() => setCopied(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [props, copied, setCopied])

  return (
    <button
      className="flex items-center justify-center gap-1 px-2 py-1 text-coffee-400 text-xs underline underline-offset-2 hover:text-coffee-300"
      onClick={(e) => {
        e.preventDefault()
        setCopied(true)
      }}
    >
      Copy shape command
      {!copied && <IconCopy className="text-coffee-400" />}
      {copied && <IconTick className="text-aux-green" />}
    </button>
  )
}

function getAddressToCopy(selected: ApiProjectContract | ApiAddressEntry) {
  const address = findAddressToCopy(selected)

  if (!address) {
    return
  }
  // biome-ignore lint/style/noNonNullAssertion: it's there
  return address.split(':')[1]!
}

function findAddressToCopy(selected: ApiProjectContract | ApiAddressEntry) {
  const hasFields = 'fields' in selected && selected.fields.length > 0

  if (!hasFields) {
    return selected.address
  }

  const implementations = selected.fields.find(
    (field) => field.name === '$implementation',
  )

  if (!implementations) {
    return selected.address
  }

  if (implementations.value.type === 'address') {
    return implementations.value.address
  }

  if (implementations.value.type === 'array') {
    // skipping the array type explicity
    return
  }

  return selected.address
}

function canCopy(selected: ApiProjectContract | ApiAddressEntry) {
  return (
    selected.type !== 'Unverified' &&
    selected.type !== 'Unknown' &&
    selected.type !== 'EOA'
  )
}
