import { expect } from 'earl'
import type { ChangelogEntry } from './getChangelogEntries'
import {
  selectActiveChangelogWhatsNewWidget,
  sortChangelogEntries,
} from './getChangelogEntries'

describe('changelog whats new selection', () => {
  it('sorts changelog entries by published date descending', () => {
    const older = makeEntry('older', '2026-01-01T00:00:00.000Z')
    const newer = makeEntry('newer', '2026-02-01T00:00:00.000Z')

    const result = sortChangelogEntries([older, newer])

    expect(result.map((entry) => entry.id)).toEqual(['newer', 'older'])
  })

  it('selects the most recent active widget when there are overlaps', () => {
    const now = new Date('2026-02-19T14:00:00.000Z')
    const oldActive = makeEntry('old-active', '2026-02-10T00:00:00.000Z', {
      image: '/old.png',
      alt: 'old',
      expiresAt: '2026-03-01T00:00:00.000Z',
    })
    const newActive = makeEntry('new-active', '2026-02-18T00:00:00.000Z', {
      image: '/new.png',
      alt: 'new',
      expiresAt: '2026-03-01T00:00:00.000Z',
    })

    const result = selectActiveChangelogWhatsNewWidget(
      [oldActive, newActive],
      now,
    )

    expect(result?.id).toEqual('changelog-new-active')
    expect(result?.image).toEqual('/new.png')
  })

  it('skips expired and future widgets', () => {
    const now = new Date('2026-02-19T14:00:00.000Z')
    const expired = makeEntry('expired', '2026-02-01T00:00:00.000Z', {
      image: '/expired.png',
      alt: 'expired',
      expiresAt: '2026-02-10T00:00:00.000Z',
    })
    const future = makeEntry('future', '2026-02-20T00:00:00.000Z', {
      image: '/future.png',
      alt: 'future',
      expiresAt: '2026-03-10T00:00:00.000Z',
    })

    const result = selectActiveChangelogWhatsNewWidget([expired, future], now)

    expect(result).toEqual(undefined)
  })

  it('falls back to changelog anchor link when href is missing', () => {
    const now = new Date('2026-02-19T14:00:00.000Z')
    const active = makeEntry('anchor-test', '2026-02-18T00:00:00.000Z', {
      image: '/banner.png',
      alt: 'banner',
      expiresAt: '2026-03-01T00:00:00.000Z',
    })

    const result = selectActiveChangelogWhatsNewWidget([active], now)

    expect(result?.href).toEqual('/changelog#anchor-test')
  })
})

function makeEntry(
  id: string,
  publishedAt: string,
  whatsNew?: {
    image: string
    alt: string
    href?: string
    mobileDisabledOnMatches?: string[]
    expiresAt: string
  },
): ChangelogEntry {
  return {
    id,
    title: id,
    summary: undefined,
    publishedAt: new Date(publishedAt),
    content: 'content',
    whatsNew: whatsNew
      ? {
          image: whatsNew.image,
          alt: whatsNew.alt,
          href: whatsNew.href,
          mobileDisabledOnMatches: whatsNew.mobileDisabledOnMatches,
          expiresAt: new Date(whatsNew.expiresAt),
        }
      : undefined,
  }
}
