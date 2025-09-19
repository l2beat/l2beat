import { Fragment, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { ApiAbiEntry, PermissionOverride } from '../api/types'
import * as solidity from '../components/editor/languages/solidity'
import { IconCheckFalse } from '../icons/IconCheckFalse'
import { IconCheckTrue } from '../icons/IconCheckTrue'
import { IconChevronDown } from '../icons/IconChevronDown'
import { IconChevronRight } from '../icons/IconChevronRight'
import { IconLockClosed } from '../icons/IconLockClosed'
import { IconLockOpen } from '../icons/IconLockOpen'
import { IconVoltage } from '../icons/IconVoltage'
import { IconOpen } from '../icons/IconOpen'
import { useOwnerResolution, formatOwnerDefinition, getResolvedAddresses } from './OwnerResolution'
import { AddressDisplay } from './AddressDisplay'
import type { OwnerDefinition } from '../api/types'

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

  // Owner resolution using the discovered data
  const { resolved: resolvedOwners, loading: ownersLoading, error: ownersError } = useOwnerResolution(
    currentOverride?.ownerDefinitions,
    project || ''
  )

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
          {/* Owner Resolution Section */}
          {currentOverride?.ownerDefinitions && currentOverride.ownerDefinitions.length > 0 && (
            <div className="p-3 border-b border-coffee-700">
              <label className="block text-xs text-coffee-300 mb-2">
                Function Owners ({currentOverride.ownerDefinitions.length} definition{currentOverride.ownerDefinitions.length !== 1 ? 's' : ''})
              </label>

              {ownersLoading && (
                <div className="text-xs text-coffee-400">Resolving owners...</div>
              )}

              {ownersError && (
                <div className="text-xs text-red-400">Error: {ownersError}</div>
              )}

              {!ownersLoading && !ownersError && (
                <div className="space-y-2">
                  {/* Show resolved addresses */}
                  {getResolvedAddresses(resolvedOwners).length > 0 && (
                    <div>
                      <div className="text-xs text-coffee-400 mb-1">Resolved Addresses:</div>
                      <div className="space-y-1">
                        {getResolvedAddresses(resolvedOwners).map((address, index) => (
                          <div key={index} className="font-mono text-xs">
                            <AddressDisplay
                              simplified
                              value={{
                                type: 'address',
                                address: address,
                                addressType: 'Unknown',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show owner definitions details */}
                  <div>
                    <div className="text-xs text-coffee-400 mb-1">Owner Definitions:</div>
                    <div className="space-y-1">
                      {currentOverride.ownerDefinitions.map((definition, index) => {
                        const correspondingResolved = resolvedOwners.find(r => r.source === definition)
                        return (
                          <div key={index} className="text-xs font-mono text-coffee-300">
                            <span className="text-coffee-400">•</span> {formatOwnerDefinition(definition)}
                            {correspondingResolved && !correspondingResolved.isResolved && (
                              <span className="text-red-400 ml-2">({correspondingResolved.error})</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Owner Management Section */}
          <div className="p-3 border-b border-coffee-700">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-coffee-300">
                Owner Definitions Management
              </label>
              <button
                onClick={() => setIsAddingOwner(!isAddingOwner)}
                className="text-xs bg-coffee-700 hover:bg-coffee-600 text-coffee-100 px-2 py-1 rounded"
              >
                {isAddingOwner ? 'Cancel' : '+ Add Owner'}
              </button>
            </div>

            {/* Current owner definitions with delete buttons */}
            {currentOverride?.ownerDefinitions && currentOverride.ownerDefinitions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-coffee-400 mb-1">Current Definitions:</div>
                <div className="space-y-1">
                  {currentOverride.ownerDefinitions.map((definition, index) => (
                    <div key={index} className="flex items-center justify-between text-xs font-mono text-coffee-300 bg-coffee-800 p-2 rounded">
                      <span>{formatOwnerDefinition(definition)}</span>
                      <button
                        onClick={() => handleRemoveOwnerDefinition(index)}
                        className="text-red-400 hover:text-red-300 ml-2"
                        title="Remove this owner definition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
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
                      <label className="block text-xs text-coffee-300 mb-1">Contract Address:</label>
                      <input
                        type="text"
                        value={newOwnerData.contractAddress}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, contractAddress: e.target.value }))}
                        placeholder="eth:0x..."
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-coffee-300 mb-1">Method Name:</label>
                      <input
                        type="text"
                        value={newOwnerData.method}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, method: e.target.value }))}
                        placeholder="owner, admin, governor..."
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      />
                    </div>
                  </>
                )}

                {newOwnerType === 'role' && (
                  <>
                    <div className="mb-2">
                      <label className="block text-xs text-coffee-300 mb-1">Access Control Contract:</label>
                      <input
                        type="text"
                        value={newOwnerData.accessControlContract}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, accessControlContract: e.target.value }))}
                        placeholder="eth:0x..."
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-coffee-300 mb-1">Role Name:</label>
                      <input
                        type="text"
                        value={newOwnerData.roleName}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, roleName: e.target.value }))}
                        placeholder="DEFAULT_ADMIN_ROLE, PAUSER_ROLE..."
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-coffee-300 mb-1">Role Hash (optional):</label>
                      <input
                        type="text"
                        value={newOwnerData.roleHash}
                        onChange={(e) => setNewOwnerData(prev => ({ ...prev, roleHash: e.target.value }))}
                        placeholder="0x..."
                        className="w-full px-2 py-1 text-xs font-mono bg-coffee-700 text-coffee-100 border border-coffee-600 rounded"
                      />
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