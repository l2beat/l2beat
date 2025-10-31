import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { ApiAbiEntry, FunctionEntry, AddressFieldValue } from '../../../api/types'
import * as solidity from '../../../components/editor/languages/solidity'
import { IconCheckFalse } from './IconCheckFalse'
import { IconCheckTrue } from './IconCheckTrue'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconLockClosed } from './IconLockClosed'
import { IconLockOpen } from './IconLockOpen'
import { IconVoltage } from './IconVoltage'
import { IconOpen } from './IconOpen'
import type { OwnerDefinition } from '../../../api/types'
import { useQuery } from '@tanstack/react-query'
import { getProject } from '../../../api/api'
import { usePanelStore } from '../store/panel-store'

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
  onDescriptionUpdate: (contractAddress: string, functionName: string, description: string) => void
  onOpenInCode: (contractAddress: string, functionName: string) => void
  onOwnerDefinitionsUpdate: (contractAddress: string, functionName: string, ownerDefinitions: OwnerDefinition[]) => void
  onDelayUpdate: (contractAddress: string, functionName: string, delay?: { contractAddress: string; fieldName: string }) => void
}

// Helper function to find the contract that owns the given address
// For proxy contracts, the address might be an implementation address in the abis array
function findContractForAddress(contracts: any[], address: string): any | null {
  // First try direct match
  let contract = contracts.find(c => c.address === address)
  if (contract) {
    return contract
  }

  // Not found directly - might be an implementation address
  // Find the proxy that has this address in its abis array
  contract = contracts.find(c =>
    c.abis?.some((abi: any) => abi.address === address)
  )

  return contract || null
}

// Helper function to navigate value path in UI (mirrors backend logic)
// Returns: { addresses: string[], structuredValue: any }
function navigateValuePathInUI(contract: any, valuePath: string): { addresses: string[], structuredValue: any } {
  if (!contract.fields || contract.fields.length === 0) {
    throw new Error('Contract has no fields')
  }

  // Convert fields array to values object for easier navigation
  const values: any = {}
  for (const field of contract.fields) {
    values[field.name] = convertFieldValueToPlainValue(field.value)
  }

  // Parse and navigate the path
  let currentValue: any = values
  const segments = parseValuePathInUI(valuePath)

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!

    if (segment.type === 'property') {
      if (typeof currentValue !== 'object' || currentValue === null) {
        throw new Error(`Cannot access property "${segment.value}" on non-object`)
      }
      currentValue = currentValue[segment.value]
      if (currentValue === undefined) {
        throw new Error(`Property "${segment.value}" not found`)
      }
    } else if (segment.type === 'index') {
      if (!Array.isArray(currentValue)) {
        throw new Error(`Cannot index non-array`)
      }
      const index = segment.value as number
      if (index >= currentValue.length) {
        throw new Error(`Index ${index} out of bounds`)
      }
      currentValue = currentValue[index]
    }
  }

  // Validate that the value contains addresses and extract them
  const addresses = extractAddressesInUI(currentValue, valuePath)

  // Return both the extracted addresses and the structured value
  return {
    addresses,
    structuredValue: currentValue
  }
}

// Converts FieldValue to plain JS value for easier navigation
function convertFieldValueToPlainValue(fieldValue: any): any {
  if (!fieldValue || !fieldValue.type) {
    return fieldValue
  }

  switch (fieldValue.type) {
    case 'address':
      return fieldValue.address
    case 'string':
    case 'number':
    case 'hex':
      return fieldValue.value
    case 'boolean':
      return fieldValue.value
    case 'array':
      return fieldValue.values.map((v: any) => convertFieldValueToPlainValue(v))
    case 'object':
      // Object is stored as [[key, value], [key, value], ...]
      const obj: any = {}
      for (const [keyField, valueField] of fieldValue.values) {
        const key = convertFieldValueToPlainValue(keyField)
        const value = convertFieldValueToPlainValue(valueField)
        obj[key] = value
      }
      return obj
    default:
      return fieldValue
  }
}

// Parses value path into segments (same as backend)
function parseValuePathInUI(path: string): Array<{ type: 'property' | 'index'; value: string | number }> {
  const segments: Array<{ type: 'property' | 'index'; value: string | number }> = []
  let current = ''
  let i = 0

  while (i < path.length) {
    const char = path[i]!

    if (char === '.') {
      if (current) {
        segments.push({ type: 'property', value: current })
        current = ''
      }
      i++
    } else if (char === '[') {
      if (current) {
        segments.push({ type: 'property', value: current })
        current = ''
      }

      const closeIndex = path.indexOf(']', i)
      if (closeIndex === -1) {
        throw new Error(`Unclosed bracket in path: ${path}`)
      }

      const indexStr = path.substring(i + 1, closeIndex)
      const index = parseInt(indexStr, 10)

      if (isNaN(index)) {
        segments.push({ type: 'property', value: indexStr })
      } else {
        segments.push({ type: 'index', value: index })
      }

      i = closeIndex + 1
    } else {
      current += char
      i++
    }
  }

  if (current) {
    segments.push({ type: 'property', value: current })
  }

  return segments
}

