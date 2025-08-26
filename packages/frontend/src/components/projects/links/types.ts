export type LinkName =
  | 'Website'
  | 'Bridge'
  | 'Docs'
  | 'Explorer'
  | 'Repository'
  | 'Social'
  | 'Other'
  | 'rollup.codes'

export interface ProjectLink {
  name: LinkName
  links: string[]
}
