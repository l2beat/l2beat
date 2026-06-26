import type { ReactNode } from 'react'

export function ControlGroup(props: { children: ReactNode }) {
  return (
    <div className="flex select-none items-stretch gap-2 rounded-2xl bg-coffee-900/95 px-3 py-2 shadow-[0_24px_56px_-28px_#000000ee] backdrop-blur-sm max-md:text-xs">
      {props.children}
    </div>
  )
}
