import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPreview } from '../api/api'
import type {
  AddressFieldValue,
  ApiPreviewContract,
  ApiPreviewPermissions,
} from '../api/types'
import { AddressDisplay } from '../panel-values/AddressDisplay'
import { usePanelStore } from '../store/store'

export function PreviewPanel() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)
  const [showOnlySelected, setShowOnlySelected] = useState(false)

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
      <div className="sticky top-0 z-10">
        <OptionsPanel
          showOnlySelected={showOnlySelected}
          setShowOnlySelected={setShowOnlySelected}
        />
      </div>
      <div className="overflow-auto">
        <PermissionsPreview
          permissionsPerChain={response.permissionsPerChain}
          selectedAddress={selectedAddress}
          showOnlySelected={showOnlySelected}
        />
        <ContractsPreview
          contractsPerChain={response.contractsPerChain}
          selectedAddress={selectedAddress}
          showOnlySelected={showOnlySelected}
        />
      </div>
    </div>
  )
}

function OptionsPanel(props: {
  showOnlySelected: boolean
  setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="bg-coffee-600 p-0 px-2 text-right">
      <label>
        <input
          type="checkbox"
          checked={props.showOnlySelected}
          onChange={(e) => props.setShowOnlySelected(e.target.checked)}
        />{' '}
        Show only selected address
      </label>
    </div>
  )
}

function PermissionsPreview(props: {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermissions }[]
  selectedAddress: string | undefined
  showOnlySelected: boolean
}) {
  return props.permissionsPerChain
    .filter(({ permissions }) =>
      applyShowOnlySelectedFilter(
        [
          ...permissions.roles.flatMap((p) => p.addresses),
          ...permissions.actors.flatMap((p) => p.addresses),
        ],
        props.selectedAddress,
        props.showOnlySelected,
      ),
    )
    .map(({ chain, permissions }) => (
      <div key={chain} className="border-b border-b-coffee-600 pb-2">
        <SectionHeader title={`Roles on ${chain}:`} />
        {permissions.roles.map((permission, idx) => {
          const isSelected = includesAddress(
            permission.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={permission.name}
              addresses={permission.addresses}
              multisigParticipants={permission.multisigParticipants}
              description={permission.description}
              isHighlighted={isSelected}
            />
          )
        })}
        <SectionHeader title={`Actors on ${chain}:`} />
        {permissions.actors.map((permission, idx) => {
          const isSelected = includesAddress(
            permission.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={permission.name}
              addresses={permission.addresses}
              multisigParticipants={permission.multisigParticipants}
              description={permission.description}
              isHighlighted={isSelected}
            />
          )
        })}
      </div>
    ))
}

function ContractsPreview(props: {
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
  selectedAddress: string | undefined
  showOnlySelected: boolean
}) {
  return props.contractsPerChain
    .filter(({ contracts }) =>
      applyShowOnlySelectedFilter(
        contracts.flatMap((c) => c.addresses),
        props.selectedAddress,
        props.showOnlySelected,
      ),
    )
    .map(({ chain, contracts }) => (
      <div key={chain} className="border-b border-b-coffee-600 pb-2">
        <SectionHeader title={`Contracts on ${chain}:`} />
        {contracts.map((contract, idx) => {
          const isSelected = includesAddress(
            contract.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={contract.name}
              addresses={contract.addresses}
              description={contract.description}
              isHighlighted={isSelected}
            />
          )
        })}
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

function applyShowOnlySelectedFilter(
  addresses: AddressFieldValue[],
  selectedAddress: string | undefined,
  showOnlySelected: boolean,
) {
  return !showOnlySelected || includesAddress(addresses, selectedAddress)
}