// Extracts addresses from value (recursively handles objects)
function extractAddressesInUI(value: any, path: string): string[] {
  // Single string address
  if (typeof value === 'string' && value.startsWith('eth:')) {
    return [value]
  }

  // Array - recursively extract from elements
  if (Array.isArray(value)) {
    const addresses: string[] = []
    for (const element of value) {
      if (typeof element === 'string' && element.startsWith('eth:')) {
        addresses.push(element)
      } else if (typeof element === 'object' && element !== null) {
        // Recursively extract from object elements
        addresses.push(...extractAddressesInUI(element, path))
      }
    }
    if (addresses.length > 0) {
      return addresses
    }
  }

  // Object - recursively extract addresses from all properties
  if (typeof value === 'object' && value !== null) {
    const addresses: string[] = []
    for (const key in value) {
      const prop = value[key]
      if (typeof prop === 'string' && prop.startsWith('eth:')) {
        addresses.push(prop)
      } else if (typeof prop === 'object' && prop !== null) {
        // Recursively extract from nested objects/arrays
        addresses.push(...extractAddressesInUI(prop, path))
      }
    }
    if (addresses.length > 0) {
      return addresses
    }
  }

  throw new Error(`Value at path "${path}" does not contain any addresses`)
}

export function FunctionFolder({
  entry,
  contractAddress,
  functionName,
  functions,
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

  // Owner resolution using unified path expressions
  const resolvedOwners = React.useMemo(() => {
    if (!currentFunction?.ownerDefinitions || !projectData?.entries) {
      return []
    }

    const allContracts = projectData.entries.flatMap(e => [...e.initialContracts, ...e.discoveredContracts])

    return currentFunction.ownerDefinitions.map(definition => {
      try {
        const result = resolvePathExpressionInUI(allContracts, contractAddress, definition.path)

        if (result.addresses.length === 0) {
          throw new Error('No addresses found')
        }

        return {
          address: result.addresses[0]!,
          source: definition,
          isResolved: true,
          allAddresses: result.addresses, // Keep all resolved addresses for display
          structuredValue: result.structuredValue // Keep the structured value to preserve object structure
        }
      } catch (error) {
        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
  }, [currentFunction?.ownerDefinitions, projectData, contractAddress])

  // Resolve path expression in UI
  function resolvePathExpressionInUI(
    allContracts: any[],
    currentContractAddress: string,
    pathExpression: string
  ): { addresses: string[], structuredValue: any } {
    // Special case: just "$self" means current contract is the owner
    if (pathExpression === '$self') {
      return {
        addresses: [currentContractAddress],
        structuredValue: currentContractAddress
      }
    }

    // Split on first dot to separate contract ref from value path
    const firstDotIndex = pathExpression.indexOf('.')

    if (firstDotIndex === -1) {
      throw new Error(`Invalid path: must include contract reference and value path`)
    }

    const contractRef = pathExpression.substring(0, firstDotIndex)
    const valuePath = pathExpression.substring(firstDotIndex + 1)

    // Resolve contract reference
    let targetContractAddress: string

    if (contractRef === '$self') {
      targetContractAddress = currentContractAddress
    } else if (contractRef.startsWith('@')) {
      const fieldName = contractRef.substring(1)
      const currentContract = findContractForAddress(allContracts, currentContractAddress)

      if (!currentContract) {
        throw new Error('Current contract not found')
      }

      const field = currentContract.fields?.find((f: any) => f.name === fieldName)
      if (!field || field.value.type !== 'address') {
        throw new Error(`Field "${fieldName}" not found or is not an address`)
      }

      targetContractAddress = (field.value as any).address
    } else if (contractRef.startsWith('eth:')) {
      targetContractAddress = contractRef
    } else {
      throw new Error(`Invalid contract reference "${contractRef}"`)
    }

    // Find target contract
    const targetContract = findContractForAddress(allContracts, targetContractAddress)

    if (!targetContract) {
      throw new Error(`Contract ${targetContractAddress} not found`)
    }

    // Navigate value path
    return navigateValuePathInUI(targetContract, valuePath)
  }

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

  const isPermissioned = currentFunction?.isPermissioned || false
  const checkedStatus = currentFunction?.checked || false
  const scoreStatus = currentFunction?.score || 'unscored'
  const description = currentFunction?.description || ''

  // Local state for description input with debouncing
  const [localDescription, setLocalDescription] = useState(description)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Local state for owner path editing with debouncing
  const [editedOwnerPaths, setEditedOwnerPaths] = useState<Record<number, string>>({})
  const ownerPathTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      if (ownerPathTimeoutRef.current) {
        clearTimeout(ownerPathTimeoutRef.current)
      }
    }
  }, [])

  // Owner definition management handlers
  const handleAddOwnerDefinition = () => {
    const currentDefinitions = currentOverride?.ownerDefinitions || []

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
                  <div className="text-xs text-red-400 mb-2">Error: {ownersError}</div>
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
                            className="text-red-400 hover:text-red-300 flex-shrink-0"
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