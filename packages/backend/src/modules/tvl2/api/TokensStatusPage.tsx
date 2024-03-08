import { TokenQuery } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from '../../status/Page'
import { reactToHtml } from '../../status/reactToHtml'

interface TokenQueryWithDatapoints extends TokenQuery {
  dataPoints: number
}

interface TokensStatusPageProps {
  tokens: TokenQueryWithDatapoints[]
  tokensByChain: Record<string, TokenQueryWithDatapoints[]>
  tokensByProject: Record<string, TokenQueryWithDatapoints[]>
}

// move all outside the tab
// when clicking on chain/project navigate to new tab JSON

export function TokensStatusPage({
  tokens,
  tokensByChain,
  tokensByProject,
}: TokensStatusPageProps) {
  return (
    <Page title="Tokens">
      <div className="tabs">
        <input type="radio" name="tabs" id="tabone" checked />
        <label htmlFor="tabone">
          All <CountBadge count={tokens.length} />
        </label>
        <div className="tab">
          <div>
            Target data points:{' '}
            {tokens.reduce((sum, token) => sum + token.dataPoints, 0) * 2}
            <div>hourly</div>
            <div>sixHourly</div>
            <div>daily</div>
          </div>
          <div>
            Prices: {tokens.reduce((sum, token) => sum + token.dataPoints, 0)}
          </div>
          <div>
            Amounts: {tokens.reduce((sum, token) => sum + token.dataPoints, 0)}
          </div>
          <a href="#">see all</a>
        </div>
        <input type="radio" name="tabs" id="tabtwo" />
        <label htmlFor="tabtwo">
          By chain <CountBadge count={Object.entries(tokensByChain).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByChain)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([chain, tokens]) => (
              <Group key={chain} title={chain} count={tokens.length}>
                tokens
                {/* {tokens.map((token, i) => (
                <Token key={i} token={token} />
              ))} */}
              </Group>
            ))}
        </div>
        <input type="radio" name="tabs" id="tabthree" />
        <label htmlFor="tabthree">
          By project{' '}
          <CountBadge count={Object.entries(tokensByProject).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByProject)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([chain, tokens]) => (
              <Group key={chain} title={chain} count={tokens.length}>
                tokens
                {/* {tokens.map((token, i) => (
                <Token key={i} token={token} />
              ))} */}
              </Group>
            ))}
        </div>
      </div>
    </Page>
  )
}

export function renderTokensStatusPage(props: TokensStatusPageProps) {
  return reactToHtml(<TokensStatusPage {...props} />)
}

export function Group({
  title,
  children,
  count,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <details>
      <summary>
        {title} <CountBadge count={count} />
      </summary>
      <p>{children}</p>
    </details>
  )
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        background: '#7E41CC',
        padding: '4px',
        color: '#FAFAFA',
        borderRadius: '4px',
      }}
    >
      {count}
    </span>
  )
}
