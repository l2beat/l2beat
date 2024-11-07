import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getPreview } from '../api/api'
import {
  AddressFieldValue,
  ApiPreviewContract,
  ApiPreviewPermission,
} from '../api/types'
import { AddressDisplay } from '../panel-values/AddressDisplay'
import { usePanelStore } from '../store/store'

export function PreviewPanel() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const previewResponse = useQuery({
    queryKey: ['projects', project, 'preview'],
    queryFn: () => getPreview(project),
  })
  const response = previewResponse.data
  if (response === undefined) {
    return <div className="p-2">Loading...</div>
  }

  return (
    <div className="flex h-full w-full select-none flex-col text-sm">
      <PermissionsPreview
        permissionsPerChain={response.permissionsPerChain}
        selectedAddress={selectedAddress}
      />
      <ContractsPreview
        contractsPerChain={response.contractsPerChain}
        selectedAddress={selectedAddress}
      />
    </div>
  )
}

function PermissionsPreview(props: {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermission[] }[]
  selectedAddress: string | undefined
}) {
  return props.permissionsPerChain.map(({ chain, permissions }) => (
    <div key={chain}>
      <SectionHeader title={`Permissions on ${chain}:`} />
      {permissions.map((permission, idx) => (
        <PreviewItem
          key={idx}
          name={permission.name}
          addresses={permission.addresses}
          multisigParticipants={permission.multisigParticipants}
          description={permission.description}
          isHighlighted={includesAddress(
            permission.addresses,
            props.selectedAddress,
          )}
        />
      ))}
    </div>
  ))
}

function ContractsPreview(props: {
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
  selectedAddress: string | undefined
}) {
  return props.contractsPerChain.map(({ chain, contracts }) => (
    <div key={chain} className="mt-2 border-t border-t-coffee-600">
      <SectionHeader title={`Contracts on ${chain}:`} />
      {contracts.map((contract, idx) => (
        <PreviewItem
          key={idx}
          name={contract.name}
          addresses={contract.addresses}
          description={contract.description}
          isHighlighted={includesAddress(
            contract.addresses,
            props.selectedAddress,
          )}
        />
      ))}
    </div>
  ))
}

function PreviewItem(props: {
  name: string
  addresses: AddressFieldValue[]
  multisigParticipants?: AddressFieldValue[]
  description: string
  isHighlighted: boolean
}) {
  return (
    <div
      className={clsx(
        'mb-1 flex flex-col gap-2 border-l-4 p-2 pl-1',
        props.isHighlighted ? 'border-autumn-300' : 'border-transparent',
      )}
    >
      <h3 className="font-bold">{props.name}</h3>
      <ul className="list-disc pl-5 italic">
        {props.addresses.map((address, idx) => (
          <li key={idx}>
            <AddressDisplay value={address} />
          </li>
        ))}
      </ul>
      {props.multisigParticipants && (
        <div>
          <div className="p-2">Participants:</div>
          <ul className="list-disc pl-5 italic">
            {props.multisigParticipants.map((address, idx) => (
              <li key={idx}>
                <AddressDisplay value={address} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.description.split('\n').map((a, idx) => (
        <div key={idx} className="ml-2">
          {a}
        </div>
      ))}
    </div>
  )
}

function SectionHeader(props: { title: string }) {
  return <h2 className="p-2 font-bold text-2xl text-blue-600">{props.title}</h2>
}

function includesAddress(addresses: AddressFieldValue[], address?: string) {
  return addresses.map((address) => address.address).includes(address ?? '')
}
