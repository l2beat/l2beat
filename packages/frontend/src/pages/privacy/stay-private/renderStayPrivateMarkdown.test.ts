import type { PrivacyAdversary, PrivacyNeed } from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { renderStayPrivateMarkdown } from './renderStayPrivateMarkdown'

// Method: render one protocol whose advice has an outside step and a random
// wait, and check the lines an agent relies on: the need's table with every
// rating, the tools, the steps in order, and the table saying which ratings
// stop holding without an effort.

const ADVERSARIES = (['publicObserver', 'chainAnalyst'] as const).map(
  (id) =>
    ({
      id,
      label: id === 'chainAnalyst' ? 'Chain analyst' : 'Public observer',
    }) as PrivacyAdversary,
)

const NEED: PrivacyNeed = {
  id: 'moveFunds',
  label: 'Move funds without a link',
  description: 'Funds leave to an unlinked address.',
}

const PROTOCOL: PrivacyAdviceProtocol = {
  slug: 'pool',
  name: 'Pool',
  icon: '/icons/pool.png',
  href: '/privacy/projects/pool',
  needId: 'moveFunds',
  categoryLabel: 'Pool',
  promise: 'Hides which deposit funds which withdrawal.',
  holdings: [{ symbol: 'ETH', chain: 'ethereum' }],
  anonymitySetSize: undefined,
  tvsUsd: undefined,
  steps: [
    {
      name: 'Set up',
      text: 'Open the app in Tor Browser.',
      against: ['publicObserver'],
      outside: true,
      tools: [
        {
          name: 'Tor Browser',
          href: '/publications/privacy-methodology#tool-tor-browser',
          effort: 'a free install',
        },
      ],
    },
    {
      name: 'Wait',
      text: 'Wait.',
      against: ['chainAnalyst'],
      randomWait: true,
      tools: [],
    },
  ],
  sentiments: {
    publicObserver: 'good',
    chainAnalyst: 'warning',
    networkObserver: 'good',
    privilegedInsider: 'good',
    futureAdversary: 'good',
  },
  insider: 'Nobody can change the pool.',
  exitWindow: { value: 'Infinite', sentiment: 'good', description: '' },
  anonymitySet: { status: 'missing', text: 'Still being indexed.' },
  isUnderReview: true,
}

describe(renderStayPrivateMarkdown.name, () => {
  const markdown = renderStayPrivateMarkdown({
    protocols: [PROTOCOL],
    adversaries: ADVERSARIES,
    needs: [NEED],
    waitWindowDays: 30,
  })

  it('lists each need with every rating, the tools and the wait of its protocols', () => {
    expect(markdown).toInclude(
      '## Move funds without a link (`?need=moveFunds`)',
    )
    expect(markdown).toInclude(
      '| Pool | Pool | Private | At risk | no count | Tor Browser | yes |',
    )
  })

  it('lists the tools of a setup with the effort each takes', () => {
    expect(markdown).toInclude(
      'What you need: [Tor Browser](https://ethbeat.org/publications/privacy-methodology#tool-tor-browser) (a free install)',
    )
  })

  it('lists the steps with how to draw the wait', () => {
    expect(markdown).toInclude('1. **Set up, outside the app.**')
    expect(markdown).toInclude('2. **Wait.** Wait. Draw the wait once')
  })

  it('says which steps go and which ratings stop holding without an effort', () => {
    expect(markdown).toInclude('| Wait up to 30 days | Wait | chain analyst |')
    expect(markdown).toInclude(
      '| Set up tools outside the app | Set up | public observer |',
    )
  })

  it('says when data is missing or the review is being updated', () => {
    expect(markdown).toInclude('Anonymity set: Still being indexed.')
    expect(markdown).toInclude('**Warning:** This review is being updated.')
  })
})
