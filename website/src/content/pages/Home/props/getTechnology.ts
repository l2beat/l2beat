import { Project } from '@l2beat/config'

export function getTechnology(project: Project) {
  const name = project.details.technologyName
  switch (name) {
    case 'Optimistic Rollup':
      return { abbreviation: 'ORU', name }
    case 'ZK Rollup':
      return { abbreviation: 'ZKR', name }
    case 'Plasma':
      return { abbreviation: 'PLA', name }
    case 'Validium':
      return { abbreviation: 'VAL', name }
    case 'State Pools':
      return { abbreviation: 'STP', name }
  }
  return { abbreviation: '???', name }
}
