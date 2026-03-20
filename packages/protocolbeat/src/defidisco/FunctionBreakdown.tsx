import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getFunctions, getProject } from '../api/api'
import type { Impact } from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { normalizeForLookup } from '../apps/discovery/defidisco/addressUtils'
import { getImpactColor } from './scoringShared'

interface FunctionBreakdownProps {
  project: string
}

interface ScoredFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
}

/**
 * Function Breakdown Component
 * Displays flat list of permissioned functions with impact scores
 */
export function FunctionBreakdown({ project }: FunctionBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const { data: functionsData } = useQuery({
    queryKey: ['functions', project],
    queryFn: () => getFunctions(project),
  })

  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  const contractNameMap = useMemo(() => {
    const map = new Map<string, string>()
    if (!projectData?.entries) return map
    for (const chain of projectData.entries) {
      for (const c of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
        if (c.name) {
          map.set(normalizeForLookup(c.address), c.name)
        }
      }
    }
    return map
  }, [projectData])

  // Count permissioned functions and build scored list
  let permissionedCount = 0
  const scoredFunctions: ScoredFunction[] = []

  if (functionsData?.contracts) {
    for (const [contractAddress, contractData] of Object.entries(
      functionsData.contracts,
    )) {
      for (const func of contractData.functions) {
        if (func.isPermissioned) {
          permissionedCount++
          if (func.score && func.score !== 'unscored') {
            scoredFunctions.push({
              contractAddress,
              contractName:
                contractNameMap.get(normalizeForLookup(contractAddress)) ??
                contractAddress,
              functionName: func.functionName,
              impact: func.score === 'no-impact' ? 'no-impact' : 'critical',
            })
          }
        }
      }
    }
  }

  return (
    <div className="text-coffee-300">
      {/* Main header */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Functions:</span>
        <span>{permissionedCount}</span>
      </div>

      {/* Function list */}
      <div className="mt-3 ml-2">
        {scoredFunctions.length === 0 ? (
          <p className="ml-4 text-coffee-400 text-xs">
            No functions with impact scores
          </p>
        ) : (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mb-2 ml-4 flex items-center gap-2 text-coffee-400 text-xs hover:text-coffee-300"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>
                {scoredFunctions.length} scored function
                {scoredFunctions.length !== 1 ? 's' : ''}
              </span>
            </button>
            {isExpanded && (
              <ul className="ml-8 space-y-1.5">
                {scoredFunctions.map((func, idx) => (
                  <li key={idx} className="text-coffee-300 text-xs">
                    <button
                      onClick={() =>
                        usePanelStore.getState().select(func.contractAddress)
                      }
                      className="cursor-pointer font-medium text-coffee-200 transition-colors hover:text-blue-400"
                    >
                      {func.contractName}
                    </button>
                    <span className="mx-1 text-coffee-500">.</span>
                    <span className="text-blue-400">{func.functionName}()</span>
                    <span className="ml-2 text-coffee-500">(</span>
                    <span
                      className="text-xs capitalize"
                      style={{ color: getImpactColor(func.impact) }}
                    >
                      {func.impact}
                    </span>
                    <span className="text-coffee-500">)</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
