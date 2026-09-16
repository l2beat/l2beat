import { ProjectId } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'

import { chainToProjectId, projectIdToChain } from './chainMap'

describe('chainMap', () => {
  it('maps Polygon PoS between chain id and project id', () => {
    expect(chainToProjectId('polygonpos')).toStrictEqual(
      ProjectId('polygon-pos'),
    )
    expect(projectIdToChain(ProjectId('polygon-pos'))).toStrictEqual(
      'polygonpos',
    )
  })

  it('keeps matching chain ids and project ids unchanged', () => {
    expect(chainToProjectId('hyperliquid')).toStrictEqual(
      ProjectId('hyperliquid'),
    )
    expect(projectIdToChain(ProjectId('hyperliquid'))).toStrictEqual(
      'hyperliquid',
    )
  })
})
