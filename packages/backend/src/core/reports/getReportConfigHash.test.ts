import {
  AssetId,
  ChainId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ProjectEscrow } from '../../model'
import { getMockToken } from '../../test/token'
import { getReportConfigHash } from './getReportConfigHash'
import { ReportProject } from './ReportProject'

describe(getReportConfigHash.name, () => {
  it('hash changes if project added', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      project('optimism', 'layer2', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      project('optimism', 'layer2', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[0]]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project type changes', () => {
    const projectsBefore = [
      project('unknown', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('unknown', 'bridge', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is added', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123), fakeToken('usdc', 456)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is removed', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if escrow sinceBlock changes', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 456)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      project('optimism', 'layer2', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[1], projectsBefore[0]]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the escrow order changes', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', 'layer2', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0), fakeToken('dai', 123)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getReportConfigHash(projectsBefore)
    const hashAfter = getReportConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})

function project(
  id: string,
  type: ReportProject['type'],
  escrows: ProjectEscrow[],
): ReportProject {
  return {
    projectId: ProjectId(id),
    type,
    escrows,
  }
}

function fakeEscrow(
  address: string,
  timestamp: number,
  tokens: Token[],
): ProjectEscrow {
  return {
    address: EthereumAddress('0x' + address + '0'.repeat(40 - address.length)),
    sinceTimestamp: new UnixTime(timestamp),
    tokens,
  }
}

function fakeToken(id: string, timestamp: number): Token {
  return {
    ...getMockToken(),
    id: AssetId(id),
    sinceTimestamp: new UnixTime(timestamp),
    chainId: ChainId.ETHEREUM,
    type: ValueType.CBV,
  }
}
