import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getDaTvsProjectIds } from './getDaTvsProjectIds'

describe(getDaTvsProjectIds.name, () => {
  it('splits projects by whether their data goes to Ethereum', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia'), layer('eigenda')],
      [
        bridge('ethereum', ['base', 'arbitrum']),
        bridge('celestia', ['eclipse']),
        bridge('celestia', ['derive']),
        bridge('eigenda', ['celo']),
      ],
    )

    expect(result).toEqual({
      fullData: ['base', 'arbitrum'],
      settlementOnly: ['eclipse', 'derive', 'celo'],
    })
  })

  it('counts projects that use a layer without a bridge', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia', ['sovereign'])],
      [bridge('ethereum', ['base']), bridge('celestia', ['eclipse'])],
    )

    expect(result).toEqual({
      fullData: ['base'],
      settlementOnly: ['sovereign', 'eclipse'],
    })
  })

  it('counts a project once even when several bridges list it', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia')],
      [
        bridge('ethereum', ['base']),
        bridge('ethereum', ['base']),
        bridge('celestia', ['eclipse']),
        bridge('celestia', ['eclipse']),
      ],
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('counts a project that also uses Ethereum as full data', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('eigenda')],
      [bridge('ethereum', ['celo']), bridge('eigenda', ['celo', 'rise'])],
    )

    expect(result).toEqual({ fullData: ['celo'], settlementOnly: ['rise'] })
  })

  it('leaves out custom DA systems', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('custom-dac', [], 'custom')],
      [bridge('ethereum', ['base']), bridge('custom-dac', ['zk-chain'])],
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: [] })
  })

  it('returns nothing when there are no layers', () => {
    expect(getDaTvsProjectIds([], [])).toEqual({
      fullData: [],
      settlementOnly: [],
    })
  })
})

function layer(
  id: string,
  usedWithoutBridgeIn: string[] = [],
  systemCategory: 'public' | 'custom' = 'public',
) {
  return {
    id: ProjectId(id),
    daLayer: {
      systemCategory,
      usedWithoutBridgeIn: usedWithoutBridgeIn.map(usedInProject),
    },
  }
}

function bridge(daLayer: string, usedIn: string[]) {
  return {
    daBridge: {
      daLayer: ProjectId(daLayer),
      usedIn: usedIn.map(usedInProject),
    },
  }
}

function usedInProject(id: string) {
  return { id: ProjectId(id), name: id, slug: id }
}
