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
      className="scroll-mt-section-nav rounded-lg border border-divider"
    >
      <Subsection
        title={
          <SubsectionHeading className="font-semibold text-label-value-16">
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 md:px-6">
              {title}
              <ChevronIcon className="size-4 shrink-0 fill-secondary transition-transform group-data-[state=open]/Collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SubsectionHeading>
        }
      >
        <CollapsibleContent className="px-4 pb-4 md:px-6">
          {children}
        </CollapsibleContent>
      </Subsection>
    </Collapsible>
  )
}
