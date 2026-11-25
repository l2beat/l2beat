import { expect } from 'earl'
import { getDisplayedScalingStageName } from './scalingAssessment'

// Why: a stage is a positive claim, so the API must report the one the website
// shows. The website shows none for an "Other" project, whatever its config
// still stores.
// How: pass the category and stored stage, read the stage that is reported.
describe(getDisplayedScalingStageName.name, () => {
  it('reports no stage for an "Other" project that still has one stored', () => {
    expect(
      getDisplayedScalingStageName('Other', {
        stage: 'Stage 0',
        downgradePending: undefined,
        message: undefined,
        summary: [],
      }),
    ).toEqual('Not applicable')
  })

  it('keeps the stage of a rollup', () => {
    expect(
      getDisplayedScalingStageName('Optimistic Rollup', {
        stage: 'Stage 1',
        downgradePending: undefined,
        message: undefined,
        summary: [],
      }),
    ).toEqual('Stage 1')
  })
})
