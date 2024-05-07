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
  {
    name: 'Escrows',
    url: '/status/escrows',
    queryParams: [
      {
        name: 'projects',
        description: 'Comma separated list of project ids',
        example:
          'http://localhost:3000/status/escrows?projects=arbitrum,optimism',
      },
    ],
  },
]

export function StatusPagesLinksPage() {
  return (
    <Page title="Status pages links">
      <div className={`card`} style={{ width: '800px' }}>
        <p>Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {LINKS.map((link, i) => (
            <div className="card">
              <p>
                <a key={i} href={link.url}>
                  {link.name}
                </a>
              </p>
              <p>
                {link.queryParams && (
                  <div>
                    Query params:
                    <ul>
                      {link.queryParams.map((param) => (
                        <li>
                          <b>{param.name}</b>: {param.description} <br />
                          Example: <a href={param.example}>{param.example}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

export function renderStatusPagesLinksPage() {
  return reactToHtml(<StatusPagesLinksPage />)
}
