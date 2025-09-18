import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPermissionOverrides, updatePermissionOverride } from '../api/api'
import type { ApiAbi, ApiAbiEntry, PermissionOverride } from '../api/types'
import { partition } from '../common/partition'
import * as solidity from '../components/editor/languages/solidity'
import { IconCheckFalse } from '../icons/IconCheckFalse'
import { IconCheckTrue } from '../icons/IconCheckTrue'
import { IconLockClosed } from '../icons/IconLockClosed'
import { IconLockOpen } from '../icons/IconLockOpen'
import { IconVoltage } from '../icons/IconVoltage'
import { AddressDisplay } from './AddressDisplay'
import { Folder } from './Folder'

export function PermissionsDisplay({ abis }: { abis: ApiAbi[] }) {
  const { project } = useParams()
  const queryClient = useQueryClient()
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

    await updateOverride(contractAddress, functionName, { userClassification: newClassification })
  }

  const handleCheckedToggle = async (contractAddress: string, functionName: string, currentChecked: boolean) => {
    if (!project) return

    await updateOverride(contractAddress, functionName, { checked: !currentChecked })
  }

  const handleScoreToggle = async (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => {
    if (!project) return

    const scoreOrder: Array<'unscored' | 'low-risk' | 'medium-risk' | 'high-risk'> = ['unscored', 'low-risk', 'medium-risk', 'high-risk']
    const currentIndex = scoreOrder.indexOf(currentScore)
    const nextIndex = (currentIndex + 1) % scoreOrder.length
    const newScore = scoreOrder[nextIndex]

    await updateOverride(contractAddress, functionName, { score: newScore })
  }

  const updateOverride = async (
    contractAddress: string,
    functionName: string,
    updates: Partial<Pick<PermissionOverride, 'userClassification' | 'checked' | 'score'>>
  ) => {
    // Get current override data
    const currentOverride = allOverrides.find(o =>
      o.contractAddress === contractAddress && o.functionName === functionName
    )

    // Create optimistic update
    const newOverride: PermissionOverride = {
      contractAddress,
      functionName,
      userClassification: updates.userClassification ?? currentOverride?.userClassification ?? 'non-permissioned',
      checked: updates.checked ?? currentOverride?.checked,
      score: updates.score ?? currentOverride?.score,
      timestamp: new Date().toISOString(),
    }

    setLocalOverrides(prev => [
      ...prev.filter(o => !(o.contractAddress === contractAddress && o.functionName === functionName)),
      newOverride
    ])

    try {
      if (!project) return
      await updatePermissionOverride(project, {
        contractAddress,
        functionName,
        ...updates,
      })

      // Invalidate and refetch the query to get fresh data
      await queryClient.invalidateQueries({
        queryKey: ['permission-overrides', project]
      })

      // Clear local overrides since we now have fresh server data
      setLocalOverrides([])
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
            onCheckedToggle={handleCheckedToggle}
            onScoreToggle={handleScoreToggle}
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
  onPermissionToggle,
  onCheckedToggle,
  onScoreToggle
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => void
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
          onCheckedToggle={onCheckedToggle}
          onScoreToggle={onScoreToggle}
        />
      </Folder>
    </div>
  )
}

function WritePermissionsCodeEntries({
  entries,
  contractAddress,
  overrides,
  onPermissionToggle,
  onCheckedToggle,
  onScoreToggle
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => void
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

  const getCheckedStatus = (functionName: string): boolean => {
    const override = overrides.find(o =>
      o.contractAddress === contractAddress && o.functionName === functionName
    )
    return override?.checked || false
  }

  const getScoreStatus = (functionName: string): 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk' => {
    const override = overrides.find(o =>
      o.contractAddress === contractAddress && o.functionName === functionName
    )
    return override?.score || 'unscored'
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
          const checkedStatus = functionName ? getCheckedStatus(functionName) : false
          const scoreStatus = functionName ? getScoreStatus(functionName) : 'unscored'

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

          return (
            <Fragment key={i}>
              {functionName && (
                <>
                  {/* Checked Icon */}
                  <button
                    onClick={() => onCheckedToggle(contractAddress, functionName, isChecked)}
                    className="inline-block mr-1 cursor-pointer transition-colors"
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
                  {/* Score Icon */}
                  <button
                    onClick={() => onScoreToggle(contractAddress, functionName, scoreStatus)}
                    className="inline-block mr-1 cursor-pointer transition-colors"
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
                </>
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