import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'

/**
 * The project page's own sections, reused as they are so the assessment has
 * one source. Only their card is restyled, to sit with the bands around
 * them: the same corners, padding and title size, and no section numbers,
 * since the bands are not numbered.
 */
export function ExistingSections({
  items,
}: {
  items: ProjectDetailsSection[]
}) {
  if (items.length === 0) return null
  return (
    <div className="[&_[data-role=nav-section]>div:first-child>a>div]:hidden! md:[&_[data-role=nav-section]>div:first-child_h2]:text-heading-36 [&_[data-role=nav-section]]:mt-3 md:[&_[data-role=nav-section]]:mt-4 md:[&_[data-role=nav-section]]:rounded-2xl md:[&_[data-role=nav-section]]:px-10 md:[&_[data-role=nav-section]]:py-12">
      <HighlightableLinkContextProvider>
        <ProjectDetails items={items} />
      </HighlightableLinkContextProvider>
    </div>
  )
}
