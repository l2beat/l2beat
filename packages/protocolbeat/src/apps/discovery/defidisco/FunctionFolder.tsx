import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { ApiAbiEntry, FunctionEntry, AddressFieldValue, Likelihood } from '../../../api/types'
import * as solidity from '../../../components/editor/languages/solidity'
import { IconCheckFalse } from './IconCheckFalse'
import { IconCheckTrue } from './IconCheckTrue'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconLockClosed } from './IconLockClosed'
import { IconLockOpen } from './IconLockOpen'
import { IconVoltage } from './IconVoltage'
import { IconProbability } from './IconProbability'
import { IconOpen } from './IconOpen'
import type { OwnerDefinition } from '../../../api/types'
import { useQuery } from '@tanstack/react-query'
import { getProject } from '../../../api/api'
import { usePanelStore } from '../store/panel-store'
import { UIContractDataAccess, resolvePathExpression } from './ownerResolution'
import { useContractTags } from '../../../hooks/useContractTags'

// Extended type for local display with contractAddress
interface FunctionEntryWithContract extends FunctionEntry {
  contractAddress: string
}

interface FunctionFolderProps {
  entry: ApiAbiEntry
  contractAddress: string
  functionName: string
  functions: FunctionEntryWithContract[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentIsPermissioned: boolean) => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk' | 'critical') => void
  onLikelihoodToggle: (contractAddress: string, functionName: string, currentLikelihood?: Likelihood) => void
  onDescriptionUpdate: (contractAddress: string, functionName: string, description: string) => void
  onConstraintsUpdate: (contractAddress: string, functionName: string, constraints: string) => void
  onOpenInCode: (contractAddress: string, functionName: string) => void
  onOwnerDefinitionsUpdate: (contractAddress: string, functionName: string, ownerDefinitions: OwnerDefinition[]) => void
  onDelayUpdate: (contractAddress: string, functionName: string, delay?: { contractAddress: string; fieldName: string }) => void
  onDependenciesUpdate: (contractAddress: string, functionName: string, dependencies?: { contractAddress: string }[]) => void
}


