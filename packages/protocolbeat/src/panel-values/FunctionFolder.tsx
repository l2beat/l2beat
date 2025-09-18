import { Fragment, useState, useEffect, useRef } from 'react'
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
  onOpenInCode
}: FunctionFolderProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get current override data for this function
  const currentOverride = overrides.find(o =>
    o.contractAddress === contractAddress && o.functionName === functionName
  )

  const permissionStatus = currentOverride?.userClassification || 'non-permissioned'
  const checkedStatus = currentOverride?.checked || false
  const scoreStatus = currentOverride?.score || 'unscored'
  const description = currentOverride?.description || ''

  // Local state for description input with debouncing
  const [localDescription, setLocalDescription] = useState(description)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

      {/* Expanded content - description textarea */}
      {isOpen && (
        <div className="bg-coffee-900 p-3 border-t border-coffee-700">
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