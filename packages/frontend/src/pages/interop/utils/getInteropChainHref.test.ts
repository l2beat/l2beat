import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getInteropChainHref } from './getInteropChainHref'

describe(getInteropChainHref.name, () => {
  const l2ProjectSlugById = new Map([
    [ProjectId('arbitrum'), 'arbitrum'],
    [ProjectId('polygon-pos'), 'polygon-pos'],
  ])

  it('links a chain with a scaling project to its project page', () => {
    expect(
      getInteropChainHref(
        { id: 'polygonpos', isUpcoming: false },
        l2ProjectSlugById,
      ),
    ).toEqual('/layer2s/projects/polygon-pos')
  })

  it('links Ethereum to its own page', () => {
    expect(
      getInteropChainHref(
        { id: 'ethereum', isUpcoming: false },
        l2ProjectSlugById,
      ),
    ).toEqual('/projects/ethereum')
  })

  it('links any other chain to its chain page', () => {
    expect(
      getInteropChainHref(
        { id: 'solana', isUpcoming: false },
        l2ProjectSlugById,
      ),
    ).toEqual('/projects/solana')
  })

  it('leaves an upcoming chain without a scaling project unlinked', () => {
    expect(
      getInteropChainHref(
        { id: 'solana', isUpcoming: true },
        l2ProjectSlugById,
      ),
    ).toEqual(undefined)
  })

  it('links an upcoming chain with a scaling project to its project page', () => {
    expect(
      getInteropChainHref(
        { id: 'arbitrum', isUpcoming: true },
        l2ProjectSlugById,
      ),
    ).toEqual('/layer2s/projects/arbitrum')
  })
})
