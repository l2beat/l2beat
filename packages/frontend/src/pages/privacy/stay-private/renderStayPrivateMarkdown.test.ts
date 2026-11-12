import type { PrivacyAdversary } from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { renderStayPrivateMarkdown } from './renderStayPrivateMarkdown'

// Method: render one protocol whose advice has a random wait, and check the
// lines an agent relies on: the steps in order, and the table saying what the
// fastest goal leaves out and which rating it stops claiming.

const ADVERSARIES = (['publicObserver', 'chainAnalyst'] as const).map(
  (id) => ({ id, label: id === 'chainAnalyst' ? 'Chain analyst' : 'Public observer' }) as PrivacyAdversary,
)

const PROTOCOL: PrivacyAdviceProtocol = {
  slug: 'pool',
  name: 'Pool',
  icon: '/icons/pool.png',
  href: '/privacy/projects/pool',
  category: 'Pool',
  steps: [
    { name: 'Wait', text: 'Wait.', against: ['chainAnalyst'], randomWait: true },
    { name: 'Exit', text: 'Exit.', against: ['publicObserver'] },
  ],
  sentiments: {
    publicObserver: 'good',
    chainAnalyst: 'good',
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
    waitWindowDays: 30,
  })

  it('lists the steps with how to draw the wait', () => {
    expect(markdown).toInclude('1. **Wait.** Wait. Draw the wait once')
    expect(markdown).toInclude('2. **Exit.** Exit. Against: public observer.')
  })

  it('says what the fastest goal leaves out and which rating it stops claiming', () => {
    expect(markdown).toInclude('| Fastest | 1 | Wait | chain analyst |')
    expect(markdown).toInclude('| Most private | 2 | - | - |')
  })

  it('says when data is missing or the review is being updated', () => {
    expect(markdown).toInclude('Anonymity set: Still being indexed.')
    expect(markdown).toInclude('**Warning:** This review is being updated.')
  })
})
