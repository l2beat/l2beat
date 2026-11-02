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

export interface PinnedProjects {
  pinned: SavedProject[]
  recent: SavedProject[]
  /** Stays true after the last unpin, so the pinning hint doesn't come back. */
  hasPinned: boolean
}

// Already in visitors' browsers: a new key would drop their projects.
export const STORAGE_KEY = 'l2beat-your-projects'
const CHANGE_EVENT = 'l2beat-pinned-projects-change'
/** Unpinned ones; pinned ones are kept on top of these, so they can't crowd them out. */
const MAX_RECENT = 8
const EMPTY: PinnedProjects = { pinned: [], recent: [], hasPinned: false }

let cachedRaw: string | null | undefined
let cached: PinnedProjects = EMPTY

// Storage can throw: blocked cookies make any access a SecurityError, and a
// full quota fails writes. Without its projects the nav still works, so both
// fall back quietly rather than taking the page down.

function read(): PinnedProjects {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return EMPTY
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parsePinnedProjects(raw)
  }
  return cached
}

/** Whatever is stored, written by an older version or edited by hand. */
function parsePinnedProjects(raw: string | null): PinnedProjects {
  if (!raw) return EMPTY
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return EMPTY
    const { pinned, recent, hasPinned } = value as Record<string, unknown>
    const pinnedProjects = toProjects(pinned)
    return {
      pinned: pinnedProjects,
      recent: toProjects(recent),
      hasPinned: hasPinned === true || pinnedProjects.length > 0,
    }
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

function write(update: (current: PinnedProjects) => PinnedProjects) {
  try {
    const current = read()
    const next = update(current)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...next,
        hasPinned: current.hasPinned || next.pinned.length > 0,
      }),
    )
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

export function usePinnedProjects(): PinnedProjects {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function recordProjectVisit(project: SavedProject) {
  write((current) => withVisit(current, project))
}

/**
 * Moves the project to the front of the recent ones. Its page carries its
 * current name and icon, so a pinned entry takes them too: icon URLs are
 * content-hashed and an old one stops resolving after a deploy.
 */
export function withVisit(
  current: PinnedProjects,
  project: SavedProject,
): PinnedProjects {
  const pinnedHrefs = new Set(current.pinned.map((p) => p.href))
  let unpinnedLeft = MAX_RECENT
  const recent = [
    project,
    ...current.recent.filter((p) => p.href !== project.href),
  ].filter((p) => pinnedHrefs.has(p.href) || unpinnedLeft-- > 0)
  return {
    ...current,
    pinned: current.pinned.map((p) => (p.href === project.href ? project : p)),
    recent,
  }
}

export function usePinnedState(project: SavedProject) {
  const { pinned } = usePinnedProjects()
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

export function pinProject(project: SavedProject) {
  write((current) => ({
    ...current,
    pinned: current.pinned.some((p) => p.href === project.href)
      ? current.pinned
      : [...current.pinned, project],
  }))
}

export function unpinProject(href: string) {
  write((current) => ({
    ...current,
    pinned: current.pinned.filter((p) => p.href !== href),
  }))
}
