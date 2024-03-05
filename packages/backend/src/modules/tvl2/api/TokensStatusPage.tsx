import React from 'react'

import { Page } from '../../status/Page'
import { reactToHtml } from '../../status/reactToHtml'
import { Token2 } from '../Token2'

interface TokensStatusPageProps {
  tokens: Token2[]
  tokensByChain: Record<string, Token2[]>
  tokensByProject: Record<string, Token2[]>
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
        <input type="radio" name="tabs" id="tabone" />
        <label htmlFor="tabone">
          All <CountBadge count={tokens.length} />
        </label>
        <div className="tab">
          {/* {tokens.map((token, i) => (
            <Token key={i} token={token} />
          ))} */}
        </div>
        <input type="radio" name="tabs" id="tabtwo" />
        <label htmlFor="tabtwo">By chain</label>
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
        <label htmlFor="tabthree">By project</label>
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

export function Token({ token }: { token: Token2 }) {
  switch (token.type) {
    case 'CIRCULATING_SUPPLY':
      return (
        <div>
          <span>{token.type}</span>
          <span>{token.project}</span>
          <span>{token.coingeckoId}</span>
        </div>
      )

    case 'TOTAL_SUPPLY':
      return (
        <div>
          <span>{token.type}</span>
          <span>{token.project}</span>
          <span>{token.address}</span>
        </div>
      )

    case 'ESCROW_BALANCE':
      return (
        <div>
          <span>{token.type}</span>
          <span>{token.project}</span>
          <span>{token.address}</span>
          <span>{token.escrow}</span>
        </div>
      )
  }
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
