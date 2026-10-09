import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getDaTvsProjectIds } from './getDaTvsProjectIds'

// Every project named in a layer, bridge or custom DA entry is an L2 unless
// the case says otherwise, so the split alone decides where it lands.
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
      l2s('base', 'arbitrum', 'eclipse', 'derive', 'celo'),
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
      l2s('base', 'sovereign', 'eclipse'),
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
      l2s('base', 'eclipse'),
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('counts a project that also uses Ethereum as full data', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('eigenda')],
      [bridge('ethereum', ['celo']), bridge('eigenda', ['celo', 'rise'])],
      [],
      l2s('celo', 'rise'),
    )

    expect(result).toEqual({ fullData: ['celo'], settlementOnly: ['rise'] })
  })

  it('counts a project with its own DA system as settlement only', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia')],
      [bridge('ethereum', ['base']), bridge('celestia', ['eclipse'])],
      [customDaProject('reya')],
      l2s('base', 'eclipse', 'reya'),
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
      l2s('base', 'eclipse'),
    )

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('leaves out L3s wherever their data goes', () => {
    const result = getDaTvsProjectIds(
      [layer('ethereum'), layer('celestia', ['l3-sovereign'])],
      [
        bridge('ethereum', ['base', 'l3-on-ethereum']),
        bridge('celestia', ['eclipse', 'l3-on-celestia']),
      ],
      [customDaProject('reya'), customDaProject('l3-on-dac')],
      [
        ...l2s('base', 'eclipse', 'reya'),
        ...l3s('l3-sovereign', 'l3-on-ethereum', 'l3-on-celestia', 'l3-on-dac'),
      ],
    )

    expect(result).toEqual({
      fullData: ['base'],
      settlementOnly: ['eclipse', 'reya'],
    })
  })

  it('returns nothing when there are no layers', () => {
    expect(getDaTvsProjectIds([], [], [], [])).toEqual({
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

function l2s(...ids: string[]) {
  return ids.map((id) => scalingProject(id, 'layer2'))
}

function l3s(...ids: string[]) {
  return ids.map((id) => scalingProject(id, 'layer3'))
}

function scalingProject(id: string, layer: 'layer2' | 'layer3') {
  return { id: ProjectId(id), scalingInfo: { layer } }
}
