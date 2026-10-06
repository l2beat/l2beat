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
      [],
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
      [],
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
      [],
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('counts a project that also uses Ethereum as full data', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('eigenda')],
      [bridge('ethereum', ['celo']), bridge('eigenda', ['celo', 'rise'])],
      [],
    )

    expect(result).toEqual({ fullData: ['celo'], settlementOnly: ['rise'] })
  })

  it('counts a project with its own DA system as settlement only', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia')],
      [bridge('ethereum', ['base']), bridge('celestia', ['eclipse'])],
      [customDaProject('reya')],
    )

    expect(result).toEqual({
      fullData: ['base'],
      settlementOnly: ['eclipse', 'reya'],
    })
  })

  it('counts a custom DA project once, and as full data if it uses Ethereum', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia')],
      [bridge('ethereum', ['base']), bridge('celestia', ['eclipse'])],
      [customDaProject('base'), customDaProject('eclipse')],
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('returns nothing when there are no layers', () => {
    expect(getDaTvsProjectIds([], [], [])).toEqual({
      fullData: [],
      settlementOnly: [],
    })
  })
})

function layer(id: string, usedWithoutBridgeIn: string[] = []) {
  return {
    id: ProjectId(id),
    daLayer: {
      usedWithoutBridgeIn: usedWithoutBridgeIn.map(usedInProject),
    },
  }
}

function customDaProject(id: string) {
  return { id: ProjectId(id) }
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
