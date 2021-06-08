export interface Project {
  name: string
  bridges: BridgeDescription[]
  details: ProjectDetails
}

interface BridgeDescription {
  address: string
  sinceBlock: number
  tokens: string[]
}

interface ProjectDetails {
  website: string
  color: string
  technology: {
    name: string
    details?: string
  }
  parameters: ProjectParameter[]
  news?: News[]
  notes?: {
    text: string
    pointers?: string[]
  }
}

interface ProjectParameter {
  name: string
  value: string
  tooltip?: string
  sentiment?: 'bad' | 'good' | 'neutral'
  pointers?: string[]
}

interface News {
  name: string
  link: string
}
