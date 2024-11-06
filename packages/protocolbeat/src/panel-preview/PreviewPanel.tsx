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
  if (response.status === 'unknown-project') {
    return <div className="p-2">Unknown project</div>
  }
  if (response.status === 'not-discovery-driven') {
    return (
      <div className="p-2">Only discovery-driven projects can be previewed</div>
    )
  }

  return (
    <div className="flex h-full w-full select-none flex-col text-sm">
      <AllPermissionsPreview
        permissionsPerChain={response.permissionsPerChain}
        selectedAddress={selectedAddress}
      />
      <AllContractsPreview
        contractsPerChain={response.contractsPerChain}
        selectedAddress={selectedAddress}
      />
    </div>
  )
}

function AllPermissionsPreview(props: {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermission[] }[]
  selectedAddress: string | undefined
}) {
  return props.permissionsPerChain.map(({ chain, permissions }) => (
    <div key={chain}>
      <h2 className="p-2 font-bold text-2xl text-blue-600">
        Permissions on {chain}:
      </h2>
      {permissions.map((permission, idx) => (
        <SinglePermissionPreview
          key={idx}
          permission={permission}
          selectedAddress={props.selectedAddress}
        />
      ))}
    </div>
  ))
}

function AllContractsPreview(props: {
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
  selectedAddress: string | undefined
}) {
  return props.contractsPerChain.map(({ chain, contracts }) => (
    <div key={chain} className="mt-2 border-t">
      <h2 className="p-2 font-bold text-2xl text-blue-600">
        Contracts on {chain}:
      </h2>
      {contracts.map((contract, idx) => (
        <SingleContractPreview
          key={idx}
          contract={contract}
          selectedAddress={props.selectedAddress}
        />
      ))}
    </div>
  ))
}

function SinglePermissionPreview(props: {
  permission: ApiPreviewPermission
  selectedAddress: string | undefined
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2 p-2',
        includesAddress(props.permission.addresses, props.selectedAddress) &&
          'border border-autumn-300',
      )}
    >
      <h3
        className={clsx(
          'font-bold',
          includesAddress(props.permission.addresses, props.selectedAddress) &&
            '',
        )}
      >
        {props.permission.name}
      </h3>
      <ul className="list-disc pl-5 italic">
        {props.permission.addresses.map((address, idx) => (
          <li key={idx}>
            <AddressDisplay value={address} />
          </li>
        ))}
      </ul>
      {props.permission.multisigParticipants && (
        <div>
          <div className="p-2">Participants:</div>
          <ul className="list-disc pl-5 italic">
            {props.permission.multisigParticipants.map((address, idx) => (
              <li key={idx}>
                <AddressDisplay value={address} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.permission.description.split('\n').map((a, idx) => (
        <div key={idx} className="ml-2">
          {a}
        </div>
      ))}
    </div>
  )
}

function SingleContractPreview(props: {
  contract: ApiPreviewContract
  selectedAddress: string | undefined
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2 p-2',
        includesAddress(props.contract.addresses, props.selectedAddress) &&
          'border border-autumn-300',
      )}
    >
      <h3 className="font-bold">{props.contract.name}</h3>
      <ul className="list-disc pl-5 italic">
        {props.contract.addresses.map((address, idx) => (
          <li key={idx}>
            <AddressDisplay value={address} />
          </li>
        ))}
      </ul>
      {props.contract.description.split('\n').map((a, idx) => (
        <div key={idx}>{a}</div>
      ))}
    </div>
  )
}

function includesAddress(addresses: AddressFieldValue[], address?: string) {
  return addresses.map((address) => address.address).includes(address ?? '')
}
