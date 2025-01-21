import type { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from './getProjects'

describe('getProjects', () => {
  const projects = getProjects()

  describe('every project has a unique id', () => {
    const ids = new Set<ProjectId>()
    for (const project of projects) {
      it(`${project.name} has a unique id of: "${project.id}"`, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
      })
    }
  })

  describe('verifier descriptions end with a dot', () => {
    for (const project of projects) {
      if (!project.proofVerification) {
        return
      }
      describe(project.name, () => {
        project.proofVerification?.verifiers.forEach((sV) => {
          it(sV.name, () => {
            expect(sV.description.endsWith('.')).toEqual(true)
          })
        })
      })
    }
  })
})
