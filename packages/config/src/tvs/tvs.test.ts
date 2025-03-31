import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)

  it('every token has a unique id within project', () => {
    for (const project of projects) {
      const tokenIds = new Set<string>()
      for (const token of project.tvsConfig!) {
        expect(tokenIds.has(token.id)).toEqual(false)
        tokenIds.add(token.id)
      }
    }
  })
})
