import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { ApiAbiEntry, PermissionOverride } from '../../../api/types'
import * as solidity from '../../../components/editor/languages/solidity'
import { IconCheckFalse } from './IconCheckFalse'
import { IconCheckTrue } from './IconCheckTrue'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconLockClosed } from './IconLockClosed'
import { IconLockOpen } from './IconLockOpen'
import { IconVoltage } from './IconVoltage'
import { IconOpen } from './IconOpen'
import { AddressDisplay } from '../panel-values/AddressDisplay'
import type { OwnerDefinition } from '../../../api/types'
import { useQuery } from '@tanstack/react-query'
import { getProject } from '../../../api/api'

interface FunctionFolderProps {
  entry: ApiAbiEntry
  contractAddress: string
  functionName: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => void
  onDescriptionUpdate: (contractAddress: string, functionName: string, description: string) => void
  onOpenInCode: (contractAddress: string, functionName: string) => void
  onOwnerDefinitionsUpdate: (contractAddress: string, functionName: string, ownerDefinitions: OwnerDefinition[]) => void
}

export function FunctionFolder({
  entry,
  contractAddress,
  functionName,
  overrides,
  onPermissionToggle,
  onCheckedToggle,
  onScoreToggle,
  onDescriptionUpdate,
  onOpenInCode,
  onOwnerDefinitionsUpdate
}: FunctionFolderProps) {
  const { project } = useParams()
  const [isOpen, setIsOpen] = useState(false)

  // Get current override data for this function
  const currentOverride = overrides.find(o =>
    o.contractAddress === contractAddress && o.functionName === functionName
  )

  // Fetch project data to get available contracts and fields
  const { data: projectData } = useQuery({
    queryKey: ['project', project],
    queryFn: () => project ? getProject(project) : null,
    enabled: !!project,
  })

  // Owner resolution using the same projectData as Fields tab
  const resolvedOwners = React.useMemo(() => {
    if (!currentOverride?.ownerDefinitions || !projectData?.entries) {
      return []
    }

    return currentOverride.ownerDefinitions.map(definition => {
      try {
        if (definition.type === 'field') {
          const { contractAddress, method } = definition.field || {}
          if (!contractAddress || !method) return null

          // Find contract in projectData (same as Fields tab)
          for (const entry of projectData.entries) {
            const allContracts = [...entry.initialContracts, ...entry.discoveredContracts]
            const contract = allContracts.find(c => c.address === contractAddress)

            if (contract?.fields) {
              const field = contract.fields.find(f => f.name === method)
              if (field?.value?.type === 'address') {
                return {
                  address: field.value.address,
                  source: definition,
                  isResolved: true
                }
              }
            }
          }
        }

        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: `Could not resolve ${definition.type}`
        }
      } catch (error) {
        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null)
  }, [currentOverride?.ownerDefinitions, projectData])

  const ownersLoading = false
  const ownersError = null

  // Extract available contracts and their fields
  const availableContracts = React.useMemo(() => {
    if (!projectData?.entries) return []

    const contracts: Array<{ address: string; name: string; source: string }> = []

    projectData.entries.forEach(entry => {
      // Add initial contracts
      entry.initialContracts
        .filter(contract => contract.type === 'Contract')
        .forEach(contract => {
          contracts.push({
            address: contract.address,
            name: contract.name || 'Unknown Contract',
            source: 'initial'
          })
        })

      // Add discovered contracts
      entry.discoveredContracts
        .filter(contract => contract.type === 'Contract')
        .forEach(contract => {
          // Avoid duplicates - check if already added as initial contract
          if (!contracts.some(c => c.address === contract.address)) {
            contracts.push({
              address: contract.address,
              name: contract.name || 'Unknown Contract',
              source: 'discovered'
            })
          }
        })
    })

    return contracts
  }, [projectData])

  // Get available fields for selected contract
  const getAvailableFields = (contractAddr: string) => {
    if (!projectData?.entries) return []

    for (const entry of projectData.entries) {
      // Check both initial and discovered contracts
      const allContracts = [...entry.initialContracts, ...entry.discoveredContracts]
      const contract = allContracts.find(c => c.address === contractAddr)

      if (contract?.fields) {
        return contract.fields
          .filter(field => field.value?.type === 'address' || field.name?.toLowerCase().includes('admin') || field.name?.toLowerCase().includes('owner') || field.name?.toLowerCase().includes('governor'))
          .map(field => ({
            name: field.name,
            description: field.description || ''
          }))
      }
    }
    return []
  }

  // Get available roles for AccessControl contracts
  const getAvailableRoles = (contractAddr: string) => {
    if (!projectData?.entries) return []

    for (const entry of projectData.entries) {
      // Check both initial and discovered contracts
      const allContracts = [...entry.initialContracts, ...entry.discoveredContracts]
      const contract = allContracts.find(c => c.address === contractAddr)

      if (contract?.fields) {
        const accessControlField = contract.fields.find(field =>
          field.handler?.type === 'accessControl' ||
          field.name?.toLowerCase().includes('accesscontrol') ||
          field.name?.toLowerCase().includes('roles')
        )

        if (accessControlField?.value?.type === 'object' && accessControlField.value.values) {
          return accessControlField.value.values.map(([roleNameValue]: [any, any]) => {
            // Handle different value types for role names
            if (typeof roleNameValue === 'string') {
              return roleNameValue
            } else if (roleNameValue?.type === 'string') {
              return roleNameValue.value
            }
            return String(roleNameValue)
          })
        }
      }
    }
    return []
  }

  const permissionStatus = currentOverride?.userClassification || 'non-permissioned'
  const checkedStatus = currentOverride?.checked || false
  const scoreStatus = currentOverride?.score || 'unscored'
  const description = currentOverride?.description || ''

  // Local state for description input with debouncing
  const [localDescription, setLocalDescription] = useState(description)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State for managing owner definitions
  const [isAddingOwner, setIsAddingOwner] = useState(false)
  const [newOwnerType, setNewOwnerType] = useState<'field' | 'role'>('field')
  const [newOwnerData, setNewOwnerData] = useState({
    // For field type
    contractAddress: contractAddress,
    method: '',
    // For role type
    accessControlContract: contractAddress,
    roleName: '',
    roleHash: ''
  })

  // Update local description when external data changes
  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  const isPermissioned = permissionStatus === 'permissioned'
  const isChecked = checkedStatus

  // Score colors
  const getScoreColor = (score: string, isHover: boolean = false) => {
    switch (score) {
      case 'low-risk': return isHover ? '#6ee7b7' : '#10b981' // green-300 : green-500
      case 'medium-risk': return isHover ? '#fcd34d' : '#f59e0b' // yellow-300 : yellow-500
      case 'high-risk': return isHover ? '#fca5a5' : '#f87171' // red-300 : red-400
      default: return isHover ? '#d1d5db' : '#9ca3af' // gray-300 : gray-400
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value
    setLocalDescription(newDescription)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to save after user stops typing (500ms delay)
    timeoutRef.current = setTimeout(() => {
      if (newDescription !== description) {
        onDescriptionUpdate(contractAddress, functionName, newDescription)
      }
    }, 500)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Owner definition management handlers
  const handleAddOwnerDefinition = () => {
    const currentDefinitions = currentOverride?.ownerDefinitions || []

    const newDefinition: OwnerDefinition = {
      type: newOwnerType,
      ...(newOwnerType === 'field' ? {
        field: {
          contractAddress: newOwnerData.contractAddress,
          method: newOwnerData.method
        }
      } : {
        role: {
          accessControlContract: newOwnerData.accessControlContract,
          roleName: newOwnerData.roleName,
          ...(newOwnerData.roleHash ? { roleHash: newOwnerData.roleHash } : {})
        }
      })
    }

    const updatedDefinitions = [...currentDefinitions, newDefinition]
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)

    // Reset form
    setIsAddingOwner(false)
    setNewOwnerData({
      contractAddress: contractAddress,
      method: '',
      accessControlContract: contractAddress,
      roleName: '',
      roleHash: ''
    })
  }

  const handleRemoveOwnerDefinition = (index: number) => {
    const currentDefinitions = currentOverride?.ownerDefinitions || []
    const updatedDefinitions = currentDefinitions.filter((_, i) => i !== index)
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)
  }

  const isAddFormValid = () => {
    if (newOwnerType === 'field') {
      return newOwnerData.contractAddress && newOwnerData.method
    } else {
      return newOwnerData.accessControlContract && newOwnerData.roleName
    }
  }

  // Get contract info (name and address) for display
  const getContractInfo = (definition: OwnerDefinition) => {
    const contractAddress = definition.type === 'field'
      ? definition.field?.contractAddress
      : definition.role?.accessControlContract

    if (!contractAddress) return null

    const contract = availableContracts.find(c => c.address === contractAddress)
    return contract ? {
      name: contract.name,
      address: contractAddress,
      source: contract.source
    } : {
      name: 'Unknown Contract',
      address: contractAddress,
      source: 'unknown'
    }
  }

  // Format owner definition with contract name and address, including resolved value
  const formatOwnerDefinitionWithContract = (definition: OwnerDefinition, contractInfo: any, resolvedOwner?: { address: string; isResolved: boolean }) => {
    console.log('formatOwnerDefinitionWithContract called!', { definition, contractInfo, resolvedOwner })
    let baseDescription = ''

    if (definition.type === 'field') {
      const method = definition.field?.method || 'unknown'
      if (contractInfo) {
        baseDescription = `${method}() on ${contractInfo.name} (${contractInfo.address.slice(0, 10)}...)`
      } else {
        baseDescription = `${method}() on ${definition.field?.contractAddress?.slice(0, 10)}...`
      }
    } else if (definition.type === 'role') {
      const roleName = definition.role?.roleName || 'unknown'
      if (contractInfo) {
        baseDescription = `${roleName} role on ${contractInfo.name} (${contractInfo.address.slice(0, 10)}...)`
      } else {
        baseDescription = `${roleName} role on ${definition.role?.accessControlContract?.slice(0, 10)}...`
      }
    } else {
      baseDescription = 'Unknown definition'
    }

    // Append resolved value if available
    if (resolvedOwner?.isResolved && resolvedOwner.address && resolvedOwner.address !== 'RESOLUTION_FAILED') {
      baseDescription += ` → ${resolvedOwner.address.slice(0, 10)}...`
    } else if (resolvedOwner) {
      // Debug: show what we have
      console.log('Debug resolvedOwner:', resolvedOwner)
    }

    return baseDescription
  }

  return (
    <div className="overflow-x-auto border-coffee-600 border-t">
      {/* Function header with icons and signature */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 font-mono text-xs bg-coffee-900 px-2 py-1 hover:bg-coffee-800"
      >
        {/* Expand/collapse chevron */}
        {isOpen ? <IconChevronDown /> : <IconChevronRight />}

        {/* Interactive icons */}
        <div className="flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
          {/* Checked Icon */}
          <button
            onClick={() => onCheckedToggle(contractAddress, functionName, isChecked)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: isChecked ? '#10b981' : '#9ca3af', // green-500 : gray-400
            }}
            title={`Click to mark as ${isChecked ? 'unchecked' : 'checked'}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isChecked ? '#6ee7b7' : '#d1d5db' // green-300 : gray-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isChecked ? '#10b981' : '#9ca3af' // green-500 : gray-400
            }}
          >
            {isChecked ? <IconCheckTrue /> : <IconCheckFalse />}
          </button>

          {/* Permission Icon */}
          <button
            onClick={() => onPermissionToggle(contractAddress, functionName, permissionStatus)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: isPermissioned ? '#f87171' : '#9ca3af', // red-400 : gray-400
            }}
            title={`Click to mark as ${isPermissioned ? 'non-permissioned' : 'permissioned'}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isPermissioned ? '#fca5a5' : '#d1d5db' // red-300 : gray-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isPermissioned ? '#f87171' : '#9ca3af' // red-400 : gray-400
            }}
          >
            {isPermissioned ? <IconLockClosed /> : <IconLockOpen />}
          </button>

          {/* Score Icon */}
          <button
            onClick={() => onScoreToggle(contractAddress, functionName, scoreStatus)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: getScoreColor(scoreStatus),
            }}
            title={`Current score: ${scoreStatus}. Click to cycle: unscored → low-risk → medium-risk → high-risk`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getScoreColor(scoreStatus, true)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getScoreColor(scoreStatus)
            }}
          >
            <IconVoltage />
          </button>

          {/* Open in Code Icon */}
          <button
            onClick={() => onOpenInCode(contractAddress, functionName)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: '#9ca3af', // gray-400
            }}
            title={`Open function in Code panel`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#d1d5db' // gray-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af' // gray-400
            }}
          >
            <IconOpen />
          </button>
        </div>

        {/* Function signature */}
        <code className="flex-1 text-left">
          {entry.value.split(/\b/).map((word, wordIndex) => (
            <span key={wordIndex} className={getClassName(word)}>
              {word}
            </span>
          ))}
          {entry.signature && (
            <span className="text-coffee-400"> // {entry.signature}</span>
          )}
        </code>
      </button>

      {/* Expanded content - description textarea and owners */}
      {isOpen && (
        <div className="bg-coffee-900 border-t border-coffee-700">
          {/* Manage Function Owners Section */}
          <div className="p-3 border-b border-coffee-700">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-coffee-300">
                Manage Function Owners 
              </label>
              <button
                onClick={() => setIsAddingOwner(!isAddingOwner)}
                className="text-xs bg-coffee-700 hover:bg-coffee-600 text-coffee-100 px-2 py-1 rounded"
              >
                {isAddingOwner ? 'Cancel' : '+ Add Owner'}
              </button>
            </div>

            {/* Current owner definitions with resolved addresses and delete buttons */}
            {currentOverride?.ownerDefinitions && currentOverride.ownerDefinitions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-coffee-400 mb-1">
                  Current Definitions ({currentOverride.ownerDefinitions.length}):
                </div>

                {ownersLoading && (
                  <div className="text-xs text-coffee-400 mb-2">Resolving owners...</div>
                )}

                {ownersError && (
                  <div className="text-xs text-red-400 mb-2">Error: {ownersError}</div>
                )}

                <div className="space-y-2">
                  {currentOverride.ownerDefinitions.map((definition, index) => {
                    const contractInfo = getContractInfo(definition)
                    const correspondingResolved = resolvedOwners.find(r => {
                      // Compare by content instead of object reference
                      if (r.source.type !== definition.type) return false

                      if (definition.type === 'field') {
                        return r.source.field?.contractAddress === definition.field?.contractAddress &&
                               r.source.field?.method === definition.field?.method
                      } else if (definition.type === 'role') {
                        return r.source.role?.accessControlContract === definition.role?.accessControlContract &&
                               r.source.role?.roleName === definition.role?.roleName
                      }

                      return false
                    })
                    console.log('Finding resolved owner for definition:', { definition, correspondingResolved, allResolvedOwners: resolvedOwners })

                    return (
                      <div key={index} className="bg-coffee-800 p-2 rounded">
                        <div className="flex items-center justify-between text-xs font-mono text-coffee-300 mb-1">
                          <span>{formatOwnerDefinitionWithContract(definition, contractInfo, correspondingResolved)}</span>
                          <button
                            onClick={() => handleRemoveOwnerDefinition(index)}
                            className="text-red-400 hover:text-red-300 ml-2"
                            title="Remove this owner definition"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Show full resolved address with AddressDisplay for additional context */}
                        {!ownersLoading && correspondingResolved && correspondingResolved.isResolved && (
                          <div className="ml-2 mt-1">
                            <div className="text-xs text-coffee-400 mb-1">Resolves to:</div>
                            <AddressDisplay
                              simplified
                              value={{
                                type: 'address',
                                address: correspondingResolved.address,
                                addressType: 'Unknown',
                              }}
                            />
                          </div>
                        )}

                        {/* Show resolution error */}
                        {!ownersLoading && correspondingResolved && !correspondingResolved.isResolved && (
                          <div className="text-red-400 text-xs ml-2 mt-1">
                            Error: {correspondingResolved.error}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add new owner definition form */}
            {isAddingOwner && (
              <div className="bg-coffee-800 p-3 rounded">
                <div className="mb-3">
                  <label className="block text-xs text-coffee-300 mb-1">Owner Type:</label>
                  <select
                    value={newOwnerType}
                    onChange={(e) => setNewOwnerType(e.target.value as 'field' | 'role')}
                    className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                  >
                    <option value="field">Field (Contract Method)</option>
                    <option value="role">Role (Access Control)</option>
                  </select>
                </div>

                {newOwnerType === 'field' && (
                  <>
                    <div className="mb-2">
                      <label className="block text-xs text-coffee-300 mb-1">Contract:</label>
                      <select
                        value={newOwnerData.contractAddress}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, contractAddress: e.target.value, method: '' }))}
                        className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      >
                        <option value="">Select a contract...</option>
                        {availableContracts.map((contract) => (
                          <option key={contract.address} value={contract.address}>
                            {contract.name} ({contract.address.slice(0, 10)}...) [{contract.source}]
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-coffee-300 mb-1">Field:</label>
                      <select
                        value={newOwnerData.method}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, method: e.target.value }))}
                        disabled={!newOwnerData.contractAddress}
                        className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded disabled:opacity-50"
                      >
                        <option value="">Select a field...</option>
                        {newOwnerData.contractAddress && getAvailableFields(newOwnerData.contractAddress).map((field) => (
                          <option key={field.name} value={field.name}>
                            {field.name} {field.description && `- ${field.description}`}
                          </option>
                        ))}
                      </select>
                      {newOwnerData.contractAddress && getAvailableFields(newOwnerData.contractAddress).length === 0 && (
                        <div className="text-xs text-coffee-400 mt-1">
                          No address fields found in this contract
                        </div>
                      )}
                    </div>
                  </>
                )}

                {newOwnerType === 'role' && (
                  <>
                    <div className="mb-2">
                      <label className="block text-xs text-coffee-300 mb-1">Access Control Contract:</label>
                      <select
                        value={newOwnerData.accessControlContract}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, accessControlContract: e.target.value, roleName: '', roleHash: '' }))}
                        className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      >
                        <option value="">Select a contract...</option>
                        {availableContracts.map((contract) => (
                          <option key={contract.address} value={contract.address}>
                            {contract.name} ({contract.address.slice(0, 10)}...) [{contract.source}]
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-coffee-300 mb-1">Role:</label>
                      <select
                        value={newOwnerData.roleName}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, roleName: e.target.value }))}
                        disabled={!newOwnerData.accessControlContract}
                        className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded disabled:opacity-50"
                      >
                        <option value="">Select a role...</option>
                        {newOwnerData.accessControlContract && getAvailableRoles(newOwnerData.accessControlContract).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {newOwnerData.accessControlContract && getAvailableRoles(newOwnerData.accessControlContract).length === 0 && (
                        <div className="text-xs text-coffee-400 mt-1">
                          No AccessControl roles found in this contract
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-coffee-300 mb-1">Role Hash (auto-filled):</label>
                      <input
                        type="text"
                        value={newOwnerData.roleHash}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, roleHash: e.target.value }))}
                        placeholder="Will be auto-filled from role name"
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                        readOnly
                      />
                      <div className="text-xs text-coffee-400 mt-1">
                        Role hash is automatically determined from the discovered role data
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={handleAddOwnerDefinition}
                  disabled={!isAddFormValid()}
                  className="text-xs bg-green-600 hover:bg-green-500 disabled:bg-coffee-600 disabled:text-coffee-400 text-white px-3 py-1 rounded"
                >
                  Add Owner Definition
                </button>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="p-3">
            <label className="block text-xs text-coffee-300 mb-2">
              Function Description
            </label>
            <textarea
              value={localDescription}
              onChange={handleDescriptionChange}
              placeholder="Add a description for this function..."
              className="w-full h-20 px-2 py-1 text-xs font-mono bg-coffee-800 text-coffee-100 border border-coffee-600 rounded resize-none focus:outline-none focus:border-coffee-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function getClassName(word: string) {
  if (solidity.keywords.includes(word)) {
    return 'text-aux-orange'
  }
  if (solidity.typeNames.includes(word)) {
    return 'text-aux-red'
  }
  if (/\(|\)|,/.test(word)) {
    return 'text-coffee-400'
  }
}