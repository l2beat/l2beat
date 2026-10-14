import type {
  InteropConfig,
  ProjectDaBridge,
  ProjectDaLayer,
  ProjectScalingInfo,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjectUrl } from './getProjectUrl'

// Method: pass projects carrying only the fields that decide the page kind and
// compare the path with the route that serves that kind of page.
describe(getProjectUrl.name, () => {
  it('links an interop-only protocol to its interop page', () => {
    expect(
      getProjectUrl({
        ...NO_PAGE,
        id: ProjectId('ccip'),
        slug: 'ccip',
        interopConfig: INTEROP_CONFIG,
      }),
    ).toEqual('/interop/protocols/ccip')
  })

  it('links a scaling project with a canonical bridge to its scaling page, which carries the bridge data', () => {
    expect(
      getProjectUrl({
        ...NO_PAGE,
        id: ProjectId('gnosis'),
        slug: 'gnosis',
        scalingInfo: {} as ProjectScalingInfo,
        interopConfig: INTEROP_CONFIG,
      }),
    ).toEqual('/layer2s/projects/gnosis')
  })

  it('links Ethereum, a DA layer and bridge, to its own page', () => {
    expect(
      getProjectUrl({
        ...NO_PAGE,
        id: ProjectId.ETHEREUM,
        slug: 'ethereum',
        daLayer: {} as ProjectDaLayer,
        daBridge: {} as ProjectDaBridge,
      }),
    ).toEqual('/projects/ethereum')
  })

  it('leaves other DA layers without a page', () => {
    expect(
      getProjectUrl({
        ...NO_PAGE,
        id: ProjectId('celestia'),
        slug: 'celestia',
        daLayer: {} as ProjectDaLayer,
      }),
    ).toEqual(undefined)
  })
})

const INTEROP_CONFIG = {} as InteropConfig

const NO_PAGE = {
  daBridge: undefined,
  scalingInfo: undefined,
  daLayer: undefined,
  privacyInfo: undefined,
  defiInfo: undefined,
  interopConfig: undefined,
}
