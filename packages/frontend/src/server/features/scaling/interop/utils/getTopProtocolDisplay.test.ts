import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTopProtocolDisplay } from './getTopProtocolDisplay'

describe(getTopProtocolDisplay.name, () => {
  it('selects the protocol with the highest volume', () => {
    const result = getTopProtocolDisplay(
      new Map<string, number>([
        ['relay', 100],
        ['wormhole', 200],
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
      new Map<string, number>([['missing', 100]]),
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
