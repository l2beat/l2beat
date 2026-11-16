import {
  ADVICE_ANCHORS,
  PRIVACY_METHODOLOGY_URL,
} from '@l2beat/config/build/common/privacyAdversaries'
import { expect } from 'earl'
import { PRIVACY_METHODOLOGY_PATH, PRIVACY_ROUTES_ANCHOR } from './paths'

// Config writes these into the links of its advice steps, and client code
// cannot import config's build, so each side holds a copy.
describe('privacy methodology paths', () => {
  it('match the links config writes into advice steps', () => {
    expect(PRIVACY_METHODOLOGY_PATH).toEqual(PRIVACY_METHODOLOGY_URL)
    expect(PRIVACY_ROUTES_ANCHOR).toEqual(ADVICE_ANCHORS.routes)
  })
})
