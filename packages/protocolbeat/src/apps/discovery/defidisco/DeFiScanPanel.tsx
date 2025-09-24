import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProject, getPermissionOverrides } from '../../../api/api'
import { useContractTags } from '../../../hooks/useContractTags'
import { Checkbox } from '../../../components/Checkbox'
import { usePanelStore } from '../store/panel-store'
import { ResultsSection } from './ResultsSection'

export function DeFiScanPanel() {
  const { project } = useParams()
  const [showOnlySelected, setShowOnlySelected] = useState(false)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  const { data: contractTags } = useContractTags(project)
  const { data: permissionOverrides } = useQuery({
    queryKey: ['permission-overrides', project],
    queryFn: () => project ? getPermissionOverrides(project) : null,
    enabled: !!project,
  })

  if (!response.data || !contractTags || !permissionOverrides) {
    return <div className="flex h-full w-full items-center justify-center">Loading...</div>
  }

  // Filter out external contracts from permissions data
  const filteredPermissionOverrides = {
    ...permissionOverrides,
    contracts: Object.fromEntries(
      Object.entries(permissionOverrides.contracts || {}).filter(([contractAddress, _]) => {
        // Normalize address format - remove 'eth:' prefix and convert to lowercase
        const normalizedAddress = contractAddress.replace('eth:', '').toLowerCase()
        const tag = contractTags.tags.find((tag: any) =>
          tag.contractAddress.toLowerCase() === normalizedAddress
        )
        return tag?.isExternal !== true
      })
    )
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10">
        <div className="flex items-center justify-end gap-1 bg-coffee-600 p-0 px-2 text-right">
          <div
            className="flex cursor-pointer select-none items-center justify-center gap-1"
            onClick={() => setShowOnlySelected(!showOnlySelected)}
          >
            <Checkbox checked={showOnlySelected} />
            Show only selected address
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <StatusOfReviewSection
          projectData={response.data}
          contractTags={contractTags}
          permissionOverrides={filteredPermissionOverrides}
        />
        <ResultsSection
          projectData={response.data}
          permissionOverrides={filteredPermissionOverrides}
          contractTags={contractTags}
        />
      </div>
    </div>
  )
}

