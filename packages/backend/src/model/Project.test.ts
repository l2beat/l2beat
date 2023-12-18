import { assert } from '@l2beat/backend-tools'
import { layer2s } from '@l2beat/config'

import { layer2ToProject } from './Project'

describe('Backend project config', () => {
  describe('Liveness', () => {
    it('every LivenessId is unique', () => {
      const projects = layer2s.map(layer2ToProject)

      const ids = new Set<string>()

      for (const project of projects) {
        const livenessIds = project.livenessConfig?.entries.map((entry) =>
          entry.id.toString(),
        )

        for (const id of livenessIds ?? []) {
          assert(
            !ids.has(id),
            `Duplicate LivenessId in ${project.projectId.toString()}`,
          )
          ids.add(id)
        }
      }
    })
  })
})
