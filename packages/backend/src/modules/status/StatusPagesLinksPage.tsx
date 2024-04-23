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
    name: 'Tracked txs',
    url: '/status/tracked-txs',
  },
  {
    name: 'TVL',
    url: '/status/tvl',
  },
  {
    name: 'Indexers',
    url: '/status/indexers',
  },
  {
    name: 'Configurations',
    url: '/status/configurations',
  },
]

export function StatusPagesLinksPage() {
  return (
    <Page title="Status pages links">
      <div className={`card`} style={{ width: '800px' }}>
        <p>Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {LINKS.map((link, i) => (
            <a key={i} href={link.url}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </Page>
  )
}

export function renderStatusPagesLinksPage() {
  return reactToHtml(<StatusPagesLinksPage />)
}
