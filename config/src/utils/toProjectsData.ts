import { Project } from '../projects'

export interface ProjectData {
  website: string
  color: string
  technology: string
  'technology-details'?: string
  'more-info': Record<string, InfoEntry>
  notes?: {
    text: string
    pointers?: string[]
  }
  news?: { name: string; link: string }[]
}

interface InfoEntry {
  text: string
  tooltip?: string
  sentiment?: 'bad' | 'good' | 'neutral'
  pointers?: string[]
}

export function toProjectsData(projects: Project[]) {
  const data: Record<string, ProjectData> = {}
  for (const project of projects) {
    const info = Object.fromEntries(
      project.details.parameters.map((p) => {
        const data: InfoEntry = { text: p.value }
        if (p.tooltip) {
          data.tooltip = p.tooltip
        }
        if (p.sentiment) {
          data.sentiment = p.sentiment
        }
        if (p.pointers) {
          data.pointers = p.pointers
        }
        return [p.name, data]
      })
    )
    const details: ProjectData = {
      website: project.details.website,
      color: project.details.color,
      technology: project.details.technology.name,
      'more-info': info,
    }
    if (project.details.technology.details) {
      details['technology-details'] = project.details.technology.details
    }
    if (project.details.news) {
      details.news = project.details.news
    }
    if (project.details.notes) {
      details.notes = project.details.notes
    }
    data[project.name] = details
  }
  return data
}
