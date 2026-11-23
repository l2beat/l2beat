import { expect } from 'earl'
import { isRefusedForRate } from './rateRefusal'

// How: one case per status and header combination seen from xlayer and dbk
// (CloudFront's own 403 says `Server: CloudFront`; an origin error passed
// through says nothing or names the origin's server).
describe(isRefusedForRate.name, () => {
  it('takes a 429 as a refusal from any provider', () => {
    expect(isRefusedForRate({ status: 429 })).toEqual(true)
  })

  it("takes CloudFront's own 403 only from a provider configured so", () => {
    const refusal = { status: 403, server: 'CloudFront' }
    expect(isRefusedForRate(refusal, true)).toEqual(true)
    expect(isRefusedForRate(refusal, false)).toEqual(false)
  })

  it('does not take a 403 that CloudFront passed through', () => {
    expect(isRefusedForRate({ status: 403 }, true)).toEqual(false)
    expect(isRefusedForRate({ status: 403, server: 'nginx' }, true)).toEqual(
      false,
    )
  })

  it('does not take other CloudFront errors as refusals', () => {
    expect(isRefusedForRate({ status: 400, server: 'CloudFront' }, true)).toEqual(
      false,
    )
  })
})
