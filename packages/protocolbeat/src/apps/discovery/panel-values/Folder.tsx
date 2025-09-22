import { type ReactNode, useState } from 'react'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'

export function Folder(props: {
  title: string
  children: ReactNode
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(!props.collapsed)

  return (
    <div className="overflow-x-auto border-coffee-600 border-t">
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 font-bold text-xs uppercase"
      >
        {open && <IconChevronDown />}
        {!open && <IconChevronRight />}
        {props.title}
      </button>
      {open && props.children}
    </div>
  )
}
