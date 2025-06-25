export type LinkName =
  | 'Website'
  | 'Bridge'
  | 'Docs'
  | 'Explorer'
  | 'Repository'
  | 'Social'
  | 'rollup.codes'

export interface ProjectLink {
  name: LinkName
  links: string[]
}
