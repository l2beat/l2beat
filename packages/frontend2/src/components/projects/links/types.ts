export type LinkName =
  | 'Website'
  | 'App'
  | 'Docs'
  | 'Explorer'
  | 'Repository'
  | 'Social'
  | 'rollup.codes'

export interface ProjectLink {
  name: LinkName
  links: string[]
}
