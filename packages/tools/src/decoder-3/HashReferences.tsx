import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { KnownHash } from './knownHashes'

interface Target {
  path: string
  anchor: string
}

interface HashReferences {
  entries: KnownHash[]
  register(entry: KnownHash): void
  unregister(id: string): void
  target: Target | undefined
  reveal(target: Target): void
}

const Context = createContext<HashReferences | undefined>(undefined)

export function HashReferencesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, KnownHash>>({})
  const [target, setTarget] = useState<Target>()
  const register = useCallback((entry: KnownHash) => {
    setEntries((entries) => ({ ...entries, [entry.id]: entry }))
  }, [])
  const unregister = useCallback((id: string) => {
    setEntries((entries) => {
      const result = { ...entries }
      delete result[id]
      return result
    })
  }, [])

  useEffect(() => {
    if (!target) return
    const frame = requestAnimationFrame(() => {
      const element = document.getElementById(target.anchor)
      element?.scrollIntoView({ block: 'start' })
      element?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [target])

  const value = useMemo(
    () => ({
      entries: Object.values(entries),
      register,
      unregister,
      target,
      reveal: setTarget,
    }),
    [entries, register, unregister, target],
  )

  return <Context value={value}>{children}</Context>
}

export function useHashReferences() {
  const context = useContext(Context)
  if (!context) throw new Error('Missing HashReferencesProvider')
  return context
}

export function useRegisterKnownHash(entry: KnownHash | undefined) {
  const { register, unregister } = useHashReferences()
  useEffect(() => {
    if (!entry) return
    register(entry)
    return () => unregister(entry.id)
  }, [entry, register, unregister])
}
