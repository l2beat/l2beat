import type {
  Project,
  ProjectDaTrackingConfig,
  ProjectScalingDa,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getDaLayersInfo } from './getDaLayersInfo'

// Method: feed tracking configs straight into the function and compare the
// named layers; the dev manifest returns icon paths unchanged.
describe(getDaLayersInfo.name, () => {
  const ethereum = {
    id: ProjectId('ethereum'),
    name: 'Ethereum',
    slug: 'ethereum',
  } as Project<'daLayer'>
  const ETHEREUM_INFO = { name: 'Ethereum', logo: '/icons/ethereum.png' }

  it('keeps a layer current while one of its configs is still open', () => {
    const result = getDaLayersInfo(
      [config({ untilBlock: 200 }), config({ sinceBlock: 200 })],
      [ethereum],
      [],
    )

    expect(result).toEqual({
      currentDaLayers: [ETHEREUM_INFO],
      pastDaLayers: [],
    })
  })

  it('moves a layer to past once all of its configs have ended', () => {
    const result = getDaLayersInfo(
      [
        config({ untilBlock: 200 }),
        config({ sinceBlock: 200, untilBlock: 300 }),
      ],
      [ethereum],
      [],
    )

    expect(result).toEqual({
      currentDaLayers: [],
      pastDaLayers: [ETHEREUM_INFO],
    })
  })

  // Like Fuel: its Ethereum inbox closed and it now posts only to EigenDA,
  // which is untracked. DAC is a label but not a layer to name.
  it('names untracked layers from the DA labels', () => {
    const result = getDaLayersInfo(
      [config({ untilBlock: 200 })],
      [ethereum],
      [daLabel('EigenDA'), daLabel('DAC')],
    )

    expect(result).toEqual({
      currentDaLayers: [{ name: 'EigenDA', logo: '/icons/eigenda.png' }],
      pastDaLayers: [ETHEREUM_INFO],
    })
  })

  it('names an untracked layer that has no icon', () => {
    const result = getDaLayersInfo(
      [config({ untilBlock: 200 })],
      [ethereum],
      [daLabel('NearDA')],
    )

    expect(result.currentDaLayers).toEqual([
      { name: 'NearDA', logo: undefined },
    ])
  })
})

function daLabel(value: string): ProjectScalingDa {
  return {
    layer: { value },
    bridge: { value: 'None' },
    mode: { value: 'Transaction data' },
  }
}

function config(
  overrides: Partial<ProjectDaTrackingConfig>,
): ProjectDaTrackingConfig {
  return {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox: '0x0000000000000000000000000000000000000001',
    sinceBlock: 100,
    ...overrides,
  }
}
