import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { getRelevantBridgeTypes } from './getRelevantBridgeTypes'

describe(getRelevantBridgeTypes.name, () => {
  it('returns the selected type when the view is filtered', () => {
    const result = getRelevantBridgeTypes(project(), 'nonMinting')

    expect(result).toStrictEqual(['nonMinting'])
  })

  it('returns all configured bridge types when the view is aggregated', () => {
    const result = getRelevantBridgeTypes(project(), undefined)

    expect(result).toStrictEqual(['lockAndMint', 'nonMinting'])
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
