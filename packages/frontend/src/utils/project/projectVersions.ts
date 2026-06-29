/**
 * Central registry that links together different *versions* of the same project
 * (e.g. CCTP v1 / CCTP v2). Each version is a standalone project with its own
 * page; this file is the single place that connects them, so a project page
 * title can offer a switcher between the versions.
 *
 * Versions are NOT required to be "v1/v2" — the `label` is an arbitrary string
 * (e.g. "Lite"/"Pro", "2023"/"2024"). The order of the `versions` array is the
 * order shown in the switcher, so list the version you want on top first.
 */
export interface ProjectVersion {
  /** Project slug. Used to match the current page and to build the target URL. */
  slug: string
  /**
   * The switchable token shown in the dropdown. It is also underlined inside the
   * project title, so it should match the differing part of the title
   * (e.g. title "CCTP v1" -> label "v1").
   */
  label: string
}

export interface ProjectVersionGroup {
  versions: ProjectVersion[]
}

export const PROJECT_VERSION_GROUPS: ProjectVersionGroup[] = [
  {
    // Newer on top.
    versions: [
      { slug: 'cctpv2', label: 'v2' },
      { slug: 'cctpv1', label: 'v1' },
    ],
  },
]

const GROUP_BY_SLUG = new Map<string, ProjectVersionGroup>()
for (const group of PROJECT_VERSION_GROUPS) {
  for (const version of group.versions) {
    GROUP_BY_SLUG.set(version.slug, group)
  }
}

export interface ProjectVersionSwitcher {
  /** The token to underline within the title (the current version's label). */
  current: string
  options: {
    label: string
    href: string
    selected: boolean
  }[]
}

/**
 * Resolves the version switcher for a given project page. Returns `undefined`
 * when the project is not part of any version group.
 *
 * @param slug current project slug
 * @param buildHref builds the page URL for a sibling version's slug. URL
 *   patterns are page-type specific (interop, scaling, ...), so the caller
 *   provides this.
 */
export function getProjectVersionSwitcher(
  slug: string,
  buildHref: (slug: string) => string,
): ProjectVersionSwitcher | undefined {
  const group = GROUP_BY_SLUG.get(slug)
  if (!group) return undefined

  const current = group.versions.find((version) => version.slug === slug)
  if (!current) return undefined

  return {
    current: current.label,
    options: group.versions.map((version) => ({
      label: version.label,
      href: buildHref(version.slug),
      selected: version.slug === slug,
    })),
  }
}
