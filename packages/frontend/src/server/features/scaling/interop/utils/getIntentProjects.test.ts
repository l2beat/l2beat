import type { InteropIntentConfig, InteropType, Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getIntentProjects } from './getIntentProjects'

describe(getIntentProjects.name, () => {
  it('returns intent projects sorted by name', () => {
    const result = getIntentProjects([
      project({ id: 'non-intent', name: 'Non intent', type: 'canonical' }),
      project({ id: 'b', name: 'Beta', type: 'intent', intent: intentConfig }),
      project({ id: 'a', name: 'Alpha', type: 'intent', intent: intentConfig }),
    ])

    expect(result.map((project) => project.id.toString())).toEqual(['a', 'b'])
  })
})

function project({
  id,
  name,
  type,
  intent,
}:
  | {
      id: string
      name: string
      type: 'intent'
      intent: InteropIntentConfig
    }
  | {
      id: string
      name: string
      type: Exclude<InteropType, 'intent'>
      intent?: never
    }): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig:
      type === 'intent' ? { type, intent, plugins: [] } : { type, plugins: [] },
  }
}

const intentConfig = {
  intentModel: {
    value: 'Intent framework',
    description: 'Users create intents.',
  },
  userRecovery: {
    value: 'Refund',
    description: 'Users can recover funds.',
  },
  solverAccess: {
    value: 'Permissionless',
    description: 'Solvers can participate.',
  },
  settlement: {
    value: 'Messaging',
    description: 'Settlement uses messages.',
  },
} satisfies InteropIntentConfig
