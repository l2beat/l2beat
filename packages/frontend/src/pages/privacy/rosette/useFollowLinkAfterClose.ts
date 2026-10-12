import { type MouseEvent, useRef, useState } from 'react'

/**
 * For a drawer link that jumps elsewhere on the same page. The open drawer
 * locks scrolling and restores the old position as it closes, which would
 * undo the jump, so the link is followed only once the drawer has closed.
 */
export function useFollowLinkAfterClose(href: string) {
  const [open, setOpen] = useState(false)
  const followOnClose = useRef(false)

  return {
    open,
    setOpen,
    onLinkClick: (e: MouseEvent) => {
      e.preventDefault()
      followOnClose.current = true
      setOpen(false)
    },
    // Radix calls this once the closed drawer has unmounted.
    onCloseAutoFocus: (e: Event) => {
      if (!followOnClose.current) return
      followOnClose.current = false
      e.preventDefault()
      window.location.assign(href)
    },
  }
}
