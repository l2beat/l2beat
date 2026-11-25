import { expect } from 'earl'
import { getShownStage } from './getL2ApiEntries'

// Why: a stage is a positive claim, so the API must report the one the website
// shows. The website shows none for an "Other" project, whatever its config
// still stores.
// How: pass the category and stored stage, read the stage that is reported.
describe(getShownStage.name, () => {
  it('reports no stage for an "Other" project that still has one stored', () => {
    expect(getShownStage({ type: 'Other', stage: 'Stage 0' })).toEqual(
      'Not applicable',
    )
  })

  it('keeps the stage of a rollup', () => {
    expect(
      getShownStage({ type: 'Optimistic Rollup', stage: 'Stage 1' }),
    ).toEqual('Stage 1')
  })
})
