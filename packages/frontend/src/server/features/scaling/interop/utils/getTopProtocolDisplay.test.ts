import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getTopProtocolDisplay,
  type ProtocolStats,
} from './getTopProtocolDisplay'

describe(getTopProtocolDisplay.name, () => {
  it('selects the protocol with the highest volume', () => {
    const result = getTopProtocolDisplay(
      new Map<string, ProtocolStats>([
        ['relay', { volume: 100, transferCount: 1000 }],
        ['wormhole', { volume: 200, transferCount: 1 }],
      ]),
      new Map([
        [ProjectId('relay'), project({ id: 'relay', name: 'Relay' })],
        [ProjectId('wormhole'), project({ id: 'wormhole', name: 'Wormhole' })],
      ]),
    )

    expect(result).toEqual({
      name: 'Wormhole',
      iconUrl: '/icons/wormhole.png',
    })
  })

  it('returns undefined when the selected protocol metadata is missing', () => {
    const result = getTopProtocolDisplay(
      new Map<string, ProtocolStats>([
        ['missing', { volume: 100, transferCount: 1 }],
      ]),
      new Map(),
    )

    expect(result).toEqual(undefined)
  })
})

function project({
  id,
  name,
  interopName,
}: {
  id: string
  name: string
  interopName?: string
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    name,
    slug: id,
    interopConfig: {
      name: interopName,
      type: 'intent',
      bridgeType: 'nonMinting',
      isAggregate: false,
    },
  } as unknown as Project<'interopConfig'>
}
