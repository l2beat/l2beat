import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

const LINKS = [
  {
    name: 'Activity',
    url: '/api/activity/status',
  },
  {
    name: 'Discovery',
    url: '/status/discovery',
  },
  {
    name: 'Liveness',
    url: '/status/liveness',
  },
  {
    name: 'TVL',
    url: '/status/tvl',
  },
]

export function StatusPagesLinksPage() {
  return (
    <Page title="Status pages links">
      <div className={`card`} style={{ width: '800px' }}>
        <p>Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {LINKS.map((link) => (
            <a href={link.url}>{link.name}</a>
          ))}
        </div>
      </div>
    </Page>
  )
}

export function renderStatusPagesLinksPage() {
  return reactToHtml(<StatusPagesLinksPage />)
}
