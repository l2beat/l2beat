import { type ReactNode, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { cn } from '~/utils/cn'

interface SummaryView {
  id: string
  label: string
  content: ReactNode
}

/**
 * The summary of a page that merges sections with a summary each, one shown
 * at a time. Every view is rendered, the hidden ones only hidden, so crawlers
 * read all of them. A stopgap until the merged page gets one summary.
 */
export function SummaryViewSwitch({ views }: { views: SummaryView[] }) {
  const [selected, setSelected] = useState(views[0]?.id)
  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full scroll-mt-[100vh]"
    >
      <div className="flex items-center gap-2 max-md:px-4 max-md:pb-3 md:mb-3">
        <span className="font-medium text-label-value-12 text-secondary">
          Summary view
        </span>
        <RadioGroup
          name="summaryView"
          value={selected}
          onValueChange={setSelected}
        >
          {views.map((view) => (
            <RadioGroupItem key={view.id} value={view.id}>
              {view.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      {views.map((view) => (
        <div key={view.id} className={cn(view.id !== selected && 'hidden')}>
          {view.content}
        </div>
      ))}
    </section>
  )
}
