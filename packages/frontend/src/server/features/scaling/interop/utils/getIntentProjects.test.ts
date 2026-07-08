import type { InteropIntentConfig, InteropType, Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getIntentProjects } from './getIntentProjects'

describe(getIntentProjects.name, () => {
  it('returns intent projects sorted by name', () => {
    const result = getIntentProjects([
      project({ id: 'non-intent', name: 'Non intent', type: 'canonical' }),
      project({ id: 'b', name: 'Beta', intent: intentConfig }),
      project({ id: 'a', name: 'Alpha', intent: intentConfig }),
    ])

    expect(result.map((project) => project.id.toString())).toEqual(['a', 'b'])
  })

  it('throws when an intent project has no intent metadata', () => {
    expect(() =>
      getIntentProjects([project({ id: 'missing', name: 'Missing' })]),
    ).toThrow(/Intent project missing is missing interopConfig.intent/)
  })
})

function project({
  id,
  name,
  type = 'intent',
  intent,
}: {
  id: string
  name: string
  type?: InteropType
  intent?: InteropIntentConfig
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      type,
      intent,
      plugins: [],
    },
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
