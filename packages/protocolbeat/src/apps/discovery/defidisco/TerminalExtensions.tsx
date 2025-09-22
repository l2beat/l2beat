import React from 'react'
import { useTerminalStore } from '../panel-terminal/store'

interface Props {
  project: string
}

export function TerminalExtensions({ project }: Props) {
  const { generatePermissionsReport, command } = useTerminalStore()

  return (
    <button
      onClick={() => generatePermissionsReport(project)}
      disabled={command.inFlight}
      className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
    >
      Generate Permissions Report
    </button>
  )
}