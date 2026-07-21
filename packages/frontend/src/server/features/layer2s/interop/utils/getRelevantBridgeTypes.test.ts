import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getRelevantBridgeTypes } from './getRelevantBridgeTypes'

describe(getRelevantBridgeTypes.name, () => {
  it('returns the selected type when the view is filtered', () => {
    const result = getRelevantBridgeTypes(project(), 'nonMinting')

    expect(result).toEqual(['nonMinting'])
  })

  it('returns all configured bridge types when the view is aggregated', () => {
    const result = getRelevantBridgeTypes(project(), undefined)

    expect(result).toEqual(['lockAndMint', 'nonMinting'])
  })
})

function project(): Project<'interopConfig'> {
  return {
    id: ProjectId('stargate'),
    name: 'Stargate',
    slug: 'stargate',
    interopConfig: {
      type: 'intent',
      plugins: [
        { plugin: 'stargate', bridgeType: 'lockAndMint' },
        { plugin: 'stargate', bridgeType: 'nonMinting' },
        { plugin: 'stargate', bridgeType: 'lockAndMint' },
      ],
    },
  } as unknown as Project<'interopConfig'>
}
