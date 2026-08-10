import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { chainToProjectId, projectIdToChain } from './chainMap'

describe('chainMap', () => {
  it('maps Polygon PoS between chain id and project id', () => {
    expect(chainToProjectId('polygonpos')).toEqual(ProjectId('polygon-pos'))
    expect(projectIdToChain(ProjectId('polygon-pos'))).toEqual('polygonpos')
  })

  it('keeps matching chain ids and project ids unchanged', () => {
    expect(chainToProjectId('hyperliquid')).toEqual(ProjectId('hyperliquid'))
    expect(projectIdToChain(ProjectId('hyperliquid'))).toEqual('hyperliquid')
  })
})
