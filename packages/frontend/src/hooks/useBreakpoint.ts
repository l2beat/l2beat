import { useSyncExternalStore } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Ascending, so the last threshold the width clears wins.
const MIN_WIDTHS: [Breakpoint, number][] = [
  ['sm', 550],
  ['md', 768],
  ['lg', 1200],
  ['xl', 1440],
  ['2xl', 1920],
]

export function useBreakpoint(): Breakpoint | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function breakpointFromWidth(width: number): Breakpoint {
  let breakpoint: Breakpoint = 'xs'
  for (const [name, minWidth] of MIN_WIDTHS) {
    if (width >= minWidth) breakpoint = name
  }
  return breakpoint
}

// One window listener shared by every consumer. `resize` is a discrete event
// for React, so a setState per consumer would flush a separate synchronous
// render between listeners; sharing a store turns a breakpoint change into a
// single render pass and makes the other resize events free.
let current: Breakpoint | undefined
const subscribers = new Set<() => void>()

function subscribe(onChange: () => void) {
  if (subscribers.size === 0) {
    window.addEventListener('resize', onWindowResize)
  }
  subscribers.add(onChange)
  return () => {
    subscribers.delete(onChange)
    if (subscribers.size === 0) {
      window.removeEventListener('resize', onWindowResize)
      // Nobody hears resizes now, so the next consumer must measure afresh.
      current = undefined
    }
  }
}

function onWindowResize() {
  const next = breakpointFromWidth(window.innerWidth)
  if (next === current) return
  current = next
  for (const notify of subscribers) notify()
}

function getSnapshot() {
  current ??= breakpointFromWidth(window.innerWidth)
  return current
}

function getServerSnapshot() {
  return undefined
}
