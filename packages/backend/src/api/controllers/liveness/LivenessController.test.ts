import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { mockObject } from 'earl'

import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'
import { LivenessController } from './LivenessController'

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    it('returns the liveness', async () => {
      const livenessController = new LivenessController(livenessRepository)

      const result = await livenessController.getLiveness()
      console.log(result['project1'])
    })
  })
})

const START = UnixTime.now()
const DATA = [
  {
    projectId: ProjectId('project1'),
    timestamp: START.add(-1, 'hours'),
    blockNumber: 12345,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: START.add(-2, 'hours'),
    blockNumber: 12345,
    txHash: '0x1234567890abcdee',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: START.add(-5, 'hours'),
    blockNumber: 12345,
    txHash: '0x1234567890abcded',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: START.add(-8, 'hours'),
    blockNumber: 12345,
    txHash: '0x1234567890abcded',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project2'),
    timestamp: START.add(-2, 'hours'),
    blockNumber: 12346,
    txHash: '0xabcdef1234567890',
    type: LivenessType('STATE'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: START.add(-3, 'hours'),
    blockNumber: 12347,
    txHash: '0x12345678901abcdef',
    type: LivenessType('STATE'),
  },
  {
    projectId: ProjectId('project2'),
    timestamp: START.add(-4, 'hours'),
    blockNumber: 12348,
    txHash: '0xabcdef1234567891',
    type: LivenessType('DA'),
  },
]

const livenessRepository = mockObject<LivenessRepository>({
  getAll() {
    return Promise.resolve(DATA)
  },
  addMany() {
    return Promise.resolve(1)
  },
  deleteAll() {
    return Promise.resolve(1)
  },
})
