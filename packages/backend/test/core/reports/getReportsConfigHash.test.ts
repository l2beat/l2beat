import { expect } from 'earljs'

import { getReportsConfigHash } from '../../../src/core/reports/getReportsConfigHash'
import { fakeBridge, fakeProject, fakeToken } from './fakes'

describe(getReportsConfigHash.name, () => {
  it('can calculate a hash of no projects', () => {
    const hash = getReportsConfigHash([])
    expect(hash).toEqual(expect.stringMatching(/^[\da-f]{64}$/))
  })

  it('hash changes if project added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[0]]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123), fakeToken('usdc', 456)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if bridge sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 456)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[1], projectsBefore[0]]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the bridge order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('eth', 0), fakeToken('dai', 123)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})
