export interface DaDisplay {
  /** The name of the data availability layer. */
  name: string
  /** Slug of the data availability bridge. */
  slug: string
  /** A short description of the data availability layer. */
  description: string
  /** Links related to the data availability layer. */
  links: DaDisplayLinks
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
}

interface DaDisplayLinks {
  /** Links to marketing landing pages. */
  websites: string[]
  /** Links to documentation pages. */
  documentation: string[]
  /** Links to source code repositories. */
  repositories: string[]
}
