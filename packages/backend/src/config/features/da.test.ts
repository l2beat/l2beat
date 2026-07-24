import { Env } from '@l2beat/backend-tools'
import { type EthereumDaTrackingConfig, ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createDaTrackingId, getDaTrackingConfig } from './da'

describe(getDaTrackingConfig.name, () => {
  it('produces unique configuration ids', async () => {
    const config = await getDaTrackingConfig(
      new ProjectService(),
      new Env({
        ETHEREUM_BEACON_API_URL: 'http://localhost',
        CELESTIA_BLOBS_API_URL: 'http://localhost',
        AVAIL_BLOBS_API_URL: 'http://localhost',
        EIGEN_DA_API_URL: 'http://localhost',
        EIGEN_DA_PER_PROJECT_API_URL: 'http://localhost',
      }),
    )
    const owners = new Map<string, string>()
    const duplicates: string[] = []

    for (const project of [
      ...config.blockProjects,
      ...config.timestampProjects,
    ]) {
      const key = `${project.daLayer}:${project.configurationId}`
      const owner = owners.get(key)
      if (owner !== undefined) {
        duplicates.push(
          `${project.configurationId}: ${owner}, ${project.projectId}`,
        )
      }
      owners.set(key, project.projectId)
    }

    expect(duplicates).toEqual([])
  })

  it('builds the v29 zkStack call-matching histories', async () => {
    const config = await getDaTrackingConfig(
      new ProjectService(),
      new Env({
        ETHEREUM_BEACON_API_URL: 'http://localhost',
        CELESTIA_BLOBS_API_URL: 'http://localhost',
        AVAIL_BLOBS_API_URL: 'http://localhost',
        EIGEN_DA_API_URL: 'http://localhost',
        EIGEN_DA_PER_PROJECT_API_URL: 'http://localhost',
      }),
    )

    const ethereumConfigs = config.blockProjects.filter(
      (
        x,
      ): x is (typeof config.blockProjects)[number] &
        EthereumDaTrackingConfig =>
        x.type === 'ethereum' && x.calls !== undefined,
    )
    const history = (projectId: ProjectId) =>
      ethereumConfigs
        .filter((x) => x.projectId === projectId)
        .map(({ sinceBlock, untilBlock, calls }) => ({
          sinceBlock,
          untilBlock,
          calls: calls?.map((call) => ({
            ...call,
            firstParameter: String(call.firstParameter).toLowerCase(),
          })),
        }))

    expect(history(ProjectId('abstract'))).toEqual([
      {
        sinceBlock: 23671558,
        untilBlock: undefined,
        calls: [
          {
            selector: '0x0db9eb87',
            firstParameter: '0x2edc71e9991a962c7fe172212d1aa9e50480fbb9',
          },
        ],
      },
    ])
    expect(history(ProjectId('zeronetwork'))).toEqual([
      {
        sinceBlock: 25487710,
        untilBlock: undefined,
        calls: [
          {
            selector: '0x0db9eb87',
            firstParameter: '0xdbd849acc6ba61f461cb8a41bbaee2d673ca02d9',
          },
        ],
      },
    ])
    expect(history(ProjectId('zksync2'))).toEqual([
      {
        sinceBlock: 23633924,
        untilBlock: 24357717,
        calls: [
          {
            selector: '0x0db9eb87',
            firstParameter: '0x6e96d1172a6593d5027af3c2664c5112ca75f2b9',
          },
        ],
      },
      {
        sinceBlock: 24357717,
        untilBlock: undefined,
        calls: [
          {
            selector: '0x0db9eb87',
            firstParameter: '0x32400084c286cf3e17e7b677ea9583e60a000324',
          },
        ],
      },
    ])
  })
})

describe(createDaTrackingId.name, () => {
  const legacyConfig: EthereumDaTrackingConfig = {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox: '0xInbox',
    sequencers: ['0xSeq2', '0xSeq1'],
    topics: ['0xTopic'],
    sinceBlock: 0,
  }
  const callConfig = {
    type: 'ethereum' as const,
    daLayer: ProjectId('ethereum'),
    inbox: '0xInbox',
    sinceBlock: 0,
  }

  it('keeps ids stable for configs without calls', () => {
    expect(createDaTrackingId(legacyConfig)).toEqual('8ada7a631e5c')
  })

  it('uses calls in the id', () => {
    const first = createDaTrackingId({
      ...callConfig,
      calls: [{ selector: '0x12345678', firstParameter: '0xaaaa' }],
    })
    const second = createDaTrackingId({
      ...callConfig,
      calls: [{ selector: '0x12345678', firstParameter: '0xbbbb' }],
    })

    expect(first).not.toEqual(second)
  })

  it('rejects calls combined with legacy matchers', () => {
    expect(() =>
      createDaTrackingId({
        ...callConfig,
        sequencers: ['0xOtherSequencer'],
        calls: [{ selector: '0x12345678', firstParameter: '0xaaaa' }],
      }),
    ).toThrow(/cannot be combined/)
    expect(() =>
      createDaTrackingId({
        ...callConfig,
        topics: ['0xOtherTopic'],
        calls: [{ selector: '0x12345678', firstParameter: '0xaaaa' }],
      }),
    ).toThrow(/cannot be combined/)
  })

  it('rejects an empty calls array', () => {
    expect(() =>
      createDaTrackingId({
        ...callConfig,
        calls: [],
      }),
    ).toThrow(/cannot be empty/)
  })

  it('normalizes call case and order', () => {
    const first = createDaTrackingId({
      ...callConfig,
      calls: [
        { selector: '0x12345678', firstParameter: '0xAaAa' },
        { selector: '0x87654321', firstParameter: '0xBbBb' },
      ],
    })
    const second = createDaTrackingId({
      ...callConfig,
      calls: [
        { selector: '0x87654321', firstParameter: '0xbbbb' },
        { selector: '0x12345678', firstParameter: '0xaaaa' },
      ],
    })

    expect(first).toEqual(second)
  })

  it('normalizes equivalent numeric and hex call parameters', () => {
    const numeric = createDaTrackingId({
      ...callConfig,
      calls: [{ selector: '0x98f81962', firstParameter: 2904 }],
    })
    const hex = createDaTrackingId({
      ...callConfig,
      calls: [{ selector: '0x98f81962', firstParameter: '0xb58' }],
    })

    expect(numeric).toEqual(hex)
  })
})
