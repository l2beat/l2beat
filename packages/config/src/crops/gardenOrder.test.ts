import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { GARDEN_ORDER } from './gardenOrder'

describe('GARDEN_ORDER', () => {
  it('names only projects with a crops evaluation, checked against every project config', () => {
    const reviewed = new Set(
      getProjects()
        .filter((project) => project.crops !== undefined)
        .map((project) => project.id),
    )
    expect(GARDEN_ORDER.filter((id) => !reviewed.has(id))).toEqual([])
  })

  it('names each project once', () => {
    expect(new Set(GARDEN_ORDER).size).toEqual(GARDEN_ORDER.length)
  })
})
