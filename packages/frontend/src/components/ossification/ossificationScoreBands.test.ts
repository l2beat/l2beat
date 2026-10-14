import { OSSIFICATION_SCORE_BANDS as SHARED_BANDS } from '@l2beat/shared/frontend'
import { expect } from 'earl'
import { OSSIFICATION_SCORE_BANDS } from './ossificationScoreBands'

describe('OSSIFICATION_SCORE_BANDS', () => {
  it('matches the bands the Security crop is capped by', () => {
    expect(OSSIFICATION_SCORE_BANDS).toEqual(SHARED_BANDS)
  })
})