function StatusOfReviewSection({ projectData, contractTags, permissionOverrides }: { projectData: any, contractTags: any, permissionOverrides: any }) {
  // Get all contracts from all entries
  const allContracts: any[] = []
  const initialContracts: any[] = []

  projectData.entries.forEach((entry: any) => {
    // Add initial contracts
    entry.initialContracts.forEach((contract: any) => {
      initialContracts.push(contract)
      allContracts.push({ ...contract, source: 'initial' })
    })

    // Add discovered contracts
    entry.discoveredContracts.forEach((contract: any) => {
      allContracts.push({ ...contract, source: 'discovered' })
    })
  })

  // Collect all EOAs from the eoas array
  const allEoas: any[] = []
  projectData.entries.forEach((entry: any) => {
    allEoas.push(...entry.eoas)
  })

  // Count permissions from permission-overrides (contract-grouped structure)
  let permissionedFunctions = 0
  let checkedFunctions = 0

  if (permissionOverrides.contracts) {
    Object.values(permissionOverrides.contracts).forEach((contractPermissions: any) => {
      contractPermissions.functions.forEach((func: any) => {
        if (func.userClassification === 'permissioned') {
          permissionedFunctions++
          if (func.checked === true) {
            checkedFunctions++
          }
        }
      })
    })
  } else {
    console.error('permissionOverrides.contracts is undefined:', permissionOverrides)
  }

  // Count by address type (including external)
  const contractCounts = {
    contracts: 0,
    eoas: 0,
    multisigs: 0,
    external: 0
  }

  allContracts.forEach((contract) => {
    // Check if contract is explicitly marked as external in contract tags
    // Need to handle address format differences: contracts have 'eth:0x...' but tags have '0x...'
    const contractAddr = contract.address.replace('eth:', '').toLowerCase()
    const tag = contractTags.tags.find((tag: any) =>
      tag.contractAddress.toLowerCase() === contractAddr
    )
    const isExternal = tag?.isExternal === true

    if (isExternal) {
      contractCounts.external++
    } else {
      // Count by type field for non-external contracts
      switch (contract.type) {
        case 'Contract':
        case 'Diamond':
        case 'Timelock':
        case 'Token':
        case 'Unverified':
          contractCounts.contracts++
          break
        case 'EOA':
        case 'EOAPermissioned':
          contractCounts.eoas++
          break
        case 'Multisig':
          contractCounts.multisigs++
          break
        default:
          // Handle any unknown address types as contracts
          contractCounts.contracts++
          break
      }
    }
  })

  // Check for external EOAs and adjust counts
  let externalEoas = 0
  allEoas.forEach((eoa) => {
    const eoaAddress = eoa.address.replace('eth:', '').toLowerCase()
    const tag = contractTags.tags.find((tag: any) =>
      tag.contractAddress?.toLowerCase() === eoaAddress
    )
    if (tag?.isExternal === true) {
      externalEoas++
    }
  })
  console.log(externalEoas)

  // Update counts to account for external EOAs
  contractCounts.eoas = allEoas.length - externalEoas
  contractCounts.external += externalEoas

  const totalInitial = initialContracts.length
  const totalDiscovered = allContracts.length - totalInitial
  const totalNonExternal = contractCounts.contracts + contractCounts.eoas + contractCounts.multisigs


  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <h2 className="p-2 font-bold text-2xl text-blue-600">Status of the Review:</h2>
      <div className="mb-1 flex flex-col gap-2 border-l-4 border-transparent p-2 pl-1">

        <div className="ml-2 flex flex-col gap-2 text-sm">
          <div className="flex gap-8">
            <span className="font-semibold">Initial: <span className="text-blue-400">{totalInitial} contracts</span></span>
            <span className="font-semibold">Discovered: <span className="text-green-400">{totalDiscovered} addresses</span></span>
          </div>

          <div className="mt-2">
            <div className="font-semibold mb-1">Project Addresses:</div>
            <div className="ml-4 flex flex-col gap-1 text-xs">
              <span>Contracts: <span className="text-orange-400">{contractCounts.contracts}</span></span>
              <span>EOAs: <span className="text-cyan-400">{contractCounts.eoas}</span></span>
              <span>Multisigs: <span className="text-yellow-400">{contractCounts.multisigs}</span></span>
              <span className="font-semibold">Total: <span className="text-white">{totalNonExternal}</span></span>
            </div>
          </div>

          <div className="mt-2">
            <span className="font-semibold">External Addresses: <span className="text-red-400">{contractCounts.external}</span></span>
          </div>

          <div className="mt-2">
            <div className="font-semibold mb-1">Permissions:</div>
            <div className="ml-4 flex flex-col gap-1 text-xs">
              <span>Permissioned functions: <span className="text-red-400">{permissionedFunctions}</span></span>
              <span>Progress: <span className="text-orange-400">{checkedFunctions}/{permissionedFunctions} reviewed</span></span>
              <ContractsWithPermissionsTable
                projectData={projectData}
                permissionOverrides={permissionOverrides}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for contract data processing
function buildContractsList(projectData: any): Array<{ address: string; name: string; source: string }> {
  if (!projectData?.entries) return []

  const contracts: Array<{ address: string; name: string; source: string }> = []

  projectData.entries.forEach((entry: any) => {
    // Add initial contracts
    entry.initialContracts.forEach((contract: any) => {
      contracts.push({
        address: contract.address,
        name: contract.name || 'Unknown Contract',
        source: 'initial'
      })
    })

    // Add discovered contracts
    entry.discoveredContracts.forEach((contract: any) => {
      contracts.push({
        address: contract.address,
        name: contract.name || 'Unknown Contract',
        source: 'discovered'
      })
    })
  })

  return contracts
}

function calculateContractPermissions(contractAddress: string, permissionOverrides: any): { checked: number; total: number } {
  if (!permissionOverrides?.contracts?.[contractAddress]) {
    return { checked: 0, total: 0 }
  }

  const contractPermissions = permissionOverrides.contracts[contractAddress]
  let checked = 0
  let total = 0

  contractPermissions.functions.forEach((func: any) => {
    if (func.userClassification === 'permissioned') {
      total++
      if (func.checked === true) {
        checked++
      }
    }
  })

  return { checked, total }
}

function getContractDisplayName(contract: { address: string; name: string }): string {
  const shortAddress = contract.address.replace('eth:', '').slice(0, 10)
  return `${contract.name} (${shortAddress}...)`
}

function ContractsWithPermissionsTable({ projectData, permissionOverrides }: { projectData: any, permissionOverrides: any }) {
  const selectGlobal = usePanelStore((state) => state.select)

  // Get all contracts and filter to only those with permissions
  const allContracts = buildContractsList(projectData)
  const contractsWithPermissions = allContracts.filter(contract => {
    const permissions = calculateContractPermissions(contract.address, permissionOverrides)
    return permissions.total > 0
  })

  if (contractsWithPermissions.length === 0) {
    return null
  }

  const handleContractClick = (contractAddress: string) => {
    selectGlobal(contractAddress)
  }

  return (
    <div className="mt-1">
      <div className="text-xs">
        {contractsWithPermissions.map((contract) => {
          const permissions = calculateContractPermissions(contract.address, permissionOverrides)
          const isIncomplete = permissions.checked < permissions.total

          return (
            <div
              key={contract.address}
              className="cursor-pointer py-0.5 px-1 rounded hover:bg-coffee-500 transition-colors flex justify-between"
              onClick={() => handleContractClick(contract.address)}
            >
              <span
                style={{ color: isIncomplete ? '#f87171' : 'white' }}
              >
                {getContractDisplayName(contract)}
              </span>
              <span
                style={{ color: isIncomplete ? '#f87171' : 'white' }}
              >
                ({permissions.checked}/{permissions.total})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

