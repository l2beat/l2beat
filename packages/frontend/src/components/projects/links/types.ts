export type LinkName =
  | 'Website'
  | 'Bridge'
  | 'Docs'
  | 'Explorer'
  | 'Repository'
  | 'Social'
  | 'Other'

export interface ProjectLink {
  name: LinkName
  links: string[]
}
