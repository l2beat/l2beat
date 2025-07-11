// src/Popover.tsx
import React, { type ReactNode, useEffect, useRef, useState } from 'react'

interface PopoverProps {
  content: ReactNode
  children: ReactNode
}

export const Popover: React.FC<PopoverProps> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Toggle popover visibility
  const togglePopover = () => {
    setIsOpen((prev) => !prev)
  }

  // Close popover if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
      popoverRef.current &&
      !popoverRef.current.contains(target) &&
      triggerRef.current &&
      !triggerRef.current.contains(target)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={togglePopover}
        className="cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-2 w-64 rounded-md border-2 border-orange-500 bg-zinc-950 shadow-lg"
          role="dialog"
          aria-modal="true"
        >
          <div className="p-2">{content}</div>
        </div>
      )}
    </div>
  )
}
