import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPermissionOverrides, updatePermissionOverride } from '../api/api'
import type { ApiAbi, ApiAbiEntry, PermissionOverride } from '../api/types'
import { partition } from '../common/partition'
import { AddressDisplay } from './AddressDisplay'
import { Folder } from './Folder'
import { FunctionFolder } from './FunctionFolder'

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

  const handleDescriptionUpdate = async (contractAddress: string, functionName: string, description: string) => {
    if (!project) return

    await updateOverride(contractAddress, functionName, { description })
  }

  const updateOverride = async (
    contractAddress: string,
    functionName: string,
    updates: Partial<Pick<PermissionOverride, 'userClassification' | 'checked' | 'score' | 'description'>>
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
      description: updates.description ?? currentOverride?.description,
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
            onDescriptionUpdate={handleDescriptionUpdate}
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
  onScoreToggle,
  onDescriptionUpdate
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => void
  onDescriptionUpdate: (contractAddress: string, functionName: string, description: string) => void
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
          onDescriptionUpdate={onDescriptionUpdate}
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
  onScoreToggle,
  onDescriptionUpdate
}: {
  entries: ApiAbiEntry[]
  contractAddress: string
  overrides: PermissionOverride[]
  onPermissionToggle: (contractAddress: string, functionName: string, currentClassification: 'permissioned' | 'non-permissioned') => void
  onCheckedToggle: (contractAddress: string, functionName: string, currentChecked: boolean) => void
  onScoreToggle: (contractAddress: string, functionName: string, currentScore: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk') => void
  onDescriptionUpdate: (contractAddress: string, functionName: string, description: string) => void
}) {
  const extractFunctionName = (abiEntry: string): string | null => {
    const match = abiEntry.match(/function\s+(\w+)\s*\(/)
    return match ? match[1] || null : null
  }

  if (entries.length === 0) {
    return (
      <div className="bg-coffee-900 p-3">
        <span className="text-coffee-400 font-mono text-xs">// No write functions</span>
      </div>
    )
  }

  return (
    <div>
      {entries.map((entry, i) => {
        const functionName = extractFunctionName(entry.value)

        if (!functionName) {
          return null // Skip entries without function names
        }

        return (
          <FunctionFolder
            key={i}
            entry={entry}
            contractAddress={contractAddress}
            functionName={functionName}
            overrides={overrides}
            onPermissionToggle={onPermissionToggle}
            onCheckedToggle={onCheckedToggle}
            onScoreToggle={onScoreToggle}
            onDescriptionUpdate={onDescriptionUpdate}
          />
        )
      })}
    </div>
  )
}

