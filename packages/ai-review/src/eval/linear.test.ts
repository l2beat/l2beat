import { expect } from 'earl'
import { findLinearIssueId } from './linear.js'

describe(findLinearIssueId.name, () => {
  it('prefers earlier sources and normalizes case', () => {
    expect(
      findLinearIssueId('Closes l2b-13633', 'user/l2b-12520-branch'),
    ).toEqual('L2B-13633')
  })

  it('falls through null and undefined sources', () => {
    expect(findLinearIssueId(null, undefined, 'feat/l2b-1-x')).toEqual('L2B-1')
    expect(findLinearIssueId(null, 'no id here')).toEqual(undefined)
  })
})
