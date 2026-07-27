import { type ReactNode, useCallback, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'

export function InteropCollapsibleSubsection({
  id,
  title,
  defaultOpen = false,
  children,
}: {
  id: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isHashTarget, setIsHashTarget] = useState(false)
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return

    const updateIsHashTarget = () =>
      setIsHashTarget(window.location.hash === `#${node.id}`)
    updateIsHashTarget()
    window.addEventListener('hashchange', updateIsHashTarget)

    return () => window.removeEventListener('hashchange', updateIsHashTarget)
  }, [])

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open && isHashTarget) {
      clearHash()
    }
  }

  return (
    <Collapsible
      ref={ref}
      id={id}
      open={isOpen || isHashTarget}
      onOpenChange={handleOpenChange}
      className="scroll-mt-14 rounded-lg border border-divider p-4"
    >
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3">
        <span className="text-heading-24 leading-none!">{title}</span>
        <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/Collapsible:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function clearHash() {
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
