import { createContext, useCallback, useContext, useRef, useState } from 'react'

interface LogEntry {
  time: string
  message: string
}

const LogContext = createContext<{
  logs: LogEntry[]
  addLog: (message: string) => void
}>({ logs: [], addLog: () => {} })

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const idRef = useRef(0)
  const addLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { time, message }])
    idRef.current++
  }, [])

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLog() {
  return useContext(LogContext)
}
