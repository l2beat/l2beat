import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)

  for (const project of projects) {
    it(`project ${project.id} has correct tvs config`, () => {
      const tokenIds = new Set<string>()
      for (const token of project.tvsConfig!) {
        // token has unique id within the project
        expect(tokenIds.has(token.id)).toEqual(false)
        tokenIds.add(token.id)
      }
    })
  }
})
