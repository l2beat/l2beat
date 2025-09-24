import React from 'react'
import type { OwnerDefinition, ApiAddressType } from '../../../api/types'

interface ResultsSectionProps {
  projectData: any
  permissionOverrides: any
  contractTags: any
}

interface UpgradeabilityStats {
  highRisk: OwnerTypeStats
  mediumRisk: OwnerTypeStats
  lowRisk: OwnerTypeStats
}

interface OwnerTypeStats {
  totalFunctions: number
  contracts: number
  eoas: number
  multisigs: number
}

export function ResultsSection({ projectData, permissionOverrides, contractTags }: ResultsSectionProps) {
  if (!projectData || !permissionOverrides) {
    return null
  }

  const upgradeabilityStats = calculateUpgradeabilityStats(projectData, permissionOverrides)

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <h2 className="p-2 font-bold text-2xl text-blue-600">Results:</h2>
      <div className="mb-1 flex flex-col gap-4 border-l-4 border-transparent p-2 pl-1">

        {/* Upgradeability Section */}
        <UpgradeabilitySection stats={upgradeabilityStats} />

        {/* Exit Window Section */}
        <ExitWindowSection />

        {/* Autonomy Section */}
        <AutonomySection />

      </div>
    </div>
  )
}

function UpgradeabilitySection({ stats }: { stats: UpgradeabilityStats }) {
  return (
    <div>
      <h3 className="font-semibold text-lg text-orange-400 mb-2">Upgradeability</h3>
      <div className="ml-4 flex flex-col gap-3 text-sm">

        <RiskLevelStats
          title="High Impact Functions"
          stats={stats.highRisk}
          titleColor="text-red-400"
        />

        <RiskLevelStats
          title="Medium Impact Functions"
          stats={stats.mediumRisk}
          titleColor="text-yellow-400"
        />

        <RiskLevelStats
          title="Low Impact Functions"
          stats={stats.lowRisk}
          titleColor="text-green-400"
        />

      </div>
    </div>
  )
}

function RiskLevelStats({ title, stats, titleColor }: {
  title: string
  stats: OwnerTypeStats
  titleColor: string
}) {
  if (stats.totalFunctions === 0) {
    return (
      <div>
        <span className={`font-semibold ${titleColor}`}>{title}: </span>
        <span className="text-coffee-300">No functions analyzed</span>
      </div>
    )
  }

  return (
    <div>
      <div className={`font-semibold ${titleColor} mb-1`}>
        {title}: {stats.totalFunctions} functions
      </div>
      <div className="ml-4 text-xs">
        <span>Owners are: </span>
        <span style={{ color: '#3ce637ff' }}>{stats.contracts} contracts</span>
        <span>, </span>
        <span style={{ color: '#facc15' }}>{stats.multisigs} Multisigs</span>
        <span>, </span>
        <span style={{ color: '#ee2222ff' }}>{stats.eoas} EOAs</span>
      </div>
    </div>
  )
}

function ExitWindowSection() {
  return (
    <div>
      <h3 className="font-semibold text-lg text-purple-400 mb-2">Exit Window</h3>
      <div className="ml-4 text-sm text-coffee-300">
        🚧 Coming soon! This section will analyze delays and timelocks on critical functions.
      </div>
    </div>
  )
}

function AutonomySection() {
  return (
    <div>
      <h3 className="font-semibold text-lg text-cyan-400 mb-2">Autonomy</h3>
      <div className="ml-4 text-sm text-coffee-300">
        🚧 Coming soon! This section will evaluate the risk coming from external contracts.
      </div>
    </div>
  )
}

