import type { ReactNode } from 'react'
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
  return (
    <Collapsible
      id={id}
      defaultOpen={defaultOpen}
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
