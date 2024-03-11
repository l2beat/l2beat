import { Token2 } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import React from 'react'

import { Page } from '../../status/Page'
import { reactToHtml } from '../../status/reactToHtml'

interface Token2WithTarget extends Token2 {
  targetDataPoints: number
}
interface TokensStatusPageProps {
  tokens: Token2WithTarget[]
}

export function TokensStatusPage({ tokens }: TokensStatusPageProps) {
  const tokensByChain = groupBy(tokens, 'chain')
  const tokensByProject = groupBy(tokens, 'project')
  const deduplicatedTokens = deduplicateTokens(tokens)

  return (
    <Page title="Tokens">
      <div className="tabs">
        <input type="radio" name="tabs" id="all" readOnly checked />
        <label htmlFor="all">
          All <CountBadge count={tokens.length} />
        </label>
        <div className="tab">
          <div className={`card`}>
            <p>Amounts</p>
            <div>Tokens: {tokens.length}</div>
            <DataPointsStats title="Target data points" tokens={tokens} />

            <LinkToList chain={undefined} project={undefined} />
          </div>

          <div className={`card`}>
            <p>Prices</p>

            <div>Unique tokens: {deduplicatedTokens.length}</div>
            <DataPointsStats
              title="Target data points"
              tokens={deduplicatedTokens}
            />

            {deduplicatedTokens
              .sort((a, b) => a.symbol.localeCompare(b.symbol))
              .map((token) => (
                <PriceTokens key={token.address.toString()} token={token} />
              ))}
          </div>
        </div>

        <input type="radio" name="tabs" id="chains" />
        <label htmlFor="chains">
          Chains <CountBadge count={Object.entries(tokensByChain).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByChain)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([chain, tokens]) => (
              <Group key={chain} title={chain} count={tokens.length}>
                <div>Tokens: {tokens.length}</div>

                <DataPointsStats title="Target data points" tokens={tokens} />
                <LinkToList chain={chain} project={undefined} />
                {Object.entries(groupBy(tokensByChain[chain], 'project'))
                  .sort(([_, a], [__, b]) => b.length - a.length)
                  .map(([chain, tokens]) => (
                    <Group key={chain} title={chain} count={tokens.length}>
                      <div>Tokens: {tokens.length}</div>

                      <DataPointsStats
                        title="Target data points"
                        tokens={tokens}
                      />
                      <LinkToList chain={chain} project={undefined} />
                    </Group>
                  ))}
              </Group>
            ))}
        </div>

        <input type="radio" name="tabs" id="projects" />
        <label htmlFor="projects">
          Projects <CountBadge count={Object.entries(tokensByProject).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByProject)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([project, tokens]) => (
              <Group key={project} title={project} count={tokens.length}>
                <div>Tokens: {tokens.length}</div>
                <DataPointsStats title="Target data points" tokens={tokens} />
                <LinkToList chain={undefined} project={project} />
                {Object.entries(groupBy(tokensByProject[project], 'chain'))
                  .sort(([_, a], [__, b]) => b.length - a.length)
                  .map(([chain, tokens]) => (
                    <Group key={chain} title={chain} count={tokens.length}>
                      <div>Tokens: {tokens.length}</div>
                      <DataPointsStats
                        title="Target data points"
                        tokens={tokens}
                      />
                      <LinkToList chain={chain} project={undefined} />
                    </Group>
                  ))}
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

function deduplicateTokens(tokens: Token2WithTarget[]) {
  const seen = new Set<string>()
  return tokens.filter((t) => {
    const key = `${t.chain}-${t.address.toString()}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function DataPointsStats({
  title,
  tokens,
}: {
  title: string
  tokens: Token2WithTarget[]
}) {
  return (
    <div>
      {title}:{' '}
      {tokens
        .reduce((acc, t) => acc + t.targetDataPoints, 0)
        .toLocaleString('en-US')}
    </div>
  )
}

function PriceTokens({ token }: { token: Token2WithTarget }) {
  return (
    <details>
      <summary>{token.symbol}</summary>
      <p>
        <div>chain: {token.chain}</div>
        <div>address: {token.address}</div>
        <div>price: {JSON.stringify(token.price)}</div>
      </p>
    </details>
  )
}

function LinkToList({ chain, project }: { chain?: string; project?: string }) {
  const query = new URLSearchParams()
  if (chain) {
    query.set('chain', chain)
  }
  if (project) {
    query.set('project', project)
  }

  const url = `/status/tokens/list${
    query.size > 0 ? '?' : ''
  }${query.toString()}`

  return (
    <a href={url.toString()} target="_blank" rel="noreferrer">
      view list
    </a>
  )
}

function Group({
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

function CountBadge({ count }: { count: number }) {
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
