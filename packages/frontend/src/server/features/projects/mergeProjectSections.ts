import type { ProjectDetailsSection } from '~/components/projects/sections/types'

interface MergeOptions {
  /** Where the other page's new sections go; at the end if absent. */
  insertAfterId: string
  /** Shown by both pages from the same data: the other page's version wins. */
  replace?: string[]
  /** The other page's sections the merged page leaves out. */
  drop?: string[]
  /** Said differently by both pages: both stay, each under its own title. */
  relabel?: Record<
    string,
    { base: string; other: { id: string; title: string } }
  >
}

/**
 * Adds another section's content to a project page built for its base
 * section. Sections with an id the base already shows are the same data (e.g.
 * permissions), so the base's stays, unless `replace` or `relabel` say so.
 */
export function mergeProjectSections(
  base: ProjectDetailsSection[],
  other: ProjectDetailsSection[],
  options: MergeOptions,
): ProjectDetailsSection[] {
  const { replace = [], drop = [], relabel = {} } = options
  const baseIds = new Set(base.map((section) => section.props.id))
  const otherById = new Map(other.map((section) => [section.props.id, section]))

  const merged = base.map((section): ProjectDetailsSection => {
    const id = section.props.id
    const replacement = replace.includes(id) && otherById.get(id)
    if (replacement) return replacement
    const label = relabel[id]?.base
    return label
      ? ({
          ...section,
          sideNavTitle: label,
          props: { ...section.props, title: label },
        } as ProjectDetailsSection)
      : section
  })

  const added = other.flatMap((section): ProjectDetailsSection[] => {
    const id = section.props.id
    const label = relabel[id]?.other
    if (label) {
      return [
        {
          ...section,
          sideNavTitle: label.title,
          props: { ...section.props, ...label },
        } as ProjectDetailsSection,
      ]
    }
    return baseIds.has(id) || drop.includes(id) ? [] : [section]
  })

  const index = merged.findIndex(
    (section) => section.props.id === options.insertAfterId,
  )
  merged.splice(index === -1 ? merged.length : index + 1, 0, ...added)
  return merged
}
