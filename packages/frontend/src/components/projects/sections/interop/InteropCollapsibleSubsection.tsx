import type { ReactNode } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'
import { Subsection, SubsectionHeading } from '../Subsection'

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
      <Subsection
        title={
          <SubsectionHeading className="text-heading-24 leading-none!">
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3">
              {title}
              <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/Collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SubsectionHeading>
        }
      >
        <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
      </Subsection>
    </Collapsible>
  )
}
