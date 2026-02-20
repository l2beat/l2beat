import { useState } from 'react'
import type { FunctionDetail, FunctionModuleScore } from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { getImpactColor } from './scoringShared'

interface FunctionBreakdownProps {
  score: FunctionModuleScore
}

/**
 * Function Breakdown Component
 * Displays flat list of permissioned functions with impact scores
 */
export function FunctionBreakdown({ score }: FunctionBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const functions = score.breakdown || []

  return (
    <div className="text-coffee-300">
      {/* Main header */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Functions:</span>
        <span>{score.inventory}</span>
      </div>

      {/* Function list */}
      <div className="mt-3 ml-2">
        {functions.length === 0 ? (
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
                {functions.length} scored function
                {functions.length !== 1 ? 's' : ''}
              </span>
            </button>
            {isExpanded && (
              <ul className="ml-8 space-y-1.5">
                {functions.map((func: FunctionDetail, idx: number) => (
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
