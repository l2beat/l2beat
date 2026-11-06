import type { ProjectDetailsSection } from '~/components/projects/sections/types'

interface MergeOptions {
  /** Where the other page's new sections go; at the end if absent. */
  insertAfterId: string
  /** Shown by both pages from the same data: the other page's version wins. */
  replace?: string[]
  /** The other page's sections the merged page leaves out. */
  drop?: string[]
}

/**
 * Adds another section's content to a project page built for its base
 * section. Sections with an id the base already shows are the same data (e.g.
 * permissions), so the base's stays, unless `replace` says otherwise.
 */
export function mergeProjectSections(
  base: ProjectDetailsSection[],
  other: ProjectDetailsSection[],
  options: MergeOptions,
): ProjectDetailsSection[] {
  const { replace = [], drop = [] } = options
  const baseIds = new Set(base.map((section) => section.props.id))
  const otherById = new Map(other.map((section) => [section.props.id, section]))

  const merged = base.map(
    (section) =>
      (replace.includes(section.props.id) && otherById.get(section.props.id)) ||
      section,
  )
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
