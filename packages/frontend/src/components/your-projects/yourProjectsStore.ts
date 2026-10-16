import { useCallback, useSyncExternalStore } from 'react'

// The visitor's own projects, kept in their browser only: the ones they pin
// and the ones they opened last. Each is stored with what the nav draws, so
// no page has to look projects up.

export interface SavedProject {
  /** The project page's path, unique across project kinds. */
  href: string
  name: string
  iconUrl: string
}

interface YourProjects {
  pinned: SavedProject[]
  recent: SavedProject[]
}

const STORAGE_KEY = 'l2beat-your-projects'
const CHANGE_EVENT = 'l2beat-your-projects-change'
const MAX_RECENT = 8
const EMPTY: YourProjects = { pinned: [], recent: [] }

let cachedRaw: string | null | undefined
let cached: YourProjects = EMPTY

// Storage can throw: blocked cookies make any access a SecurityError, and a
// full quota fails writes. Without its projects the nav still works, so both
// fall back quietly rather than taking the page down.

function read(): YourProjects {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return EMPTY
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parseYourProjects(raw)
  }
  return cached
}

/** Whatever is stored, written by an older version or edited by hand. */
export function parseYourProjects(raw: string | null): YourProjects {
  if (!raw) return EMPTY
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return EMPTY
    const { pinned, recent } = value as Record<string, unknown>
    return { pinned: toProjects(pinned), recent: toProjects(recent) }
  } catch {
    return EMPTY
  }
}

function toProjects(value: unknown): SavedProject[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is SavedProject =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.href === 'string' &&
      typeof item.name === 'string' &&
      typeof item.iconUrl === 'string',
  )
}

function write(update: (current: YourProjects) => YourProjects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(update(read())))
  } catch {
    return
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(listener: () => void) {
  // `storage` fires for changes made in other tabs.
  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useYourProjects(): YourProjects {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function recordProjectVisit(project: SavedProject) {
  write((current) => ({
    ...current,
    recent: [
      project,
      ...current.recent.filter((p) => p.href !== project.href),
    ].slice(0, MAX_RECENT),
  }))
}

export function usePinnedState(project: SavedProject) {
  const { pinned } = useYourProjects()
  const isPinned = pinned.some((p) => p.href === project.href)
  const toggle = useCallback(() => {
    write((current) => ({
      ...current,
      pinned: current.pinned.some((p) => p.href === project.href)
        ? current.pinned.filter((p) => p.href !== project.href)
        : [...current.pinned, project],
    }))
  }, [project])
  return { isPinned, toggle }
}

export function unpinProject(href: string) {
  write((current) => ({
    ...current,
    pinned: current.pinned.filter((p) => p.href !== href),
  }))
}
