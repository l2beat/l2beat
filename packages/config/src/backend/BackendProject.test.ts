import { assert } from '@l2beat/backend-tools'
import { layer2s } from '../projects/layer2s'

import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import { layer2ToBackendProject } from './BackendProject'

describe('BackendProject', () => {
  describe('Tracked transactions', () => {
    const projects = layer2s.map(layer2ToBackendProject)
    it('every TrackedTxId is unique', () => {
      const ids = new Set<string>()
      for (const project of projects) {
        const trackedTxsIds =
          project.trackedTxsConfig?.map((entry) => entry.id) ?? []
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
          const transferConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxTransferConfig
            } => e.params.formula === 'transfer',
          )
          for (const config of transferConfigs ?? []) {
            const key = `${config.params.from.toString()}-${config.params.to.toString()}-${
              config.type
            }`
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
          const functionCallConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxFunctionCallConfig
            } => e.params.formula === 'functionCall',
          )
          for (const config of functionCallConfigs ?? []) {
            const key = `${config.params.address.toString()}-${
              config.params.selector
            }-${config.untilTimestamp?.toString()}-${config.type}`
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
