import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCallGraphData, getCode } from '../../../api/api'
import type { ContractCallGraph, ExternalCall } from '../../../api/types'
import { useCodeStore } from '../../../components/editor/store'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'

// Helper function to find all function occurrences in source code
function findAllFunctionOccurrences(
  sources: Array<{ name: string; code: string }>,
  functionName: string,
): Array<{ startOffset: number; length: number; sourceIndex: number }> {
  const occurrences: Array<{
    startOffset: number
    length: number
    sourceIndex: number
  }> = []

  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex]
    if (!source) continue

    // Look for function definition with various patterns
    const patterns = [
      new RegExp(`function\\s+${functionName}\\s*\\(`, 'gi'),
      new RegExp(
        `\\b${functionName}\\s*\\(.*?\\)\\s*(?:public|external|internal|private)?(?:\\s+\\w+)*\\s*(?:returns\\s*\\([^)]*\\))?\\s*{`,
        'gi',
      ),
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(source.code)) !== null) {
        const startOffset = match.index
        // Try to find the end of the function signature (up to opening brace or semicolon)
        const remainingCode = source.code.slice(startOffset)
        const endMatch = remainingCode.match(/[{;]/)
        const length = endMatch ? endMatch.index! + 1 : functionName.length + 10

        occurrences.push({ startOffset, length, sourceIndex })
      }
    }
  }

  return occurrences
}

