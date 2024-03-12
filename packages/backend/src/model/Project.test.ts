import { assert } from '@l2beat/backend-tools'
import { layer2s } from '@l2beat/config'

import {
  TrackedTxFunctionCallConfig,
  TrackedTxTransferConfig,
} from '../modules/tracked-txs/types/TrackedTxsConfig'
import { layer2ToProject } from './Project'

describe('Backend project config', () => {
  describe('Tracked transactions', () => {
    const projects = layer2s.map(layer2ToProject)
    it('every LivenessId is unique', () => {
      const ids = new Set<string>()
      for (const project of projects) {
        const trackedTxsIds =
          project.trackedTxsConfig?.entries.flatMap((entry) =>
            entry.uses.map((u) => u.id.toString()),
          ) ?? []
        for (const id of trackedTxsIds) {
          assert(
            !ids.has(id),
            `Duplicate TrackedTxsId in ${project.projectId.toString()}`,
          )
          ids.add(id)
        }
      }
    })
    describe('transfers', () => {
      it('every configuration points to unique transfer params', () => {
        const transfers = new Set<string>()
        for (const project of projects) {
          const transferConfigs = project.trackedTxsConfig?.entries.filter(
            (e): e is TrackedTxTransferConfig => e.formula === 'transfer',
          )
          for (const config of transferConfigs ?? []) {
            const key = `${config.from.toString()}-${config.to.toString()}`
            assert(
              !transfers.has(key),
              `Duplicate transfer config in ${project.projectId.toString()}`,
            )
            transfers.add(key)
          }
        }
      })
    })
    describe('function calls', () => {
      it('every configuration points to unique function call params', () => {
        const functionCalls = new Set<string>()
        for (const project of projects) {
          const functionCallConfigs = project.trackedTxsConfig?.entries.filter(
            (e): e is TrackedTxFunctionCallConfig =>
              e.formula === 'functionCall',
          )
          for (const config of functionCallConfigs ?? []) {
            const key = `${config.address.toString()}-${config.selector}`
            assert(
              !functionCalls.has(key),
              `Duplicate function call config in ${project.projectId.toString()}`,
            )
            functionCalls.add(key)
          }
        }
      })
    })
  })
})
