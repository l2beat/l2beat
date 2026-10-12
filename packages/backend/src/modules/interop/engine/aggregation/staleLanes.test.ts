import { expect } from 'earl'
import {
  carryForwardStaleLanes,
  getStaleChainsByProject,
  isLaneStale,
} from './staleLanes'

describe('staleLanes', () => {
  // Blockers name clusters, never plugins; "multi-b" is only reachable via "multi".
  const clusters = [
    { name: 'solo', plugins: [{ name: 'solo' }] },
    { name: 'multi', plugins: [{ name: 'multi-a' }, { name: 'multi-b' }] },
  ]
  const configs = [
    { id: 'solo', plugins: [{ plugin: 'solo' }] },
    { id: 'multi', plugins: [{ plugin: 'multi-b' }] },
  ]

  describe(getStaleChainsByProject.name, () => {
    it('maps a blocked cluster chain to every project using a plugin of that cluster', () => {
      const stale = getStaleChainsByProject(configs, clusters, [
        { cluster: 'multi', chain: 'avalanche' },
      ])

      expect(stale).toEqual(new Map([['multi', new Set(['avalanche'])]]))
    })

    it('unions chains across all clusters a project uses', () => {
      const stale = getStaleChainsByProject(
        [{ id: 'both', plugins: [{ plugin: 'solo' }, { plugin: 'multi-a' }] }],
        clusters,
        [
          { cluster: 'solo', chain: 'base' },
          { cluster: 'multi', chain: 'avalanche' },
        ],
      )

      expect(stale).toEqual(new Map([['both', new Set(['base', 'avalanche'])]]))
    })

    it('ignores plugins that belong to no syncing cluster', () => {
      const stale = getStaleChainsByProject(
        [{ id: 'api-only', plugins: [{ plugin: 'relay' }] }],
        clusters,
        [{ cluster: 'relay', chain: 'avalanche' }],
      )

      expect(stale).toEqual(new Map())
    })
  })

  describe(isLaneStale.name, () => {
    const stale = new Map([['multi', new Set(['avalanche'])]])

    it('is stale when the lane touches a stale chain of its project', () => {
      expect(
        isLaneStale(
          { id: 'multi', srcChain: 'ethereum', dstChain: 'avalanche' },
          stale,
        ),
      ).toEqual(true)
      expect(
        isLaneStale(
          { id: 'multi', srcChain: 'avalanche', dstChain: 'base' },
          stale,
        ),
      ).toEqual(true)
    })

    it('is fresh when neither end is stale for the project', () => {
      expect(
        isLaneStale(
          { id: 'multi', srcChain: 'ethereum', dstChain: 'base' },
          stale,
        ),
      ).toEqual(false)
      expect(
        isLaneStale(
          { id: 'solo', srcChain: 'ethereum', dstChain: 'avalanche' },
          stale,
        ),
      ).toEqual(false)
    })
  })

  describe(carryForwardStaleLanes.name, () => {
    const stale = new Map([['multi', new Set(['avalanche'])]])

    it('replaces stale lanes with the previous snapshot and keeps fresh ones', () => {
      const fresh = [
        lane('multi', 'ethereum', 'avalanche', 200, 'undercounted'),
        lane('multi', 'ethereum', 'base', 200, 'fresh'),
        lane('solo', 'ethereum', 'avalanche', 200, 'fresh-solo'),
      ]
      const previous = [
        lane('multi', 'ethereum', 'avalanche', 100, 'old-complete'),
        lane('multi', 'avalanche', 'base', 100, 'old-only-in-previous'),
        lane('solo', 'ethereum', 'avalanche', 100, 'old-solo'),
      ]

      const result = carryForwardStaleLanes(fresh, previous, stale, 200)

      expect(result).toEqual([
        lane('multi', 'ethereum', 'base', 200, 'fresh'),
        lane('solo', 'ethereum', 'avalanche', 200, 'fresh-solo'),
        lane('multi', 'ethereum', 'avalanche', 200, 'old-complete'),
        lane('multi', 'avalanche', 'base', 200, 'old-only-in-previous'),
      ])
    })

    it('returns fresh rows untouched when nothing is stale', () => {
      const fresh = [lane('multi', 'ethereum', 'avalanche', 200, 'fresh')]

      expect(carryForwardStaleLanes(fresh, [], new Map(), 200)).toEqual(fresh)
    })
  })
})

function lane(
  id: string,
  srcChain: string,
  dstChain: string,
  timestamp: number,
  label: string,
) {
  return { id, srcChain, dstChain, timestamp, label }
}
