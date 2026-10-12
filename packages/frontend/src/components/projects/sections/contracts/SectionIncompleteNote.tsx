import { SECTION_INCOMPLETE_NOTE } from '../sectionCopy'

export function SectionIncompleteNote() {
  return (
    <div className="my-2 rounded-lg bg-blue-450/20 px-2 py-1 text-blue-700 text-xs md:text-base dark:text-blue-300">
      <strong>Note:</strong> {SECTION_INCOMPLETE_NOTE}
    </div>
  )
}
