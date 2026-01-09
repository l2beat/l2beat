import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCode } from '../../../api/api'
import type { ExternalCall } from '../../../api/types'
import { useCodeStore } from '../../../components/editor/store'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'
import { type BidirectionalCalls, groupCallsByType } from './useEdgeCallGraph'

interface EdgeCallGraphPopupProps {
  sourceAddress: string
  sourceName: string
  targetAddress: string
  targetName: string
  calls: BidirectionalCalls
  position: { x: number; y: number }
  onClose: () => void
}

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

export function EdgeCallGraphPopup({
  sourceAddress,
  sourceName,
  targetAddress,
  targetName,
  calls,
  position,
  onClose,
}: EdgeCallGraphPopupProps) {
  const { project } = useParams()
  const ref = useRef<HTMLDivElement>(null)
  const [functionOccurrenceCounters, setFunctionOccurrenceCounters] = useState<
    Record<string, number>
  >({})

  // Store hooks for navigation
  const selectContract = usePanelStore((state) => state.select)
  const ensurePanel = useMultiViewStore((state) => state.ensurePanel)
  const setActivePanel = useMultiViewStore((state) => state.setActivePanel)
  const { showRange, setSourceIndex } = useCodeStore()

  // Click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const box = ref.current?.getBoundingClientRect()
      if (
        !box ||
        e.clientX < box.left ||
        e.clientX > box.right ||
        e.clientY < box.top ||
        e.clientY > box.bottom
      ) {
        onClose()
      }
    }

    // We use setTimeout to ignore the click that opened the popup
    const timeout = setTimeout(
      () => window.addEventListener('click', onClick),
      0,
    )
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('click', onClick)
    }
  }, [ref, onClose])

  // Group outgoing calls (source → target) by type
  const outgoing = groupCallsByType(calls.outgoing)
  // Group incoming calls (target → source) by type
  const incoming = groupCallsByType(calls.incoming)

  const totalCalls = calls.outgoing.length + calls.incoming.length

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

      // Close the popup after navigation
      onClose()
    } catch (error) {
      console.error('Failed to navigate to function:', error)
    }
  }

  const handleSelectContract = (address: string) => {
    selectContract(address)
    onClose()
  }

  // Calculate position - ensure popup stays within viewport
  const style: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)',
    marginTop: -10, // Small gap above cursor
    zIndex: 1000,
  }

  return (
    <div
      ref={ref}
      className="max-h-80 w-80 overflow-auto rounded border border-coffee-400 bg-coffee-800 text-sm shadow-xl"
      style={style}
    >
      {/* Header */}
      <div className="sticky top-0 border-coffee-600 border-b bg-coffee-700 p-2">
        <div className="flex items-center gap-2 text-xs">
          <span
            className="cursor-pointer truncate font-semibold text-aux-blue hover:underline"
            onClick={() => handleSelectContract(sourceAddress)}
            title={sourceAddress}
          >
            {sourceName}
          </span>
          <span className="text-coffee-400">↔</span>
          <span
            className="cursor-pointer truncate font-semibold text-aux-green hover:underline"
            onClick={() => handleSelectContract(targetAddress)}
            title={targetAddress}
          >
            {targetName}
          </span>
        </div>
        <div className="mt-1 text-coffee-400 text-xs">
          {totalCalls} call{totalCalls !== 1 ? 's' : ''} (
          {calls.outgoing.length} outgoing, {calls.incoming.length} incoming)
        </div>
      </div>

      {/* Calls list */}
      <div className="p-2">
        {/* Outgoing calls: source → target */}
        {calls.outgoing.length > 0 && (
          <div className="mb-3">
            <div className="mb-1 font-semibold text-xs">
              <span className="text-aux-blue">{sourceName}</span>
              <span className="text-coffee-400"> → </span>
              <span className="text-aux-green">{targetName}</span>
            </div>

            {/* Outgoing Writes */}
            {outgoing.writes.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-aux-orange text-xs">
                  <span className="text-base">→</span>
                  <span>Writes ({outgoing.writes.length})</span>
                </div>
                <CallsList
                  calls={outgoing.writes}
                  callerAddress={sourceAddress}
                  targetAddress={targetAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}

            {/* Outgoing Reads */}
            {outgoing.reads.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-aux-cyan text-xs">
                  <span className="text-base">←</span>
                  <span>Reads ({outgoing.reads.length})</span>
                </div>
                <CallsList
                  calls={outgoing.reads}
                  callerAddress={sourceAddress}
                  targetAddress={targetAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}

            {/* Outgoing Unknown */}
            {outgoing.unknown.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-coffee-400 text-xs">
                  <span className="text-base">?</span>
                  <span>Unknown ({outgoing.unknown.length})</span>
                </div>
                <CallsList
                  calls={outgoing.unknown}
                  callerAddress={sourceAddress}
                  targetAddress={targetAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}
          </div>
        )}

        {/* Incoming calls: target → source */}
        {calls.incoming.length > 0 && (
          <div>
            <div className="mb-1 font-semibold text-xs">
              <span className="text-aux-green">{targetName}</span>
              <span className="text-coffee-400"> → </span>
              <span className="text-aux-blue">{sourceName}</span>
            </div>

            {/* Incoming Writes */}
            {incoming.writes.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-aux-orange text-xs">
                  <span className="text-base">→</span>
                  <span>Writes ({incoming.writes.length})</span>
                </div>
                <CallsList
                  calls={incoming.writes}
                  callerAddress={targetAddress}
                  targetAddress={sourceAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}

            {/* Incoming Reads */}
            {incoming.reads.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-aux-cyan text-xs">
                  <span className="text-base">←</span>
                  <span>Reads ({incoming.reads.length})</span>
                </div>
                <CallsList
                  calls={incoming.reads}
                  callerAddress={targetAddress}
                  targetAddress={sourceAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}

            {/* Incoming Unknown */}
            {incoming.unknown.length > 0 && (
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2 font-semibold text-coffee-400 text-xs">
                  <span className="text-base">?</span>
                  <span>Unknown ({incoming.unknown.length})</span>
                </div>
                <CallsList
                  calls={incoming.unknown}
                  callerAddress={targetAddress}
                  targetAddress={sourceAddress}
                  onOpenInCode={handleOpenInCode}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface CallsListProps {
  calls: ExternalCall[]
  callerAddress: string
  targetAddress: string
  onOpenInCode: (contractAddress: string, functionName: string) => void
}

function CallsList({
  calls,
  callerAddress,
  targetAddress,
  onOpenInCode,
}: CallsListProps) {
  return (
    <div className="space-y-1 pl-3 text-xs">
      {calls.map((call, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <span
            className="cursor-pointer text-coffee-200 hover:text-aux-blue"
            onClick={() => onOpenInCode(callerAddress, call.callerFunction)}
            title="Open caller in Code panel"
          >
            {call.callerFunction}()
          </span>
          <span className="text-coffee-500">→</span>
          <span
            className="cursor-pointer text-aux-teal hover:text-aux-blue"
            onClick={() => onOpenInCode(targetAddress, call.calledFunction)}
            title="Open target in Code panel"
          >
            {call.calledFunction}()
          </span>
        </div>
      ))}
    </div>
  )
}
