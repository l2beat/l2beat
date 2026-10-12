import { expect } from 'earl'
import { firstSentence } from './listPageMarkdown'

describe(firstSentence.name, () => {
  it('keeps the first sentence, not splitting on decimals', () => {
    expect(
      firstSentence('The 0.1 ETH pool is public.\nThe relayer sees it.'),
    ).toEqual('The 0.1 ETH pool is public.')
  })

  it('returns text without a sentence end whole', () => {
    expect(firstSentence('  Link private  ')).toEqual('Link private')
  })
})