export function FunctionFolder({
  entry,
  contractAddress,
  functionName,
  functions,
  onPermissionToggle,
  onCheckedToggle,
  onScoreToggle,
  onLikelihoodToggle,
  onDescriptionUpdate,
  onConstraintsUpdate,
  onOpenInCode,
  onOwnerDefinitionsUpdate,
  onDelayUpdate,
  onDependenciesUpdate
}: FunctionFolderProps) {
  const { project } = useParams()
  const [isOpen, setIsOpen] = useState(false)

  // Get current function data for this function
  const currentFunction = functions.find(o =>
    o.contractAddress === contractAddress && o.functionName === functionName
  )

  // Fetch project data to get available contracts and fields
  const { data: projectData } = useQuery({
    queryKey: ['project', project],
    queryFn: () => project ? getProject(project) : null,
    enabled: !!project,
  })

  // Fetch contract tags to get external contracts and their attributes
  const { data: contractTags } = useContractTags(project || '')

  // Owner resolution using unified path expressions with shared utility
  const resolvedOwners = React.useMemo(() => {
    if (!currentFunction?.ownerDefinitions || !projectData?.entries) {
      return []
    }

    const allContracts = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
    const dataAccess = new UIContractDataAccess(allContracts)

    return currentFunction.ownerDefinitions.map(definition => {
      const result = resolvePathExpression(dataAccess, contractAddress, definition.path)

      if (result.error) {
        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: result.error
        }
      }

      return {
        address: result.addresses[0] || 'NO_ADDRESSES',
        source: definition,
        isResolved: true,
        allAddresses: result.addresses, // Keep all resolved addresses for display
        structuredValue: result.structuredValue // Keep the structured value to preserve object structure
      }
    })
  }, [currentFunction?.ownerDefinitions, projectData, contractAddress])

  const ownersLoading = false
  const ownersError = null

  // Helper to get contract name from address
  const getContractName = (address: string): string => {
    if (!projectData?.entries) return address

    const contract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
      .find(c => c.address === address)

    return contract?.name || address.slice(0, 10) + '...'
  }

  // Resolve delay value from projectData
  const resolvedDelay = React.useMemo(() => {
    if (!currentFunction?.delay || !projectData?.entries) {
      return null
    }

    const delayRef = currentFunction.delay

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
  }, [currentFunction?.delay, projectData])

  // State for managing owner definitions (unified path approach)
  const [isAddingOwner, setIsAddingOwner] = useState(false)
  const [newOwnerPath, setNewOwnerPath] = useState('')

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

  // Get external contracts with their centralization and likelihood attributes
  const getExternalContracts = React.useMemo(() => {
    if (!projectData?.entries || !contractTags?.tags) return []

    const externalTags = contractTags.tags.filter(tag => tag.isExternal)
    const contracts: Array<{
      address: string
      name: string
      centralization?: 'high' | 'medium' | 'low' | 'immutable'
      likelihood?: 'high' | 'medium' | 'low' | 'mitigated'
    }> = []

    externalTags.forEach(tag => {
      // Find contract name from project data
      // Address normalization is now handled in the backend when saving
      const contract = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])
        .find(c => c.address === tag.contractAddress)

      if (contract) {
        contracts.push({
          address: tag.contractAddress,
          name: contract.name || 'Unknown Contract',
          centralization: tag.centralization,
          likelihood: tag.likelihood
        })
      }
    })

    return contracts
  }, [projectData, contractTags])

  // Helper to get dependency info (name, centralization, likelihood)
  const getDependencyInfo = (address: string) => {
    return getExternalContracts.find(c => c.address === address)
  }

  // Helper functions for dependency management
  const handleAddDependency = (dependencyAddress: string) => {
    const currentDependencies = currentFunction?.dependencies || []
    const newDependencies = [...currentDependencies, { contractAddress: dependencyAddress }]
    onDependenciesUpdate(contractAddress, functionName, newDependencies)
    setIsAddingDependency(false)
  }

  const handleRemoveDependency = (index: number) => {
    const currentDependencies = currentFunction?.dependencies || []
    const newDependencies = currentDependencies.filter((_, i) => i !== index)
    // Always pass the array, even if empty - backend will handle it
    // Empty array will be omitted from JSON when serialized
    onDependenciesUpdate(contractAddress, functionName, newDependencies)
  }

  // Helper to get centralization color
  const getCentralizationColor = (centralization?: 'high' | 'medium' | 'low' | 'immutable') => {
    switch (centralization) {
      case 'high': return '#f87171' // red-400
      case 'medium': return '#fb923c' // orange-400
      case 'low': return '#fbbf24' // amber-400
      case 'immutable': return '#10b981' // green-500
      default: return '#9ca3af' // gray-400
    }
  }

  // Helper to get likelihood color
  const getLikelihoodColor = (likelihood?: 'high' | 'medium' | 'low' | 'mitigated', isHover: boolean = false) => {
    switch (likelihood) {
      case 'high': return isHover ? '#fca5a5' : '#f87171' // red-300 : red-400
      case 'medium': return isHover ? '#fdba74' : '#fb923c' // orange-300 : orange-400
      case 'low': return isHover ? '#6ee7b7' : '#10b981' // green-300 : green-500 (swapped from amber to match new mapping)
      case 'mitigated': return isHover ? '#93c5fd' : '#60a5fa' // blue-300 : blue-400
      default: return isHover ? '#d1d5db' : '#9ca3af' // gray-300 : gray-400 (unassigned)
    }
  }

  const isPermissioned = currentFunction?.isPermissioned || false
  const checkedStatus = currentFunction?.checked || false
  const scoreStatus = currentFunction?.score || 'unscored'
  const likelihoodStatus = currentFunction?.likelihood // Keep undefined as-is (unassigned)
  const description = currentFunction?.description || ''
  const constraints = currentFunction?.constraints || ''

  // Local state for description input with debouncing
  const [localDescription, setLocalDescription] = useState(description)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Local state for constraints input with debouncing
  const [localConstraints, setLocalConstraints] = useState(constraints)
  const constraintsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Local state for owner path editing with debouncing
  const [editedOwnerPaths, setEditedOwnerPaths] = useState<Record<number, string>>({})
  const ownerPathTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State for managing delay field
  const [isSettingDelay, setIsSettingDelay] = useState(false)
  const [newDelayData, setNewDelayData] = useState({
    contractAddress: contractAddress,
    fieldName: ''
  })

  // State for managing dependencies
  const [isAddingDependency, setIsAddingDependency] = useState(false)

  // Update local description when external data changes
  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  // Update local constraints when external data changes
  useEffect(() => {
    setLocalConstraints(constraints)
  }, [constraints])

  // Update edited owner paths when external data changes
  useEffect(() => {
    if (currentFunction?.ownerDefinitions) {
      const initialPaths: Record<number, string> = {}
      currentFunction.ownerDefinitions.forEach((def, index) => {
        initialPaths[index] = def.path
      })
      setEditedOwnerPaths(initialPaths)
    } else {
      setEditedOwnerPaths({})
    }
  }, [currentFunction?.ownerDefinitions])

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
    const hasOwnerDefinitions = (currentFunction?.ownerDefinitions || []).length > 0
    return hasValidScore && hasDescription && hasOwnerDefinitions
  }

  const canCheck = isCheckingAllowed()

  // Score colors
  const getScoreColor = (score: string, isHover: boolean = false) => {
    switch (score) {
      case 'low-risk': return isHover ? '#6ee7b7' : '#10b981' // green-300 : green-500
      case 'medium-risk': return isHover ? '#fcd34d' : '#f59e0b' // yellow-300 : yellow-500
      case 'high-risk': return isHover ? '#fca5a5' : '#f87171' // red-300 : red-400
      case 'critical': return isHover ? '#c084fc' : '#a855f7' // purple-400 : purple-500
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

  const handleConstraintsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newConstraints = event.target.value
    setLocalConstraints(newConstraints)

    // Clear existing timeout
    if (constraintsTimeoutRef.current) {
      clearTimeout(constraintsTimeoutRef.current)
    }

    // Set new timeout to save after user stops typing (500ms delay)
    constraintsTimeoutRef.current = setTimeout(() => {
      if (newConstraints !== constraints) {
        onConstraintsUpdate(contractAddress, functionName, newConstraints)
      }
    }, 500)
  }

  const handleOwnerPathChange = (index: number, newPath: string) => {
    // Update local state immediately for responsive UI
    setEditedOwnerPaths(prev => ({
      ...prev,
      [index]: newPath
    }))

    // Clear existing timeout
    if (ownerPathTimeoutRef.current) {
      clearTimeout(ownerPathTimeoutRef.current)
    }

    // Set new timeout to save after user stops typing (500ms delay)
    ownerPathTimeoutRef.current = setTimeout(() => {
      const currentDefinitions = currentFunction?.ownerDefinitions || []
      const originalPath = currentDefinitions[index]?.path

      if (newPath !== originalPath && newPath.trim().length > 0) {
        // Create updated definitions array with the new path
        const updatedDefinitions = currentDefinitions.map((def, i) =>
          i === index ? { path: newPath } : def
        )
        onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)
      }
    }, 500)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (constraintsTimeoutRef.current) {
        clearTimeout(constraintsTimeoutRef.current)
      }
      if (ownerPathTimeoutRef.current) {
        clearTimeout(ownerPathTimeoutRef.current)
      }
    }
  }, [])

  // Owner definition management handlers
  const handleAddOwnerDefinition = () => {
    const currentDefinitions = currentFunction?.ownerDefinitions || []

    const newDefinition: OwnerDefinition = {
      path: newOwnerPath
    }

    const updatedDefinitions = [...currentDefinitions, newDefinition]
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)

    // Reset form
    setIsAddingOwner(false)
    setNewOwnerPath('')
  }

  const handleRemoveOwnerDefinition = (index: number) => {
    const currentDefinitions = currentFunction?.ownerDefinitions || []
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
    return newOwnerPath.trim().length > 0
  }

  // Format owner definition with resolved value
  const formatOwnerDefinition = (definition: OwnerDefinition, resolvedOwner?: { address: string; isResolved: boolean; allAddresses?: string[]; structuredValue?: any }) => {
    let baseDescription = definition.path

    // Append resolved value if available
    if (resolvedOwner?.isResolved && resolvedOwner.allAddresses && resolvedOwner.allAddresses.length > 0) {
      // Check if it's a structured value (object with properties, not array)
      const isStructured = resolvedOwner.structuredValue &&
                          typeof resolvedOwner.structuredValue === 'object' &&
                          !Array.isArray(resolvedOwner.structuredValue) &&
                          !resolvedOwner.structuredValue.startsWith?.('eth:')

      if (isStructured) {
        baseDescription += ` → [structured value]`
      } else if (resolvedOwner.allAddresses.length === 1) {
        baseDescription += ` → ${resolvedOwner.allAddresses[0]!.slice(0, 10)}...`
      } else {
        baseDescription += ` → ${resolvedOwner.allAddresses.length} addresses`
      }
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
            onClick={() => onPermissionToggle(contractAddress, functionName, isPermissioned)}
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
            title={`Current score: ${scoreStatus}. Click to cycle: unscored → low-risk → medium-risk → high-risk → critical`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getScoreColor(scoreStatus, true)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getScoreColor(scoreStatus)
            }}
          >
            <IconVoltage />
          </button>

          {/* Likelihood Icon */}
          <button
            onClick={() => onLikelihoodToggle(contractAddress, functionName, likelihoodStatus)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: getLikelihoodColor(likelihoodStatus),
            }}
            title={`Current likelihood: ${likelihoodStatus}. Click to cycle: mitigated → low → medium → high`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getLikelihoodColor(likelihoodStatus, true)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getLikelihoodColor(likelihoodStatus)
            }}
          >
            <IconProbability />
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
          {currentFunction?.delay && resolvedDelay?.isResolved && (
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
            {currentFunction?.ownerDefinitions && currentFunction.ownerDefinitions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-coffee-400 mb-1">
                  Current Definitions ({currentFunction.ownerDefinitions.length}):
                </div>

                {ownersLoading && (
                  <div className="text-xs text-coffee-400 mb-2">Resolving owners...</div>
                )}

                {ownersError && (
                  <div className="text-xs text-aux-red mb-2">Error: {ownersError}</div>
                )}

                <div className="space-y-2">
                  {currentFunction.ownerDefinitions.map((definition, index) => {
                    const correspondingResolved = resolvedOwners[index]

                    return (
                      <div key={index} className="bg-coffee-800 p-2 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={editedOwnerPaths[index] || definition.path}
                            onChange={(e) => handleOwnerPathChange(index, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded font-mono focus:outline-none focus:border-coffee-500"
                            placeholder="e.g., $self.owner"
                          />
                          <button
                            onClick={() => handleRemoveOwnerDefinition(index)}
                            className="text-aux-red hover:opacity-80 flex-shrink-0"
                            title="Remove this owner definition"
                          >
                            ✕
                          </button>
                        </div>
                        {correspondingResolved?.isResolved && (
                          <div className="text-xs text-coffee-400 mb-1 px-2">
                            {(() => {
                              const isStructured = correspondingResolved.structuredValue &&
                                                  typeof correspondingResolved.structuredValue === 'object' &&
                                                  !Array.isArray(correspondingResolved.structuredValue) &&
                                                  !correspondingResolved.structuredValue.startsWith?.('eth:')
                              if (isStructured) {
                                return `→ [structured value with ${correspondingResolved.allAddresses?.length || 0} address(es)]`
                              } else if (correspondingResolved.allAddresses?.length === 1) {
                                return `→ ${correspondingResolved.allAddresses[0]!.slice(0, 10)}...`
                              } else {
                                return `→ ${correspondingResolved.allAddresses?.length || 0} addresses`
                              }
                            })()}
                          </div>
                        )}

                        {/* Show resolved owners */}
                        {!ownersLoading && correspondingResolved && correspondingResolved.isResolved && (
                          <div className="ml-2 mt-1">
                            {/* Check if we have a structured value (object with properties, not array) */}
                            {(correspondingResolved as any).structuredValue &&
                             typeof (correspondingResolved as any).structuredValue === 'object' &&
                             !Array.isArray((correspondingResolved as any).structuredValue) &&
                             !(correspondingResolved as any).structuredValue.startsWith?.('eth:') ? (
                              <>
                                <div className="text-xs text-coffee-400 mb-1">Structured Value:</div>
                                <div className="bg-coffee-700 p-2 rounded text-xs font-mono">
                                  <pre className="text-coffee-200 overflow-x-auto">
                                    {JSON.stringify((correspondingResolved as any).structuredValue, null, 2)}
                                  </pre>
                                </div>
                                <div className="text-xs text-coffee-400 mt-2 mb-1">
                                  Contains {(correspondingResolved as any).allAddresses?.length || 0} address(es):
                                </div>
                                {(correspondingResolved as any).allAddresses?.map((addr: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 mb-1">
                                    <button
                                      onClick={() => usePanelStore.getState().select(addr)}
                                      className="text-aux-cyan hover:text-aux-cyan-light text-xs"
                                      title={`Select ${addr}`}
                                    >
                                      {getContractName(addr)}
                                    </button>
                                    <button
                                      onClick={() => usePanelStore.getState().select(addr)}
                                      className="text-coffee-400 hover:text-coffee-300"
                                      title="Select this contract"
                                    >
                                      <IconOpen />
                                    </button>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <>
                                <div className="text-xs text-coffee-400 mb-1">Resolves to:</div>
                                {/* Show all resolved addresses */}
                                {(correspondingResolved as any).allAddresses?.map((addr: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 mb-1">
                                    <button
                                      onClick={() => usePanelStore.getState().select(addr)}
                                      className="text-aux-cyan hover:text-aux-cyan-light text-xs"
                                      title={`Select ${addr}`}
                                    >
                                      {getContractName(addr)}
                                    </button>
                                    <button
                                      onClick={() => usePanelStore.getState().select(addr)}
                                      className="text-coffee-400 hover:text-coffee-300"
                                      title="Select this contract"
                                    >
                                      <IconOpen />
                                    </button>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        )}

                        {/* Show resolution error */}
                        {!ownersLoading && correspondingResolved && !correspondingResolved.isResolved && (
                          <div className="text-aux-red text-xs ml-2 mt-1">
                            Error: {correspondingResolved.error}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add new owner definition form - UNIFIED PATH APPROACH */}
            {isAddingOwner && (
              <div className="bg-coffee-800 p-3 rounded">
                <div className="text-xs text-coffee-400 mb-3">
                  Enter a path expression to define permission owners
                </div>

                <div className="mb-3">
                  <label className="block text-xs text-coffee-300 mb-1">
                    Path Expression
                  </label>
                  <input
                    type="text"
                    value={newOwnerPath}
                    onChange={(e) => setNewOwnerPath(e.target.value)}
                    placeholder="e.g., $self.owner or @governor.signers[0]"
                    className="w-full px-2 py-1 text-xs bg-coffee-700 text-coffee-100 border border-coffee-600 rounded font-mono"
                  />
                  <div className="text-xs text-coffee-400 mt-2 space-y-1">
                    <div><strong>Examples:</strong></div>
                    <div>• <code className="text-aux-cyan">$self.owner</code> - owner field in current contract</div>
                    <div>• <code className="text-aux-cyan">@governor.signers[0]</code> - follow governor field, get first signer</div>
                    <div>• <code className="text-aux-cyan">$self.accessControl.ADMIN_ROLE.members</code> - get role members</div>
                    <div>• <code className="text-aux-cyan">$self</code> - current contract itself</div>
                  </div>
                </div>

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
              {currentFunction?.delay ? (
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
            {currentFunction?.delay && (
              <div className="mb-3">
                <div className="bg-coffee-800 p-2 rounded">
                  <div className="text-xs font-mono text-coffee-300 mb-1">
                    {currentFunction.delay.fieldName} on {availableContracts.find(c => c.address === currentFunction.delay?.contractAddress)?.name || 'Unknown'} ({currentFunction.delay.contractAddress.slice(0, 10)}...)
                  </div>
                  {resolvedDelay?.isResolved && (
                    <div className="text-sm font-bold text-aux-green">
                      Delay: {resolvedDelay.seconds} seconds
                    </div>
                  )}
                  {resolvedDelay && !resolvedDelay.isResolved && (
                    <div className="text-xs text-aux-red">
                      Error: {resolvedDelay.error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Set delay form */}
            {isSettingDelay && !currentFunction?.delay && (
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

          {/* Dependencies Section */}
          <div className="p-3 border-b border-coffee-700">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-coffee-300">
                External Dependencies
              </label>
              <button
                onClick={() => setIsAddingDependency(!isAddingDependency)}
                className="text-xs bg-coffee-700 hover:bg-coffee-600 text-coffee-100 px-2 py-1 rounded"
              >
                {isAddingDependency ? 'Cancel' : '+ Add Dependency'}
              </button>
            </div>

            {/* Display current dependencies */}
            {currentFunction?.dependencies && currentFunction.dependencies.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-coffee-400 mb-1">
                  Current Dependencies ({currentFunction.dependencies.length}):
                </div>

                <div className="space-y-2">
                  {currentFunction.dependencies.map((dependency, index) => {
                    const depInfo = getDependencyInfo(dependency.contractAddress)

                    return (
                      <div key={index} className="bg-coffee-800 p-2 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => usePanelStore.getState().select(dependency.contractAddress)}
                              className="text-aux-cyan hover:text-aux-cyan-light text-xs font-mono"
                              title={`Select ${dependency.contractAddress}`}
                            >
                              {depInfo?.name || dependency.contractAddress.slice(0, 10) + '...'}
                            </button>
                            <button
                              onClick={() => usePanelStore.getState().select(dependency.contractAddress)}
                              className="text-coffee-400 hover:text-coffee-300"
                              title="Select this contract"
                            >
                              <IconOpen />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveDependency(index)}
                            className="text-aux-red hover:opacity-80 flex-shrink-0 ml-2"
                            title="Remove this dependency"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Show centralization and likelihood attributes */}
                        {depInfo && (depInfo.centralization || depInfo.likelihood) && (
                          <div className="flex items-center gap-3 text-xs mt-1">
                            {depInfo.centralization && (
                              <div className="flex items-center gap-1">
                                <span className="text-coffee-400">Centralization:</span>
                                <span
                                  style={{ color: getCentralizationColor(depInfo.centralization) }}
                                  className="font-semibold"
                                >
                                  {depInfo.centralization}
                                </span>
                              </div>
                            )}
                            {depInfo.likelihood && (
                              <div className="flex items-center gap-1">
                                <span className="text-coffee-400">Likelihood:</span>
                                <span
                                  style={{ color: getLikelihoodColor(depInfo.likelihood) }}
                                  className="font-semibold"
                                >
                                  {depInfo.likelihood}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

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

            {/* Add dependency form */}
            {isAddingDependency && (
              <div className="bg-coffee-800 p-3 rounded">
                <div className="text-xs text-coffee-400 mb-3">
                  Select an external contract to add as a dependency
                </div>

                {getExternalContracts.length === 0 ? (
                  <div className="text-xs text-coffee-400">
                    No external contracts found. Mark contracts as external in the Values panel to add them as dependencies.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getExternalContracts.map((contract) => (
                      <button
                        key={contract.address}
                        onClick={() => handleAddDependency(contract.address)}
                        disabled={currentFunction?.dependencies?.some(d => d.contractAddress === contract.address)}
                        className="w-full text-left bg-coffee-700 hover:bg-coffee-600 disabled:bg-coffee-600 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-xs font-mono text-coffee-100">
                              {contract.name}
                            </div>
                            <div className="text-xs text-coffee-400 mt-1">
                              {contract.address.slice(0, 10)}...
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {contract.centralization && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-coffee-400">C:</span>
                                <span
                                  style={{ color: getCentralizationColor(contract.centralization) }}
                                  className="text-xs font-semibold"
                                >
                                  {contract.centralization.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {contract.likelihood && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-coffee-400">L:</span>
                                <span
                                  style={{ color: getLikelihoodColor(contract.likelihood) }}
                                  className="text-xs font-semibold"
                                >
                                  {contract.likelihood.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3">
            <label className="block text-xs text-coffee-300 mb-2">
              Function Constraints
            </label>
            <textarea
              value={localConstraints}
              onChange={handleConstraintsChange}
              placeholder="Add constraints for this function..."
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