import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDaTrackingConfig } from '../../types'
import type { SnapshotIdentity } from '../types'
import { freezeSnippet } from './identities'

const identity = (config: ProjectDaTrackingConfig): SnapshotIdentity => ({
  id: 'abc',
  label: 'label',
  since: 100,
  config,
})

describe(freezeSnippet.name, () => {
  it('renders an open ethereum entry with a TODO until', () => {
    expect(
      freezeSnippet(
        identity({
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          sinceBlock: 100,
          inbox: '0xAA',
          sequencers: ['0xBB', '0xCC'],
        }),
      ),
    ).toEqual(
      [
        '    {',
        "      type: 'ethereum',",
        "      daLayer: ProjectId('ethereum'),",
        '      sinceBlock: 100,',
        '      untilBlock: 0, // TODO step 2: last point the old configuration was live',
        "      inbox: EthereumAddress('0xAA'),",
        '      sequencers: [',
        "        EthereumAddress('0xBB'),",
        "        EthereumAddress('0xCC'),",
        '      ],',
        '    },',
      ].join('\n'),
    )
  })

  it('keeps a closed range and renders topics, namespace, appIds and eigen-da', () => {
    expect(
      freezeSnippet(
        identity({
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          sinceBlock: 100,
          untilBlock: 200,
          inbox: '0xAA',
          topics: ['0xT1'],
        }),
      ),
    ).toEqual(
      [
        '    {',
        "      type: 'ethereum',",
        "      daLayer: ProjectId('ethereum'),",
        '      sinceBlock: 100,',
        '      untilBlock: 200,',
        "      inbox: EthereumAddress('0xAA'),",
        "      topics: ['0xT1'],",
        '    },',
      ].join('\n'),
    )
    expect(
      freezeSnippet(
        identity({
          type: 'celestia',
          daLayer: ProjectId('celestia'),
          sinceBlock: 5,
          namespace: 'AAAA=',
        }),
      ),
    ).toInclude("      namespace: 'AAAA=',")
    expect(
      freezeSnippet(
        identity({
          type: 'avail',
          daLayer: ProjectId('avail'),
          sinceBlock: 5,
          appIds: ['17', '36'],
        }),
      ),
    ).toInclude("      appIds: ['17', '36'],")
    expect(
      freezeSnippet(
        identity({
          type: 'eigen-da',
          daLayer: ProjectId('eigenda'),
          customerId: '0xdd',
          sinceTimestamp: UnixTime(1700000000),
        }),
      ),
    ).toEqual(
      [
        '    {',
        "      type: 'eigen-da',",
        "      daLayer: ProjectId('eigenda'),",
        "      customerId: '0xdd',",
        '      sinceTimestamp: UnixTime(1700000000),',
        '      untilTimestamp: UnixTime(0), // TODO step 2: last point the old configuration was live',
        '    },',
      ].join('\n'),
    )
  })
})
