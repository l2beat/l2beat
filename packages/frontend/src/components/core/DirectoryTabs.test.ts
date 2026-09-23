import { expect } from 'earl'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  DirectoryTabs,
  DirectoryTabsActiveOnly,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from './DirectoryTabs'

// Renders the tabs the way the server does (no window), so the output is the
// HTML a crawler receives. The selected tab comes from the SSR URL.
describe('DirectoryTabs', () => {
  it('renders the inactive panel content hidden', () => {
    const html = renderTabs('/layer2s/summary')

    expect(panel(html, 'first')).toInclude('First content')
    expect(panel(html, 'first')).not.toInclude('hidden=""')
    expect(panel(html, 'second')).toInclude('Second content')
    expect(panel(html, 'second')).toInclude('hidden=""')
  })

  it('shows the panel selected by the tab query param', () => {
    const html = renderTabs('/layer2s/summary?tab=second')

    expect(panel(html, 'first')).toInclude('hidden=""')
    expect(panel(html, 'second')).not.toInclude('hidden=""')
  })

  it('renders active-only content in the active panel alone', () => {
    const html = renderTabs('/layer2s/summary')

    expect(panel(html, 'first')).toInclude('First chart')
    expect(html).not.toInclude('Second chart')
  })
})

function renderTabs(url: string): string {
  globalThis.__FIX_SSR_URL__ = url
  return renderToStaticMarkup(
    createElement(
      DirectoryTabs,
      { defaultValue: 'first' },
      createElement(
        DirectoryTabsList,
        undefined,
        createElement(DirectoryTabsTrigger, { value: 'first' }, 'First'),
        createElement(DirectoryTabsTrigger, { value: 'second' }, 'Second'),
      ),
      tabPanel('first', 'First content', 'First chart'),
      tabPanel('second', 'Second content', 'Second chart'),
    ),
  )
}

function tabPanel(value: string, content: ReactNode, activeOnly: ReactNode) {
  return createElement(
    DirectoryTabsContent,
    { value },
    content,
    createElement(DirectoryTabsActiveOnly, undefined, activeOnly),
  )
}

function panel(html: string, value: string): string {
  const match = html.match(
    new RegExp(`<div[^>]*id="[^"]*-content-${value}"[^>]*>.*?</div>`),
  )
  if (!match) {
    throw new Error(`No panel "${value}" in: ${html}`)
  }
  return match[0]
}
