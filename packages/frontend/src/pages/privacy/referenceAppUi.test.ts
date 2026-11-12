import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { getReferenceAppDelivery, getReferenceAppNotes } from './referenceAppUi'

const SOURCE = {
  repository: 'https://github.com/example/app',
  commit: '17c54dae9ad91bb3c6d62a7860df6cd365ab76d4',
}
const HASH = '8c2260aaf7d7a16f4003d6c2a57c80ee2a7b8725e48adbbe9104d8b1666346eb'

function app(overrides: Partial<PrivacyReferenceApp>): PrivacyReferenceApp {
  return {
    name: 'App',
    url: 'https://app.example',
    since: '2026-10-13',
    iconUrl: '/icons/app.png',
    delivery: { type: 'hosted' },
    checkedApps: [],
    ...overrides,
  }
}

describe('referenceAppUi', () => {
  describe(getReferenceAppDelivery.name, () => {
    it('calls a pinned build reproducible only after a rebuild', () => {
      const pin = { type: 'sha256', file: 'app.AppImage', hash: HASH } as const
      const rebuilt = getReferenceAppDelivery(
        app({
          version: '1.0.0',
          source: SOURCE,
          delivery: { type: 'pinned', pin, rebuild: 'https://recipe.example' },
        }),
      )
      expect(rebuilt.label).toEqual('Pinned, reproducible')
      expect(rebuilt.rebuild).toEqual('https://recipe.example')
      expect(rebuilt.check).toEqual({
        label: 'SHA-256 of app.AppImage',
        value: HASH,
      })

      const open = getReferenceAppDelivery(
        app({ source: SOURCE, delivery: { type: 'pinned', pin } }),
      )
      expect(open.label).toEqual('Pinned, open')
      expect(open.rebuild).toEqual(undefined)
    })

    it('shows a contract pin by its plain address', () => {
      const { check } = getReferenceAppDelivery(
        app({
          source: SOURCE,
          delivery: {
            type: 'pinned',
            pin: {
              type: 'contract',
              address: ChainSpecificAddress(
                'eth:0x0000000d42137547140b0812E1178F025e08bc49',
              ),
            },
          },
        }),
      )
      expect(check).toEqual({
        label: 'Contract',
        value: '0x0000000d42137547140b0812E1178F025e08bc49',
      })
    })

    it('gives a latest-only app its version to check, when the review has one', () => {
      const delivery = { type: 'latestOnly', store: 'App Store' } as const
      const reviewed = getReferenceAppDelivery(
        app({ version: '3.15.0', source: SOURCE, delivery }),
      )
      expect(reviewed.label).toEqual('Latest only, open')
      expect(reviewed.check).toEqual({ label: 'App Store, version 3.15.0' })

      const untraced = getReferenceAppDelivery(app({ delivery }))
      expect(untraced.label).toEqual('Latest only, closed')
      expect(untraced.check).toEqual({ label: 'App Store' })
    })

    it('leaves a hosted app nothing to check', () => {
      const hosted = getReferenceAppDelivery(app({ source: SOURCE }))
      expect(hosted.label).toEqual('Hosted, open')
      expect(hosted.check).toEqual(undefined)
      expect(hosted.kind.id).toEqual('hosted')
      expect(hosted.source).toEqual({
        id: 'open',
        label: 'open',
        sentiment: 'warning',
        description:
          'The source is public, but no rebuild confirms the app comes from it.',
      })
    })
  })

  describe(getReferenceAppNotes.name, () => {
    it('counts the apps checked', () => {
      const checkedApp = {
        name: 'Other',
        iconUrl: '/icons/other.png',
        finding: 'Leaks more.',
        source: 'https://other.example',
      }
      expect(getReferenceAppNotes(app({ checkedApps: [checkedApp] }))).toEqual([
        'most private of 2 checked',
      ])
    })
  })
})
