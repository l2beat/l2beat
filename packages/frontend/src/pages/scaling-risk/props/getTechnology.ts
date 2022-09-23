import { Layer2 } from '@l2beat/config'

export function getTechnology(project: Layer2) {
  const name = project.technology.category.name
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
    case 'Optimistic Chain':
      return { abbreviation: 'OPC', name }
  }
}
