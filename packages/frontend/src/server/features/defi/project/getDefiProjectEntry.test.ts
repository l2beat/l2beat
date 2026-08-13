import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getDefiProjectEntry } from './getDefiProjectEntry'

describe(getDefiProjectEntry.name, () => {
  const originalGetProject = ps.getProject.bind(ps)

  afterEach(() => {
    ps.getProject = originalGetProject
  })

  it('returns undefined when the project is missing or has no defiInfo', async () => {
    ps.getProject = async () => undefined

    expect(await getDefiProjectEntry('arbitrum')).toEqual(undefined)
  })
})
