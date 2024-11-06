import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getPreview } from '../api/api'
import { AddressFieldValue, } from '../api/types'
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

  const includesAddress = (
    addresses: AddressFieldValue[],
    address?: string,
  ) => {
    console.log(
      address,
      addresses.map((address) => address.address),
    )
    return addresses.map((address) => address.address).includes(address ?? '')
  }

  const permissionsPreview = response.permissionsPerChain.map(
    ({ chain, permissions }) => (
      <div>
        <h2 className="p-2 font-bold text-2xl text-blue-600">
          Permissions on {chain}:
        </h2>
        {permissions.map((permission, index) => (
          <div
            key={index}
            className={clsx(
              'flex flex-col gap-2 p-2',
              includesAddress(permission.addresses, selectedAddress) &&
                'border border-autumn-300',
            )}
          >
            <h3
              className={clsx(
                'font-bold',
                includesAddress(permission.addresses, selectedAddress) && '',
              )}
            >
              {permission.name}
            </h3>
            <div className="text-sm">
              <ul className="list-disc pl-5 italic">
                {permission.addresses.map((address, idx) => (
                  <li key={idx}>
                    <AddressDisplay value={address} />
                  </li>
                ))}
              </ul>
            </div>
            {permission.multisigParticipants && (
              <div className="text-sm">
                <div>Participants:</div>
                <ul className="list-disc pl-5 italic">
                  {permission.multisigParticipants.map((address, idx) => (
                    <li key={idx}>
                      <AddressDisplay value={address} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              {permission.description.split('\n').map((a) => (
                <div>{a}</div>
              ))}
            </p>
          </div>
        ))}
      </div>
    ),
  )

  const contractsPreview = response.contractsPerChain.map(
    ({ chain, contracts }) => (
      <div className="mt-2 border-t">
        <h2 className="p-2 font-bold text-2xl text-blue-600">
          Contracts on {chain}:
        </h2>
        {contracts.map((contract, index) => (
          <div
            key={index}
            className={clsx(
              'flex flex-col gap-2 p-2',
              includesAddress(contract.addresses, selectedAddress) &&
                'border border-autumn-300',
            )}
          >
            <h3 className="font-bold">{contract.name}</h3>
            <div className="text-sm">
              <ul className="list-disc pl-5 italic">
                {contract.addresses.map((address, idx) => (
                  <li key={idx}>
                    <AddressDisplay value={address} />
                  </li>
                ))}
              </ul>
            </div>
            <p>
              {contract.description.split('\n').map((a, idx) => (
                <div key={idx}>{a}</div>
              ))}
            </p>
          </div>
        ))}
      </div>
    ),
  )

  return (
    <div className="flex h-full w-full select-none flex-col">
      {permissionsPreview}
      {contractsPreview}
    </div>
  )
}
