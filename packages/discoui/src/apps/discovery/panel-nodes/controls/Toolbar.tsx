import type { ReactNode } from 'react'

export function Toolbar(props: { label: string; children: ReactNode }) {
  return (
    <div
      role="toolbar"
      aria-label={props.label}
      className="pointer-events-auto flex max-w-full select-none flex-wrap items-center justify-center gap-y-1 rounded-xl border border-coffee-600 bg-coffee-900/95 p-1 shadow-[0_24px_56px_-28px_#000000ee] backdrop-blur-xs"
    >
      {props.children}
    </div>
  )
}

export function ToolbarSection(props: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={props.label}
      className="not-first:ml-1 flex shrink-0 items-center gap-0.5 not-first:border-coffee-700 not-first:border-l not-first:pl-1"
    >
      {props.children}
    </div>
  )
}