export function CallGraphPanel() {
  const { project } = useParams()
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(
    new Set(),
  )
  const [functionOccurrenceCounters, setFunctionOccurrenceCounters] = useState<
    Record<string, number>
  >({})

  // Store hooks for navigation
  const selectContract = usePanelStore((state) => state.select)
  const ensurePanel = useMultiViewStore((state) => state.ensurePanel)
  const setActivePanel = useMultiViewStore((state) => state.setActivePanel)
  const { showRange, setSourceIndex } = useCodeStore()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['call-graph', project],
    queryFn: () => getCallGraphData(project),
  })

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-aux-red">
        Error loading call graph data
      </div>
    )
  }

  if (!data || Object.keys(data.contracts).length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-coffee-400">
        <div>No call graph data available</div>
        <div className="text-sm">
          Use the "Generate Call Graph" button in the Terminal panel
        </div>
      </div>
    )
  }

  const contracts = Object.values(data.contracts)

  // Calculate statistics
  const totalCalls = contracts.reduce(
    (sum, c) => sum + c.externalCalls.length,
    0,
  )
  const resolvedCalls = contracts.reduce(
    (sum, c) =>
      sum + c.externalCalls.filter((call) => call.resolvedAddress).length,
    0,
  )
  const viewCalls = contracts.reduce(
    (sum, c) =>
      sum + c.externalCalls.filter((call) => call.isViewCall === true).length,
    0,
  )
  const writeCalls = contracts.reduce(
    (sum, c) =>
      sum + c.externalCalls.filter((call) => call.isViewCall === false).length,
    0,
  )
  const errorCount = contracts.filter((c) => c.error).length
  const skippedCount = contracts.filter((c) => c.skipped).length
  const successCount = contracts.length - errorCount - skippedCount

  const toggleContract = (address: string) => {
    setExpandedContracts((prev) => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  const handleOpenInCode = async (
    contractAddress: string,
    functionName: string,
  ) => {
    if (!project) return

    try {
      // First select the contract so the Code panel shows its source
      selectContract(contractAddress)

      // Ensure Code panel is open and active
      ensurePanel('code')
      setActivePanel('code')

      // Fetch source code for the contract
      const codeResponse = await getCode(project, contractAddress)

      // Find all occurrences of the function
      const allOccurrences = findAllFunctionOccurrences(
        codeResponse.sources,
        functionName,
      )

      if (allOccurrences.length === 0) {
        console.warn(`Function "${functionName}" not found in any source file`)
        return
      }

      // Create a key for cycling through occurrences
      const functionKey = `${contractAddress}:${functionName}`

      // Get current counter for this function (defaults to 0)
      const currentCounter = functionOccurrenceCounters[functionKey] || 0

      // Calculate next occurrence index (cycle through all occurrences)
      const nextOccurrenceIndex = currentCounter % allOccurrences.length
      const functionLocation = allOccurrences[nextOccurrenceIndex]

      if (functionLocation) {
        // Update the counter for next time
        setFunctionOccurrenceCounters((prev) => ({
          ...prev,
          [functionKey]: currentCounter + 1,
        }))

        // Navigate to the selected occurrence
        setSourceIndex(contractAddress, functionLocation.sourceIndex)
        showRange(contractAddress, {
          startOffset: functionLocation.startOffset,
          length: functionLocation.length,
        })
      }
    } catch (error) {
      console.error('Failed to navigate to function:', error)
    }
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10 border-coffee-500 border-b bg-coffee-600 p-2">
        <div className="mb-2 font-bold text-lg">Call Graph Analysis</div>
        <div className="flex gap-4 text-xs">
          <span>
            Contracts: <span className="text-aux-green">{successCount}</span>
          </span>
          <span>
            Skipped: <span className="text-aux-yellow">{skippedCount}</span>
          </span>
          <span>
            Errors: <span className="text-aux-red">{errorCount}</span>
          </span>
          <span>
            Calls:{' '}
            <span className="text-aux-blue">
              {resolvedCalls}/{totalCalls}
            </span>
          </span>
          <span>
            Reads: <span className="text-aux-cyan">{viewCalls}</span>
          </span>
          <span>
            Writes: <span className="text-aux-orange">{writeCalls}</span>
          </span>
        </div>
        <div className="mt-1 text-coffee-400 text-xs">
          Last updated: {new Date(data.lastModified).toLocaleString()}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {contracts.map((contract) => (
          <ContractSection
            key={contract.address}
            contract={contract}
            isExpanded={expandedContracts.has(contract.address)}
            onToggle={() => toggleContract(contract.address)}
            onOpenInCode={handleOpenInCode}
          />
        ))}
      </div>
    </div>
  )
}

interface ContractSectionProps {
  contract: ContractCallGraph
  isExpanded: boolean
  onToggle: () => void
  onOpenInCode: (contractAddress: string, functionName: string) => void
}

function ContractSection({
  contract,
  isExpanded,
  onToggle,
  onOpenInCode,
}: ContractSectionProps) {
  const selectGlobal = usePanelStore((state) => state.select)

  const callCount = contract.externalCalls.length
  const resolvedCount = contract.externalCalls.filter(
    (c) => c.resolvedAddress,
  ).length

  const getStatusColor = () => {
    if (contract.error) return 'text-aux-red'
    if (contract.skipped) return 'text-aux-yellow'
    return 'text-aux-green'
  }

  const getStatusText = () => {
    if (contract.error) return `Error: ${contract.error.slice(0, 50)}...`
    if (contract.skipped) return `Skipped: ${contract.skipReason}`
    return `${callCount} calls (${resolvedCount} resolved)`
  }

  const handleContractClick = (e: React.MouseEvent, address: string) => {
    e.stopPropagation()
    selectGlobal(address)
  }

  return (
    <div className="border-coffee-500 border-b">
      <div
        className="flex cursor-pointer items-center justify-between p-2 hover:bg-coffee-500"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-coffee-400">{isExpanded ? '▼' : '▶'}</span>
          <span
            className="cursor-pointer font-semibold text-aux-blue hover:underline"
            onClick={(e) => handleContractClick(e, contract.address)}
          >
            {contract.name}
          </span>
          <span className="text-coffee-400 text-xs">
            {contract.address.replace('eth:', '').slice(0, 10)}...
          </span>
        </div>
        <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
      </div>
      {isExpanded &&
        !contract.skipped &&
        !contract.error &&
        contract.externalCalls.length > 0 && (
          <div className="bg-coffee-700 p-2">
            <ExternalCallsList
              calls={contract.externalCalls}
              callerContractAddress={contract.address}
              onOpenInCode={onOpenInCode}
            />
          </div>
        )}
    </div>
  )
}

interface ExternalCallsListProps {
  calls: ExternalCall[]
  callerContractAddress: string
  onOpenInCode: (contractAddress: string, functionName: string) => void
}

function ExternalCallsList({
  calls,
  callerContractAddress,
  onOpenInCode,
}: ExternalCallsListProps) {
  const selectGlobal = usePanelStore((state) => state.select)

  // Group calls by caller function using Map to avoid prototype pollution issues
  const callsByFunctionMap = new Map<string, ExternalCall[]>()
  for (const call of calls) {
    const existing = callsByFunctionMap.get(call.callerFunction)
    if (existing) {
      existing.push(call)
    } else {
      callsByFunctionMap.set(call.callerFunction, [call])
    }
  }
  const callsByFunction = Object.fromEntries(callsByFunctionMap)

  const handleAddressClick = (address: string) => {
    selectGlobal(address)
  }

  return (
    <div className="space-y-2">
      {Object.entries(callsByFunction).map(([funcName, funcCalls]) => (
        <div key={funcName} className="text-xs">
          <div
            className="mb-1 inline-block cursor-pointer font-semibold text-coffee-200 hover:text-aux-blue"
            onClick={() => onOpenInCode(callerContractAddress, funcName)}
            title="Open in Code panel"
          >
            {funcName}()
          </div>
          <div className="ml-4 space-y-1">
            {funcCalls.map((call, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Read/Write indicator */}
                {call.isViewCall === true && (
                  <span className="text-aux-cyan" title="Read (view/pure)">
                    R
                  </span>
                )}
                {call.isViewCall === false && (
                  <span
                    className="text-aux-orange"
                    title="Write (state-changing)"
                  >
                    W
                  </span>
                )}
                {call.isViewCall === undefined && (
                  <span className="text-coffee-400" title="Unknown">
                    ?
                  </span>
                )}
                <span className="text-coffee-200">{call.storageVariable}</span>
                <span className="text-coffee-400">→</span>
                {call.resolvedAddress ? (
                  <span
                    className="cursor-pointer text-aux-teal hover:text-aux-blue"
                    onClick={() =>
                      onOpenInCode(call.resolvedAddress!, call.calledFunction)
                    }
                    title="Open in Code panel"
                  >
                    {call.calledFunction}()
                  </span>
                ) : (
                  <span className="text-aux-teal">{call.calledFunction}()</span>
                )}
                {call.resolvedAddress ? (
                  <span
                    className="cursor-pointer text-aux-green hover:underline"
                    onClick={() => handleAddressClick(call.resolvedAddress!)}
                  >
                    [
                    {call.resolvedContractName ||
                      call.resolvedAddress.slice(0, 14)}
                    ]
                  </span>
                ) : (
                  <span className="text-aux-yellow">
                    [unresolved: {call.interfaceType}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
