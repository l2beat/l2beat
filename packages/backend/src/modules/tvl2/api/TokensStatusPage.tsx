import { TokenQuery } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import React from 'react'

import { Page } from '../../status/Page'
import { reactToHtml } from '../../status/reactToHtml'

interface TokenQueryWithTarget extends TokenQuery {
  targetDataPoints: number
}
interface TokensStatusPageProps {
  tokens: TokenQueryWithTarget[]
}

// move all outside the tab
// when clicking on chain/project navigate to new tab JSON

export function TokensStatusPage({ tokens }: TokensStatusPageProps) {
  const tokensByChain = groupBy(tokens, 'chain')
  const tokensByProject = groupBy(tokens, 'project')

  return (
    <Page title="Tokens">
      <div className="tabs">
        <input type="radio" name="tabs" id="tabone" readOnly checked />
        <label htmlFor="tabone">
          All <CountBadge count={tokens.length} />
        </label>
        <div className="tab">
          <div className={`card`}>
            <p>Summary</p>
            <Stats tokens={tokens} />
            <LinkToList chain={undefined} project={undefined} />
          </div>
        </div>
        <input type="radio" name="tabs" id="tabtwo" />
        <label htmlFor="tabtwo">
          Chains <CountBadge count={Object.entries(tokensByChain).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByChain)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([chain, tokens]) => (
              <Group key={chain} title={chain} count={tokens.length}>
                <Stats tokens={tokens} />
                <LinkToList chain={chain} project={undefined} />
                {Object.entries(groupBy(tokensByChain[chain], 'project'))
                  .sort(([_, a], [__, b]) => b.length - a.length)
                  .map(([chain, tokens]) => (
                    <Group key={chain} title={chain} count={tokens.length}>
                      <Stats tokens={tokens} />
                      <LinkToList chain={chain} project={undefined} />
                    </Group>
                  ))}
              </Group>
            ))}
        </div>
        <input type="radio" name="tabs" id="tabthree" />
        <label htmlFor="tabthree">
          Projects <CountBadge count={Object.entries(tokensByProject).length} />
        </label>
        <div className="tab">
          {Object.entries(tokensByProject)
            .sort(([_, a], [__, b]) => b.length - a.length)
            .map(([project, tokens]) => (
              <Group key={project} title={project} count={tokens.length}>
                <Stats tokens={tokens} />
                <LinkToList chain={undefined} project={project} />
                {Object.entries(groupBy(tokensByProject[project], 'chain'))
                  .sort(([_, a], [__, b]) => b.length - a.length)
                  .map(([chain, tokens]) => (
                    <Group key={chain} title={chain} count={tokens.length}>
                      <Stats tokens={tokens} />
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

function Stats({ tokens }: { tokens: TokenQueryWithTarget[] }) {
  return (
    <div>
      Target data points:{' '}
      {tokens
        .reduce((acc, t) => acc + t.targetDataPoints, 0)
        .toLocaleString('en-US')}
    </div>
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
