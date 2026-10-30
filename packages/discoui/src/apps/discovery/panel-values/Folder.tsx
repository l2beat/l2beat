import { type ReactNode, useState } from 'react'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'

export function Folder(props: {
  title: string
  children: ReactNode
  collapsed?: boolean
  expand?: boolean
}) {
  const [open, setOpen] = useState(!props.collapsed)
  if (props.expand && !open) {
    setOpen(true)
  }

  return (
    <div className="border-coffee-600 border-t">
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-6 w-full cursor-pointer select-none items-center gap-1.5 bg-coffee-800 px-3 font-semibold text-coffee-300 text-xs hover:text-coffee-100"
      >
        {open && <IconChevronDown className="size-3 shrink-0" />}
        {!open && <IconChevronRight className="size-3 shrink-0" />}
        {props.title}
      </button>
      {open && props.children}
    </div>
  )
}
