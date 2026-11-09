import type { ProjectDetailsSection } from '~/components/projects/sections/types'

interface MergeOptions {
  /** Where the other page's new sections go; at the end if absent. */
  insertAfterId: string
  /** The other page's sections the merged page leaves out. */
  drop?: string[]
}

/**
 * Adds another section's content to a project page built for its base
 * section. Sections with an id the base already shows are the same data (e.g.
 * permissions), so the base's stays.
 */
export function mergeProjectSections(
  base: ProjectDetailsSection[],
  other: ProjectDetailsSection[],
  options: MergeOptions,
): ProjectDetailsSection[] {
  const { drop = [] } = options
  const baseIds = new Set(base.map((section) => section.props.id))

  const merged = [...base]
  const added = other.filter(
    (section) =>
      !baseIds.has(section.props.id) && !drop.includes(section.props.id),
  )

  const index = merged.findIndex(
    (section) => section.props.id === options.insertAfterId,
  )
  merged.splice(index === -1 ? merged.length : index + 1, 0, ...added)
  return merged
}
