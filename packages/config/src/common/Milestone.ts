export type MilestoneType = 'general' | 'incident'

export interface Milestone {
  name: string
  link: string
  date: string
  description?: string
  type: MilestoneType
}
