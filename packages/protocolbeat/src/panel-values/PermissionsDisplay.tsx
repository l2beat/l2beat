import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPermissionOverrides, updatePermissionOverride } from '../api/api'
import type { ApiAbi, ApiAbiEntry, PermissionOverride } from '../api/types'
import { partition } from '../common/partition'
import * as solidity from '../components/editor/languages/solidity'
import { IconLockClosed } from '../icons/IconLockClosed'
import { IconLockOpen } from '../icons/IconLockOpen'
import { AddressDisplay } from './AddressDisplay'
import { Folder } from './Folder'

export function PermissionsDisplay({ abis }: { abis: ApiAbi[] }) {
  const { project } = useParams()
  const [localOverrides, setLocalOverrides] = useState<PermissionOverride[]>([])

  // Load permission overrides for this project
  const { data: overridesData } = useQuery({
    queryKey: ['permission-overrides', project],
    queryFn: () => project ? getPermissionOverrides(project) : null,
    enabled: !!project,
  })

  const allOverrides = [...(overridesData?.overrides || []), ...localOverrides]

  const handlePermissionToggle = async (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => {
    if (!project) return

    const newClassification = currentClassification === 'permissioned' ? 'non-permissioned' : 'permissioned'

    // Optimistic update
    const newOverride: PermissionOverride = {
      contractAddress,
      functionName,
      userClassification: newClassification,
      timestamp: new Date().toISOString(),
    }

    setLocalOverrides(prev => [
      ...prev.filter(o => !(o.contractAddress === contractAddress && o.functionName === functionName)),
      newOverride
    ])

    try {
      await updatePermissionOverride(project, {
        contractAddress,
        functionName,
        userClassification: newClassification,
      })
    } catch (error) {
      console.error('Failed to update permission override:', error)
      // Revert optimistic update on error
      setLocalOverrides(prev => prev.filter(o => !(o.contractAddress === contractAddress && o.functionName === functionName)))
    }
  }

  // Filter to only show ABIs that have write functions
  const abisWithWriteFunctions = abis.filter(abi => {
    const readMarkers = [' view ', ' pure ']
    const [errors, nonErrors] = partition(abi.entries, (e) => e.value.startsWith('error'))
    const [events, nonEvents] = partition(nonErrors, (e) => e.value.startsWith('event'))
    const [read, write] = partition(nonEvents, (e) => readMarkers.some((marker) => e.value.includes(marker)))
    return write.length > 0
  })

  if (abisWithWriteFunctions.length === 0) {
    return null
  }

  return (
    <ol>
      {abisWithWriteFunctions.map((abi) => (
        <li key={abi.address}>
          <div className="px-5 pt-[3px] pb-0.5 font-mono text-xs">
            <AddressDisplay
              simplified
              value={{
                type: 'address',
                address: abi.address,
                addressType: 'Unknown',
              }}
            />
          </div>
          <PermissionsCode
            entries={abi.entries}
            contractAddress={abi.address}
            overrides={allOverrides}
            onPermissionToggle={handlePermissionToggle}
          />
        </li>
      ))}
    </ol>
  )
}

function PermissionsCode({
  entries,
  contractAddress,
  overrides,
  onPermissionToggle
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
}) {
  const readMarkers = [' view ', ' pure ']

  const [errors, nonErrors] = partition(entries, (e) =>
    e.value.startsWith('error'),
  )
  const [events, nonEvents] = partition(nonErrors, (e) =>
    e.value.startsWith('event'),
  )
  const [read, write] = partition(nonEvents, (e) =>
    readMarkers.some((marker) => e.value.includes(marker)),
  )

  return (
    <div>
      <Folder
        title={`Write Functions (${write.length})`}
        collapsed={write.length === 0}
      >
        <WritePermissionsCodeEntries
          entries={write}
          contractAddress={contractAddress}
          overrides={overrides}
          onPermissionToggle={onPermissionToggle}
        />
      </Folder>
    </div>
  )
}

function WritePermissionsCodeEntries({
  entries,
  contractAddress,
  overrides,
  onPermissionToggle
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
}) {
  const extractFunctionName = (abiEntry: string): string | null => {
    const match = abiEntry.match(/function\s+(\w+)\s*\(/)
    return match ? match[1] || null : null
  }

  const getPermissionStatus = (functionName: string): 'permissioned' | 'non-permissioned' => {
    const override = overrides.find(o =>
      o.contractAddress === contractAddress && o.functionName === functionName
    )
    return override?.userClassification || 'non-permissioned'
  }

  const content =
    entries.length === 0 ? (
      <code>
        <span className="bg-coffee-400">// No write functions</span>
      </code>
    ) : (
      <code>
        {entries.map((entry, i) => {
          const functionName = extractFunctionName(entry.value)
          const permissionStatus = functionName ? getPermissionStatus(functionName) : 'non-permissioned'
          const isPermissioned = permissionStatus === 'permissioned'

          return (
            <Fragment key={i}>
              {functionName && (
                <button
                  onClick={() => onPermissionToggle(contractAddress, functionName, permissionStatus)}
                  className="inline-block mr-1 cursor-pointer transition-colors"
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
              )}
              {entry.value.split(/\b/).map((word, wordIndex) => (
                <span key={wordIndex} className={getClassName(word)}>
                  {word}
                </span>
              ))}
              {entry.signature && (
                <span className="text-coffee-400"> // {entry.signature}</span>
              )}
              {entry.topic && (
                <span className="text-coffee-400"> // {entry.topic}</span>
              )}
              {i !== entries.length - 1 && <br />}
            </Fragment>
          )
        })}
      </code>
    )

  return (
    <pre className="overflow-x-auto bg-coffee-900 px-5 py-0.5 font-mono text-xs leading-[18px]">
      {content}
    </pre>
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