import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { compileReview, countLinesOfCode } from '../../../api/api'
import { useTerminalStore } from '../panel-terminal/store'
import { AIPermissionsScanDialog } from './AIPermissionsScanDialog'

interface Props {
  project: string
}

export function TerminalExtensions({ project }: Props) {
  const queryClient = useQueryClient()
  const { fetchFunds, generateCallGraph, command } = useTerminalStore()
  const [showScanDialog, setShowScanDialog] = useState(false)
  const [compiling, setCompiling] = useState(false)
  const [countingLoc, setCountingLoc] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowScanDialog(true)}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Scan Permissions
      </button>
      <button
        onClick={() => {
          fetchFunds(project).then(() => {
            queryClient.invalidateQueries({ queryKey: ['funds-data', project] })
          })
        }}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Fetch Funds
      </button>
      <button
        onClick={() => {
          generateCallGraph(project).then(() => {
            queryClient.invalidateQueries({ queryKey: ['call-graph', project] })
          })
        }}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Generate Call Graph
      </button>
      <button
        onClick={() => {
          setCompiling(true)
          compileReview(project)
            .then((result) => {
              if (result.status === 'success') {
                alert(`Review compiled: ${result.path}`)
              } else if (result.status === 'skipped') {
                alert(`Skipped: ${result.reason}`)
              } else {
                alert(`Error: ${result.error}`)
              }
            })
            .catch((err) => {
              alert(`Failed to compile: ${err.message}`)
            })
            .finally(() => setCompiling(false))
        }}
        disabled={command.inFlight || compiling}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        {compiling ? 'Compiling...' : 'Compile Review'}
      </button>

      <button
        onClick={() => {
          setCountingLoc(true)
          countLinesOfCode(project)
            .then((result) => {
              alert(
                `Lines of Code: ${result.count.toLocaleString()}\n\n` +
                  `Contracts: ${result.details.uniqueContracts} unique ` +
                  `(${result.details.externalSkipped} external skipped, ` +
                  `${result.details.duplicateSkipped} duplicates skipped)\n` +
                  `Declarations: ${result.details.uniqueDeclarations} unique ` +
                  `(of ${result.details.declarationsFound} total)\n` +
                  `Files processed: ${result.details.filesProcessed}`,
              )
            })
            .catch((err) => {
              alert(`Failed to count lines: ${err.message}`)
            })
            .finally(() => setCountingLoc(false))
        }}
        disabled={command.inFlight || countingLoc}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        {countingLoc ? 'Counting...' : 'Count Lines of Code'}
      </button>

      {showScanDialog && (
        <AIPermissionsScanDialog
          project={project}
          onClose={() => setShowScanDialog(false)}
        />
      )}
    </>
  )
}
