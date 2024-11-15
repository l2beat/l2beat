import { useEffect, useRef } from 'react'
import { executeCommand } from '../api/api'
import { useTerminalStore } from '../store/store'

export function TerminalPanel() {
  const abortControllerRef = useRef<AbortController>()
  const { output, isRunning, addOutput, setIsRunning, clear } =
    useTerminalStore()

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      abortControllerRef.current?.abort()
    }
  }, [])

  async function handleExecute() {
    if (isRunning) return
    clear()
    setIsRunning(true)

    try {
      const stream = await executeCommand()
      abortControllerRef.current = new AbortController()

      const reader = stream.getReader()
      while (!abortControllerRef.current.signal.aborted) {
        const { value, done } = await reader.read()
        if (done) break
        addOutput(value)
      }
    } catch (error) {
      addOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col p-2">
      <div className="mb-2">
        <button
          onClick={handleExecute}
          disabled={isRunning}
          className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
        >
          Run
        </button>
      </div>
      <div className="flex-1 overflow-auto whitespace-pre bg-coffee-800 p-2 font-mono">
        {output || 'No output'}
      </div>
    </div>
  )
}
