import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import { clearSavedState } from './clearSavedState'

const LAST_RESET_KEY = 'app-error-last-reset'
const RESET_COOLDOWN_MS = 30_000

export function AppErrorPage() {
  const error = useRouteError()
  const lastResetMs = Number(sessionStorage.getItem(LAST_RESET_KEY) ?? 0)
  const shouldReset = Date.now() - lastResetMs > RESET_COOLDOWN_MS

  useEffect(() => {
    console.error(error)
    if (!shouldReset) {
      return
    }
    sessionStorage.setItem(LAST_RESET_KEY, String(Date.now()))
    clearSavedState(localStorage)
    window.location.reload()
  }, [error, shouldReset])

  if (shouldReset) {
    return null
  }
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <h1 className="font-bold text-2xl">Unexpected application error</h1>
      <pre className="whitespace-pre-wrap text-sm">
        {error instanceof Error ? error.stack : String(error)}
      </pre>
    </div>
  )
}
