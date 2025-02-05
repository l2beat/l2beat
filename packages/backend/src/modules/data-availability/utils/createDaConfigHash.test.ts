import type { ProjectDaTrackingConfig } from '@l2beat/config'
import { expect } from 'earl'
import { getDaProjectsConfigHash } from './createDaConfigHash'

describe('getDaProjectsConfigHash', () => {
  it('returns consistent hash for the same input', () => {
    const minHeight = 1000
    const configs: ProjectDaTrackingConfig[] = [
      {
        type: 'ethereum',
        inbox: '0x1234567890123456789012345678901234567890',
      },
    ]

    const hash1 = getDaProjectsConfigHash(minHeight, configs)
    const hash2 = getDaProjectsConfigHash(minHeight, configs)

    expect(hash1).toEqual(hash2)
    expect(hash1).toHaveLength(12)
  })

  it('returns different hash when minHeight changes', () => {
    const configs: ProjectDaTrackingConfig[] = [
      {
        type: 'ethereum',
        inbox: '0x1234567890123456789012345678901234567890',
      },
    ]

    const hash1 = getDaProjectsConfigHash(1000, configs)
    const hash2 = getDaProjectsConfigHash(2000, configs)

    expect(hash1).not.toEqual(hash2)
  })

  it('handles ethereum config with sequencers', () => {
    const configs: ProjectDaTrackingConfig[] = [
      {
        type: 'ethereum',
        inbox: '0x1234567890123456789012345678901234567890',
        sequencers: [
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222',
        ],
      },
    ]

    const hash = getDaProjectsConfigHash(1000, configs)
    expect(hash).toHaveLength(12)
  })

  it('handles celestia config with signers', () => {
    const configs: ProjectDaTrackingConfig[] = [
      {
        type: 'celestia',
        namespace: 'test-namespace',
        signers: ['signer1', 'signer2'],
      },
    ]

    const hash = getDaProjectsConfigHash(1000, configs)
    expect(hash).toHaveLength(12)
  })

  it('handles avail config', () => {
    const configs: ProjectDaTrackingConfig[] = [
      {
        type: 'avail',
        appId: '123',
      },
    ]

    const hash = getDaProjectsConfigHash(1000, configs)
    expect(hash).toHaveLength(12)
  })

  it('returns consistent hash regardless of config order', () => {
    const configs1: ProjectDaTrackingConfig[] = [
      {
        type: 'ethereum',
        inbox: '0x1234',
      },
      {
        type: 'celestia',
        namespace: 'test',
      },
    ]

    const configs2: ProjectDaTrackingConfig[] = [
      {
        type: 'celestia',
        namespace: 'test',
      },
      {
        type: 'ethereum',
        inbox: '0x1234',
      },
    ]

    const hash1 = getDaProjectsConfigHash(1000, configs1)
    const hash2 = getDaProjectsConfigHash(1000, configs2)

    expect(hash1).toEqual(hash2)
  })
})
