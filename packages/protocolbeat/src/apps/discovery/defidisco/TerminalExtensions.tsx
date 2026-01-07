import React, { useState } from 'react'
import { useTerminalStore } from '../panel-terminal/store'
import { AIPermissionsScanDialog } from './AIPermissionsScanDialog'

interface Props {
  project: string
}

export function TerminalExtensions({ project }: Props) {
  const { generatePermissionsReport, fetchFunds, generateCallGraph, command } = useTerminalStore()
  const [showScanDialog, setShowScanDialog] = useState(false)

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
        onClick={() => generatePermissionsReport(project)}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Generate Permissions Report
      </button>
      <button
        onClick={() => fetchFunds(project)}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Fetch Funds
      </button>
      <button
        onClick={() => generateCallGraph(project)}
        disabled={command.inFlight}
        className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
      >
        Generate Call Graph
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