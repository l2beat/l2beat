import { expect } from 'earl'
import { CROP_NOTES } from '../common/crops'
import { getProjects } from '../processing/getProjects'

// Security needs an ossification score: the site and crops-api cap the crop by
// it and list only projects that have one. Until a reviewed project has an
// ossification history, its Security crop says so under "not reviewed yet",
// and the note goes once the history lands.
describe('Security crop and ossification', () => {
  it('every reviewed project has an ossification history, or says it is not reviewed yet', () => {
    const inconsistent = getProjects()
      .filter((p) => p.crops !== undefined)
      .filter(
        (p) =>
          (p.ossificationHistory !== undefined) ===
          (p.crops?.security.notReviewed ?? []).includes(
            CROP_NOTES.notReviewed.ossification,
          ),
      )
      .map((p) => p.id.toString())
    expect(inconsistent).toEqual([])
  })
})
