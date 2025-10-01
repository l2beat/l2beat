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
  onDelayUpdate: (contractAddress: string, functionName: string, delay?: { contractAddress: string; fieldName: string }) => void
}

// Helper function to navigate data path in UI (mirrors backend logic)
function navigateDataPathInUI(contract: any, dataPath: string): string[] {
  // Special case: $self means the source contract itself is the owner
  if (dataPath === '$self') {
    return [contract.address]
  }

  // Check for array access pattern: fieldName[index]
  const arrayMatch = dataPath.match(/^(.+?)\[(\d+)\]$/)

  if (arrayMatch) {
    const [, fieldName, indexStr] = arrayMatch
    const index = parseInt(indexStr!, 10)

    const field = contract.fields?.find((f: any) => f.name === fieldName)
    if (!field) throw new Error(`Field ${fieldName} not found`)

    if (field.value.type !== 'array') {
      throw new Error(`Field ${fieldName} is not an array`)
    }

    const arrayValue = field.value.values
    if (index >= arrayValue.length) {
      throw new Error(`Index ${index} out of bounds`)
    }

    const element = arrayValue[index]
    if (element.type === 'address') {
      return [element.address]
    }

    throw new Error(`Array element is not an address`)
  }

  // Simple field access
  const field = contract.fields?.find((f: any) => f.name === dataPath)
  if (!field) throw new Error(`Field ${dataPath} not found`)

  // Single address
  if (field.value.type === 'address') {
    return [field.value.address]
  }

  // Array of addresses
  if (field.value.type === 'array') {
    const addresses: string[] = []
    for (const element of field.value.values) {
      if (element.type === 'address') {
        addresses.push(element.address)
      }
    }
    if (addresses.length > 0) {
      return addresses
    }
  }

  throw new Error(`Could not resolve ${dataPath} to address(es)`)
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
  onOwnerDefinitionsUpdate,
  onDelayUpdate
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

  // Owner resolution using the new two-step approach
  const resolvedOwners = React.useMemo(() => {
    if (!currentOverride?.ownerDefinitions || !projectData?.entries) {
      return []
    }

    return currentOverride.ownerDefinitions.map(definition => {
      try {
        // Step 1: Get current contract
        const currentContract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
          .find(c => c.address === contractAddress)

        if (!currentContract) {
          throw new Error('Current contract not found')
        }

        // Step 2: Resolve source field to get source address
        const sourceField = currentContract.fields?.find(f => f.name === definition.sourceField)
        if (!sourceField || sourceField.value.type !== 'address') {
          throw new Error(`Source field ${definition.sourceField} not found or not an address`)
        }

        const sourceAddress = sourceField.value.address

        // Step 3: Find source contract
        const sourceContract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
          .find(c => c.address === sourceAddress)

        if (!sourceContract) {
          throw new Error(`Source contract ${sourceAddress} not found`)
        }

        // Step 4: Navigate dataPath to get owner address(es)
        const ownerAddresses = navigateDataPathInUI(sourceContract, definition.dataPath)

        // Return first resolved address
        if (ownerAddresses.length > 0) {
          return {
            address: ownerAddresses[0]!,
            source: definition,
            isResolved: true
          }
        }

        throw new Error(`No addresses found at path ${definition.dataPath}`)
      } catch (error) {
        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
  }, [currentOverride?.ownerDefinitions, projectData, contractAddress])

  const ownersLoading = false
  const ownersError = null

  // Resolve delay value from projectData
  const resolvedDelay = React.useMemo(() => {
    if (!currentOverride?.delay || !projectData?.entries) {
      return null
    }

    const delayRef = currentOverride.delay

    try {
      for (const entry of projectData.entries) {
        const allContracts = [...entry.initialContracts, ...entry.discoveredContracts]
        const contract = allContracts.find(c => c.address === delayRef.contractAddress)

        if (contract?.fields) {
          const field = contract.fields.find(f => f.name === delayRef.fieldName)
          if (field?.value?.type === 'number') {
            const seconds = parseInt(field.value.value, 10)
            if (!isNaN(seconds)) {
              return {
                seconds,
                isResolved: true
              }
            }
          }
        }
      }

      return {
        seconds: 0,
        isResolved: false,
        error: 'Could not resolve delay field'
      }
    } catch (error) {
      return {
        seconds: 0,
        isResolved: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [currentOverride?.delay, projectData])

  // State for managing owner definitions (new two-step approach) - MUST BE BEFORE HOOKS THAT USE IT
  const [isAddingOwner, setIsAddingOwner] = useState(false)
  const [newOwnerData, setNewOwnerData] = useState({
    sourceField: '',        // Step 1: Field in current contract
    dataPath: ''            // Step 2: Path in resolved source
  })
  const [resolvedSourceAddress, setResolvedSourceAddress] = useState<string | null>(null)

  // Get source fields from CURRENT contract (Step 1)
  const getSourceFields = React.useMemo(() => {
    if (!projectData?.entries) return []

    const currentContract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
      .find(c => c.address === contractAddress)

    if (!currentContract?.fields) return []

    // Return only address-type fields
    return currentContract.fields
      .filter(field => field.value.type === 'address')
      .map(field => ({
        name: field.name,
        address: field.value.address,
        description: field.description || ''
      }))
  }, [projectData, contractAddress])

  // When source field changes, resolve the source address
  React.useEffect(() => {
    if (newOwnerData.sourceField && projectData?.entries) {
      const currentContract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
        .find(c => c.address === contractAddress)

      const sourceField = currentContract?.fields?.find(f => f.name === newOwnerData.sourceField)

      if (sourceField?.value.type === 'address') {
        setResolvedSourceAddress(sourceField.value.address)
      } else {
        setResolvedSourceAddress(null)
      }
    } else {
      setResolvedSourceAddress(null)
    }
  }, [newOwnerData.sourceField, projectData, contractAddress])

  // Get available data paths from resolved source contract (Step 2)
  const getAvailableDataPaths = React.useMemo(() => {
    if (!resolvedSourceAddress || !projectData?.entries) return []

    const sourceContract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
      .find(c => c.address === resolvedSourceAddress)

    if (!sourceContract?.fields) return []

    const dataPaths: Array<{ path: string; description: string; type: string }> = []

    for (const field of sourceContract.fields) {
      // Single address fields
      if (field.value.type === 'address') {
        dataPaths.push({
          path: field.name,
          description: field.description || `Address field: ${field.name}`,
          type: 'address'
        })
      }

      // Array of addresses
      if (field.value.type === 'array') {
        const arrayValue = field.value.values
        for (let i = 0; i < Math.min(arrayValue.length, 10); i++) {
          if (arrayValue[i]?.type === 'address') {
            dataPaths.push({
              path: `${field.name}[${i}]`,
              description: `${field.name}[${i}] → ${arrayValue[i].address.slice(0, 10)}...`,
              type: 'array-element'
            })
          }
        }
      }
    }

    return dataPaths
  }, [resolvedSourceAddress, projectData])

  // Get available contracts for delay selection
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
          // Avoid duplicates
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

  // Get available numeric fields for delay (fields that contain time/delay or are numeric)
  const getAvailableDelayFields = (contractAddr: string) => {
    if (!projectData?.entries) return []

    for (const entry of projectData.entries) {
      // Check both initial and discovered contracts
      const allContracts = [...entry.initialContracts, ...entry.discoveredContracts]
      const contract = allContracts.find(c => c.address === contractAddr)

      if (contract?.fields) {
        return contract.fields
          .filter(field => {
            const isNumeric = field.value?.type === 'number'
            const hasDelayName = field.name?.toLowerCase().includes('delay') ||
                                 field.name?.toLowerCase().includes('timelock') ||
                                 field.name?.toLowerCase().includes('period') ||
                                 field.name?.toLowerCase().includes('duration')
            return isNumeric && (hasDelayName || true) // Accept all numeric fields, but prefer delay-related ones
          })
          .map(field => ({
            name: field.name,
            description: field.description || '',
            value: field.value?.type === 'number' ? field.value.value : ''
          }))
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

  // State for managing delay field
  const [isSettingDelay, setIsSettingDelay] = useState(false)
  const [newDelayData, setNewDelayData] = useState({
    contractAddress: contractAddress,
    fieldName: ''
  })

  // Update local description when external data changes
  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  const isPermissioned = permissionStatus === 'permissioned'
  const isChecked = checkedStatus

  // Validation for checking functionality
  const isCheckingAllowed = () => {
    // Non-permissioned functions can always be checked
    if (!isPermissioned) {
      return true
    }

    // For permissioned functions, require all fields to be completed
    const hasValidScore = scoreStatus !== 'unscored'
    const hasDescription = description.trim().length > 0
    const hasOwnerDefinitions = (currentOverride?.ownerDefinitions || []).length > 0
    return hasValidScore && hasDescription && hasOwnerDefinitions
  }

  const canCheck = isCheckingAllowed()

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
      sourceField: newOwnerData.sourceField,
      dataPath: newOwnerData.dataPath
    }

    const updatedDefinitions = [...currentDefinitions, newDefinition]
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)

    // Reset form
    setIsAddingOwner(false)
    setNewOwnerData({
      sourceField: '',
      dataPath: ''
    })
    setResolvedSourceAddress(null)
  }

  const handleRemoveOwnerDefinition = (index: number) => {
    const currentDefinitions = currentOverride?.ownerDefinitions || []
    const updatedDefinitions = currentDefinitions.filter((_, i) => i !== index)
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)
  }

  // Delay management handlers
  const handleSetDelay = () => {
    if (newDelayData.contractAddress && newDelayData.fieldName) {
      onDelayUpdate(contractAddress, functionName, {
        contractAddress: newDelayData.contractAddress,
        fieldName: newDelayData.fieldName
      })
      setIsSettingDelay(false)
      setNewDelayData({
        contractAddress: contractAddress,
        fieldName: ''
      })
    }
  }

  const handleClearDelay = () => {
    onDelayUpdate(contractAddress, functionName, undefined)
  }

  const isAddFormValid = () => {
    return newOwnerData.sourceField && newOwnerData.dataPath
  }

  // Format owner definition with resolved value
  const formatOwnerDefinition = (definition: OwnerDefinition, resolvedOwner?: { address: string; isResolved: boolean }) => {
    // Format the dataPath in a user-friendly way
    const dataPathDisplay = definition.dataPath === '$self' ? '(itself)' : definition.dataPath
    let baseDescription = `${definition.sourceField} → ${dataPathDisplay}`

    // Append resolved value if available
    if (resolvedOwner?.isResolved && resolvedOwner.address && resolvedOwner.address !== 'RESOLUTION_FAILED') {
      baseDescription += ` = ${resolvedOwner.address.slice(0, 10)}...`
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
            onClick={() => {
              if (canCheck || isChecked) {
                onCheckedToggle(contractAddress, functionName, isChecked)
              }
            }}
            disabled={!canCheck && !isChecked}
            className={`inline-block transition-colors ${
              canCheck || isChecked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
            style={{
              color: isChecked
                ? '#10b981'
                : canCheck
                  ? '#9ca3af'
                  : '#6b7280', // green-500 : gray-400 : gray-500 (disabled)
            }}
            title={
              canCheck || isChecked
                ? `Click to mark as ${isChecked ? 'unchecked' : 'checked'}`
                : 'Complete description, score, and add owners before checking'
            }
            onMouseEnter={(e) => {
              if (canCheck || isChecked) {
                e.currentTarget.style.color = isChecked ? '#6ee7b7' : '#d1d5db' // green-300 : gray-300
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isChecked
                ? '#10b981'
                : canCheck
                  ? '#9ca3af'
                  : '#6b7280' // green-500 : gray-400 : gray-500 (disabled)
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

          {/* Delay Indicator Icon */}
          {currentOverride?.delay && resolvedDelay?.isResolved && (
            <span
              className="inline-block text-xs"
              style={{
                color: '#3b82f6', // blue-500
              }}
              title={`Delay: ${resolvedDelay.seconds} seconds`}
            >
              ⏱️
            </span>
          )}
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
                    const correspondingResolved = resolvedOwners[index]

                    return (
                      <div key={index} className="bg-coffee-800 p-2 rounded">
                        <div className="flex items-center justify-between text-xs font-mono text-coffee-300 mb-1">
                          <span>{formatOwnerDefinition(definition, correspondingResolved)}</span>
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

            {/* Add new owner definition form - TWO-STEP APPROACH */}
            {isAddingOwner && (
              <div className="bg-coffee-800 p-3 rounded">
                <div className="text-xs text-coffee-400 mb-3">
                  Step 1: Select source field from current contract → Step 2: Select data path from resolved source
                </div>

                {/* Step 1: Source Field from Current Contract */}
                <div className="mb-3">
                  <label className="block text-xs text-coffee-300 mb-1">
                    Step 1: Source Field (from current contract)
                  </label>
                  <select
                    value={newOwnerData.sourceField}
                    onChange={(e) => setNewOwnerData(prev => ({ ...prev, sourceField: e.target.value, dataPath: '' }))}
                    className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                  >
                    <option value="">Select a source field...</option>
                    {getSourceFields.map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.name} → {field.address.slice(0, 10)}... {field.description && `(${field.description})`}
                      </option>
                    ))}
                  </select>
                  {getSourceFields.length === 0 && (
                    <div className="text-xs text-coffee-400 mt-1">
                      No address fields found in current contract
                    </div>
                  )}
                </div>

                {/* Step 2: Data Path from Resolved Source */}
                {resolvedSourceAddress && (
                  <div className="mb-3">
                    <label className="block text-xs text-coffee-300 mb-1">
                      Step 2: Data Path (from {resolvedSourceAddress.slice(0, 10)}...)
                    </label>
                    <select
                      value={newOwnerData.dataPath}
                      onChange={(e) => setNewOwnerData(prev => ({ ...prev, dataPath: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                    >
                      <option value="">Select a data path...</option>
                      <option value="$self">None (source is the owner)</option>
                      {getAvailableDataPaths.map((path) => (
                        <option key={path.path} value={path.path}>
                          {path.description}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-coffee-400 mt-1">
                      {getAvailableDataPaths.length === 0
                        ? 'No additional address data found in source. Select "None" if source is the owner.'
                        : 'Select "None" if the source address itself is the permission owner'}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddOwnerDefinition}
                  disabled={!isAddFormValid()}
                  className="w-full text-xs bg-green-600 hover:bg-green-500 disabled:bg-coffee-600 disabled:text-coffee-400 text-white px-3 py-1 rounded"
                >
                  Add Owner Definition
                </button>
              </div>
            )}
          </div>

          {/* Function Delay Section */}
          <div className="p-3 border-b border-coffee-700">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-coffee-300">
                Function Delay
              </label>
              {currentOverride?.delay ? (
                <button
                  onClick={handleClearDelay}
                  className="text-xs bg-coffee-700 hover:bg-coffee-600 text-coffee-100 px-2 py-1 rounded"
                >
                  Clear Delay
                </button>
              ) : (
                <button
                  onClick={() => setIsSettingDelay(!isSettingDelay)}
                  className="text-xs bg-coffee-700 hover:bg-coffee-600 text-coffee-100 px-2 py-1 rounded"
                >
                  {isSettingDelay ? 'Cancel' : '+ Set Delay'}
                </button>
              )}
            </div>

            {/* Display current delay */}
            {currentOverride?.delay && (
              <div className="mb-3">
                <div className="bg-coffee-800 p-2 rounded">
                  <div className="text-xs font-mono text-coffee-300 mb-1">
                    {currentOverride.delay.fieldName} on {availableContracts.find(c => c.address === currentOverride.delay?.contractAddress)?.name || 'Unknown'} ({currentOverride.delay.contractAddress.slice(0, 10)}...)
                  </div>
                  {resolvedDelay?.isResolved && (
                    <div className="text-sm font-bold text-green-400">
                      Delay: {resolvedDelay.seconds} seconds
                    </div>
                  )}
                  {resolvedDelay && !resolvedDelay.isResolved && (
                    <div className="text-xs text-red-400">
                      Error: {resolvedDelay.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Set delay form */}
            {isSettingDelay && !currentOverride?.delay && (
              <div className="bg-coffee-800 p-3 rounded">
                <div className="mb-2">
                  <label className="block text-xs text-coffee-300 mb-1">Contract:</label>
                  <select
                    value={newDelayData.contractAddress}
                    onChange={(e) => setNewDelayData(prev => ({ ...prev, contractAddress: e.target.value, fieldName: '' }))}
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
                  <label className="block text-xs text-coffee-300 mb-1">Delay Field:</label>
                  <select
                    value={newDelayData.fieldName}
                    onChange={(e) => setNewDelayData(prev => ({ ...prev, fieldName: e.target.value }))}
                    disabled={!newDelayData.contractAddress}
                    className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded disabled:opacity-50"
                  >
                    <option value="">Select a field...</option>
                    {newDelayData.contractAddress && getAvailableDelayFields(newDelayData.contractAddress).map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.name} (value: {field.value}) {field.description && `- ${field.description}`}
                      </option>
                    ))}
                  </select>
                  {newDelayData.contractAddress && getAvailableDelayFields(newDelayData.contractAddress).length === 0 && (
                    <div className="text-xs text-coffee-400 mt-1">
                      No numeric fields found in this contract
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSetDelay}
                  disabled={!newDelayData.contractAddress || !newDelayData.fieldName}
                  className="text-xs bg-green-600 hover:bg-green-500 disabled:bg-coffee-600 disabled:text-coffee-400 text-white px-3 py-1 rounded"
                >
                  Set Delay
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