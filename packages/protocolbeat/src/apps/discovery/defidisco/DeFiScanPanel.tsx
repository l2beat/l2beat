import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProject, getFunctions } from '../../../api/api'
import { useContractTags } from '../../../hooks/useContractTags'
import { Checkbox } from '../../../components/Checkbox'
import { usePanelStore } from '../store/panel-store'
import { ResultsSection } from './ResultsSection'
import { UIContractDataAccess, resolvePathExpression } from './ownerResolution'
import { V2ScoringSection } from '../../../defidisco/V2ScoringSection'
import { FundsSection } from './FundsSection'

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
  const { data: functions } = useQuery({
    queryKey: ['functions', project],
    queryFn: () => project ? getFunctions(project) : null,
    enabled: !!project,
  })

  if (!response.data || !contractTags || !functions) {
    return <div className="flex h-full w-full items-center justify-center">Loading...</div>
  }

  // Filter out external contracts from functions data
  const filteredFunctions = {
    ...functions,
    contracts: Object.fromEntries(
      Object.entries(functions.contracts || {}).filter(([contractAddress, _]) => {
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
        <V2ScoringSection project={project} />
        <FundsSection project={project} />
        <StatusOfReviewSection
          projectData={response.data}
          contractTags={contractTags}
          functions={filteredFunctions}
        />
        <ResultsSection
          projectData={response.data}
          functions={filteredFunctions}
          contractTags={contractTags}
        />
      </div>
    </div>
  )
}

function StatusOfReviewSection({ projectData, contractTags, functions }: { projectData: any, contractTags: any, functions: any }) {
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

  // Count permissions from functions data (contract-grouped structure)
  // Note: Permissions can be stored under implementation addresses for proxy contracts
  let permissionedFunctions = 0
  let checkedFunctions = 0

  if (functions.contracts) {
    Object.values(functions.contracts).forEach((contractPermissions: any) => {
      contractPermissions.functions.forEach((func: any) => {
        if (func.isPermissioned === true) {
          permissionedFunctions++
          if (func.checked === true) {
            checkedFunctions++
          }
        }
      })
    })
  } else {
    console.error('functions.contracts is undefined:', functions)
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
    // Both contracts and tags use 'eth:0x...' format - just normalize to lowercase
    const contractAddr = contract.address.toLowerCase()
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
                functions={functions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for contract data processing
function resolveImplementationAddress(contractAddress: string, projectData: any): string {
  // Try to find the contract entry in projectData
  for (const entry of projectData.entries || []) {
    if (entry.address === contractAddress) {
      // If this is a proxy with an implementation, return the implementation address
      if (entry.values?.$implementation) {
        return entry.values.$implementation
      }
      break
    }
  }
  // Return original address if no implementation found
  return contractAddress
}

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

function getContractDisplayName(contract: { address: string; name: string }): string {
  const shortAddress = contract.address.replace('eth:', '').slice(0, 10)
  return `${contract.name} (${shortAddress}...)`
}

function findProxyForImplementation(implementationAddress: string, projectData: any): string | null {
  // Find a proxy that uses this implementation address
  for (const entry of projectData.entries || []) {
    // Check initialContracts
    for (const contract of entry.initialContracts || []) {
      const implField = contract.fields?.find((f: any) => f.name === '$implementation')
      if (implField?.value?.address === implementationAddress) {
        return contract.address
      }
    }
    // Check discoveredContracts
    for (const contract of entry.discoveredContracts || []) {
      const implField = contract.fields?.find((f: any) => f.name === '$implementation')
      if (implField?.value?.address === implementationAddress) {
        return contract.address
      }
    }
  }
  return null
}

function getImplementationAddress(proxyAddress: string, projectData: any): string | null {
  // Find the implementation address for a given proxy address
  for (const entry of projectData.entries || []) {
    // Check initialContracts
    for (const contract of entry.initialContracts || []) {
      if (contract.address === proxyAddress) {
        const implField = contract.fields?.find((f: any) => f.name === '$implementation')
        return implField?.value?.address || null
      }
    }
    // Check discoveredContracts
    for (const contract of entry.discoveredContracts || []) {
      if (contract.address === proxyAddress) {
        const implField = contract.fields?.find((f: any) => f.name === '$implementation')
        return implField?.value?.address || null
      }
    }
  }
  return null
}

function buildContractsMap(projectData: any): Map<string, { address: string; name: string }> {
  // Build a map of address -> contract info for O(1) lookups
  const map = new Map<string, { address: string; name: string }>()
  const allContracts = buildContractsList(projectData)

  allContracts.forEach(contract => {
    map.set(contract.address, { address: contract.address, name: contract.name })
  })

  return map
}

function ContractsWithPermissionsTable({ projectData, functions }: { projectData: any, functions: any }) {
  const selectGlobal = usePanelStore((state) => state.select)

  // Build list of contracts with permissions
  // Permissions can be stored under proxy addresses, implementation addresses, or both
  const contractsMap = new Map<string, {
    address: string
    name: string
    permissions: { checked: number; total: number }
    owners: Set<string>
  }>()

  // Create data access for owner resolution
  const allContracts = projectData?.entries ?
    projectData.entries.flatMap((e: any) => [...e.initialContracts, ...e.discoveredContracts]) : []
  const dataAccess = new UIContractDataAccess(allContracts)

  if (functions.contracts) {
    // Build contract name lookup map
    const contractInfoMap = buildContractsMap(projectData)

    // First pass: Build a map of implementation -> proxy relationships
    const implToProxy = new Map<string, string>()
    Object.keys(functions.contracts).forEach((addr) => {
      const implAddr = getImplementationAddress(addr, projectData)
      if (implAddr && functions.contracts[implAddr]) {
        implToProxy.set(implAddr, addr)
      }
    })

    // Second pass: Process each address and merge permissions
    const processed = new Set<string>()

    Object.keys(functions.contracts).forEach((permissionAddress) => {
      if (processed.has(permissionAddress)) return

      // Calculate permissions and collect owners for this address
      const calcPermsAndOwners = (addr: string) => {
        let checked = 0
        let total = 0
        const owners = new Set<string>()
        const perms = functions.contracts[addr]
        if (perms) {
          perms.functions.forEach((func: any) => {
            if (func.isPermissioned === true) {
              total++
              if (func.checked === true) {
                checked++
              }
              // Resolve owners for this function
              if (func.ownerDefinitions && func.ownerDefinitions.length > 0) {
                func.ownerDefinitions.forEach((ownerDef: any) => {
                  const result = resolvePathExpression(dataAccess, addr, ownerDef.path)
                  if (!result.error && result.addresses.length > 0) {
                    result.addresses.forEach((ownerAddr: string) => owners.add(ownerAddr))
                  }
                })
              }
            }
          })
        }
        return { checked, total, owners }
      }

      // Check if this address is an implementation with a proxy
      const proxyAddr = implToProxy.get(permissionAddress)

      if (proxyAddr) {
        // This is an implementation - merge with proxy
        const implData = calcPermsAndOwners(permissionAddress)
        const proxyData = calcPermsAndOwners(proxyAddr)

        if (implData.total === 0 && proxyData.total === 0) return

        processed.add(permissionAddress)
        processed.add(proxyAddr)

        // Merge owners from both
        const allOwners = new Set([...implData.owners, ...proxyData.owners])

        // Use proxy's name and address
        const contractInfo = contractInfoMap.get(proxyAddr) || { address: proxyAddr, name: 'Unknown Contract' }
        contractsMap.set(proxyAddr, {
          address: proxyAddr,
          name: contractInfo.name,
          permissions: {
            checked: implData.checked + proxyData.checked,
            total: implData.total + proxyData.total
          },
          owners: allOwners
        })
      } else {
        // This is either a proxy or standalone contract
        const data = calcPermsAndOwners(permissionAddress)
        if (data.total === 0) return

        // Check if it's a proxy with an implementation
        const implAddr = getImplementationAddress(permissionAddress, projectData)
        if (implAddr && functions.contracts[implAddr]) {
          // Already handled in the implementation case above
          return
        }

        processed.add(permissionAddress)

        // For implementation-only contracts (no proxy), try to show proxy name if it exists
        const proxyForImpl = findProxyForImplementation(permissionAddress, projectData)
        const displayAddress = proxyForImpl || permissionAddress
        const contractInfo = contractInfoMap.get(displayAddress) || { address: displayAddress, name: 'Unknown Contract' }

        contractsMap.set(displayAddress, {
          address: displayAddress,
          name: contractInfo.name,
          permissions: data,
          owners: data.owners
        })
      }
    })
  }

  const contractsWithPermissions = Array.from(contractsMap.values())

  if (contractsWithPermissions.length === 0) {
    return null
  }

  const handleContractClick = (contractAddress: string) => {
    selectGlobal(contractAddress)
  }

  // Helper to get contract name from address
  const getContractName = (address: string): string => {
    const contractInfoMap = buildContractsMap(projectData)
    const info = contractInfoMap.get(address)
    if (info) return info.name
    return address.slice(0, 10) + '...'
  }

  return (
    <div className="mt-1">
      <div className="text-xs">
        {contractsWithPermissions.map((contract) => {
          const isIncomplete = contract.permissions.checked < contract.permissions.total
          const ownerCount = contract.owners.size
          const ownersList = Array.from(contract.owners)

          return (
            <div
              key={contract.address}
              className="cursor-pointer py-0.5 px-1 rounded hover:bg-coffee-500 transition-colors"
              onClick={() => handleContractClick(contract.address)}
            >
              <div className="flex justify-between">
                <span
                  style={{ color: isIncomplete ? '#f87171' : 'white' }}
                >
                  {getContractDisplayName(contract)}
                </span>
                <span
                  style={{ color: isIncomplete ? '#f87171' : 'white' }}
                >
                  ({contract.permissions.checked}/{contract.permissions.total})
                </span>
              </div>
              {ownerCount > 0 && (
                <div className="text-[10px] text-gray-400 mt-0.5 ml-2">
                  Owners: {ownersList.slice(0, 3).map(addr => getContractName(addr)).join(', ')}
                  {ownerCount > 3 && ` +${ownerCount - 3} more`}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

