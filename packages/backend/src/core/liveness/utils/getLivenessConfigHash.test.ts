import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { Project } from '../../../model'
import { getLivenessConfigHash } from './getLivenessConfigHash'

describe(getLivenessConfigHash.name, () => {
  it('hash changes when configurations are modified', () => {
    const projectId = ProjectId('project')
    const projects: Project[] = [
      {
        projectId: projectId,
        type: 'layer2', //irrelevant
        escrows: [],
        livenessConfig: {
          transfers: [
            {
              projectId,
              from: EthereumAddress.random(),
              to: EthereumAddress.random(),
              sinceTimestamp: UnixTime.now(),
              type: LivenessType('DA'),
            },
          ],
          functionCalls: [
            {
              projectId,
              address: EthereumAddress.random(),
              selector: '0x12345678',
              sinceTimestamp: UnixTime.now(),
              type: LivenessType('DA'),
            },
          ],
        },
      },
    ]

    const hash1 = getLivenessConfigHash(projects)

    const hash2 = getLivenessConfigHash([
      {
        ...projects[0],
        livenessConfig: {
          transfers: [
            {
              ...projects[0].livenessConfig!.transfers[0],
              untilTimestamp: UnixTime.now().add(1, 'days'),
            },
          ],
          functionCalls: [
            {
              ...projects[0].livenessConfig!.functionCalls[0],
              untilTimestamp: UnixTime.now().add(1, 'days'),
            },
          ],
        },
      },
    ])

    expect(hash1).not.toEqual(hash2)
  })

  it('does not change hash when project without liveness is added', () => {
    const projects: Project[] = [
      {
        projectId: ProjectId('project1'),
        type: 'layer2',
        escrows: [],
        livenessConfig: {
          transfers: [
            {
              projectId: ProjectId('project1'),
              from: EthereumAddress.random(),
              to: EthereumAddress.random(),
              sinceTimestamp: UnixTime.now(),
              type: LivenessType('DA'),
            },
          ],
          functionCalls: [
            {
              projectId: ProjectId('project1'),
              address: EthereumAddress.random(),
              selector: '0x12345678',
              sinceTimestamp: UnixTime.now(),
              type: LivenessType('DA'),
            },
          ],
        },
      },
    ]

    const hash1 = getLivenessConfigHash(projects)

    projects.push({
      projectId: ProjectId('project2'),
      type: 'layer2',
      escrows: [],
    })

    const hash2 = getLivenessConfigHash(projects)

    expect(hash1).toEqual(hash2)
  })
})
