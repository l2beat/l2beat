import type { ProjectDetailsSection } from '~/components/projects/sections/types'

/**
 * The sections with more of them placed before the first one that has any of
 * the ids, or at the end when the page has none of those.
 */
export function insertSectionsBefore(
  sections: ProjectDetailsSection[],
  ids: string[],
  added: ProjectDetailsSection[],
): ProjectDetailsSection[] {
  const found = sections.findIndex((section) => ids.includes(section.props.id))
  const index = found === -1 ? sections.length : found
  return [...sections.slice(0, index), ...added, ...sections.slice(index)]
}

/** The sections, with one more id that links to the section `id` may use. */
export function withSectionAlias(
  sections: ProjectDetailsSection[],
  id: string,
  aliasId: string,
): ProjectDetailsSection[] {
  return sections.map((section) =>
    section.props.id === id
      ? ({
          ...section,
          props: { ...section.props, aliasIds: [aliasId] },
        } as ProjectDetailsSection)
      : section,
  )
}
