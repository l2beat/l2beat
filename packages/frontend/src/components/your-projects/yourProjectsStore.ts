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

function read(): YourProjects {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parse(raw)
  }
  return cached
}

function parse(raw: string | null): YourProjects {
  if (!raw) return EMPTY
  try {
    const value = JSON.parse(raw) as Partial<YourProjects>
    return {
      pinned: Array.isArray(value.pinned) ? value.pinned : [],
      recent: Array.isArray(value.recent) ? value.recent : [],
    }
  } catch {
    return EMPTY
  }
}

function write(update: (current: YourProjects) => YourProjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(update(read())))
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