function calculateUpgradeabilityStats(
  projectData: any,
  permissionOverrides: any
): UpgradeabilityStats {
  const stats: UpgradeabilityStats = {
    highRisk: { totalFunctions: 0, contracts: 0, eoas: 0, multisigs: 0 },
    mediumRisk: { totalFunctions: 0, contracts: 0, eoas: 0, multisigs: 0 },
    lowRisk: { totalFunctions: 0, contracts: 0, eoas: 0, multisigs: 0 }
  }

  if (!permissionOverrides.contracts) {
    return stats
  }

  // Build a lookup map for all addresses in the project
  const addressTypeMap = new Map<string, ApiAddressType>()

  // Add all contracts and EOAs to the lookup map
  projectData.entries?.forEach((entry: any) => {
    // Add initial contracts
    entry.initialContracts?.forEach((contract: any) => {
      const normalizedAddr = contract.address.replace('eth:', '').toLowerCase()
      addressTypeMap.set(normalizedAddr, contract.type)
    })

    // Add discovered contracts
    entry.discoveredContracts?.forEach((contract: any) => {
      const normalizedAddr = contract.address.replace('eth:', '').toLowerCase()
      addressTypeMap.set(normalizedAddr, contract.type)
    })

    // Add EOAs
    entry.eoas?.forEach((eoa: any) => {
      const normalizedAddr = eoa.address.replace('eth:', '').toLowerCase()
      addressTypeMap.set(normalizedAddr, eoa.type || 'EOA')
    })
  })

  // Process each contract's functions
  Object.entries(permissionOverrides.contracts).forEach(([, contractPermissions]: [string, any]) => {
    contractPermissions.functions.forEach((func: any) => {
      if (func.userClassification === 'permissioned' && func.score && func.score !== 'unscored') {
        // Determine which risk category this function belongs to
        let targetStats: OwnerTypeStats
        switch (func.score) {
          case 'high-risk':
            targetStats = stats.highRisk
            break
          case 'medium-risk':
            targetStats = stats.mediumRisk
            break
          case 'low-risk':
            targetStats = stats.lowRisk
            break
          default:
            return // Skip unscored functions
        }

        targetStats.totalFunctions++

        // Resolve owners for this function
        if (func.ownerDefinitions && func.ownerDefinitions.length > 0) {
          try {
            // Note: This is a simplified version - in a real implementation,
            // we'd need to make this async and handle the file system access properly
            const ownerAddresses = getOwnerAddressesFromDefinitions(func.ownerDefinitions, projectData)

            ownerAddresses.forEach(address => {
              const normalizedAddr = address.replace('eth:', '').toLowerCase()
              const addressType = addressTypeMap.get(normalizedAddr)

              if (addressType) {
                switch (addressType) {
                  case 'Contract':
                  case 'Diamond':
                  case 'Timelock':
                  case 'Token':
                  case 'Unverified':
                    targetStats.contracts++
                    break
                  case 'EOA':
                  case 'EOAPermissioned':
                    targetStats.eoas++
                    break
                  case 'Multisig':
                    targetStats.multisigs++
                    break
                }
              }
            })
          } catch (error) {
            console.warn('Error resolving owners for function:', func.functionName, error)
          }
        }
      }
    })
  })

  return stats
}

// Simplified owner resolution that works with the available data
// In a full implementation, this would use the backend API
function getOwnerAddressesFromDefinitions(
  ownerDefinitions: OwnerDefinition[],
  projectData: any
): string[] {
  const addresses: string[] = []

  // For now, we'll extract addresses from field-type owner definitions
  // by looking at the project data directly
  ownerDefinitions.forEach(definition => {
    if (definition.type === 'field' && definition.field) {
      const { contractAddress, method } = definition.field

      // Find the contract in project data
      projectData.entries?.forEach((entry: any) => {
        const allContracts = [...(entry.initialContracts || []), ...(entry.discoveredContracts || [])]
        const contract = allContracts.find((c: any) => c.address === contractAddress)

        if (contract && contract.fields) {
          const field = contract.fields.find((f: any) => f.name === method)
          if (field && field.value) {
            // Extract address(es) from the field value
            if (field.value.type === 'address') {
              addresses.push(field.value.address)
            } else if (field.value.type === 'array' && field.value.values) {
              field.value.values.forEach((val: any) => {
                if (val.type === 'address') {
                  addresses.push(val.address)
                }
              })
            }
          }
        }
      })
    }
  })

  return addresses
}