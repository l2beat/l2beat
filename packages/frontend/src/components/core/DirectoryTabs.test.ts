import { expect } from 'earl'
import { createElement, type ReactNode } from 'react'
import { getTabPanelHtml, renderServerHtml } from '~/test/serverHtml'
import {
  DirectoryTabs,
  DirectoryTabsActiveOnly,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from './DirectoryTabs'

// Renders the tabs the way the server does and inspects the HTML a crawler
// receives. The selected tab comes from the `tab` query param of the URL.
describe(DirectoryTabs.name, () => {
  it('renders the inactive panel content hidden', () => {
    const html = renderTabs('/layer2s/summary')

    expect(getTabPanelHtml(html, 'first')).toInclude('First content')
    expect(getTabPanelHtml(html, 'first')).not.toInclude('hidden=""')
    expect(getTabPanelHtml(html, 'second')).toInclude('Second content')
    expect(getTabPanelHtml(html, 'second')).toInclude('hidden=""')
  })

  it('shows the panel selected by the tab query param', () => {
    const html = renderTabs('/layer2s/summary?tab=second')

    expect(getTabPanelHtml(html, 'first')).toInclude('hidden=""')
    expect(getTabPanelHtml(html, 'second')).not.toInclude('hidden=""')
  })

  it('renders active-only content in the active panel alone', () => {
    const html = renderTabs('/layer2s/summary')

    expect(getTabPanelHtml(html, 'first')).toInclude('First chart')
    expect(html).not.toInclude('Second chart')
  })
})

function renderTabs(url: string): string {
  return renderServerHtml(
    url,
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
    createElement('p', undefined, content),
    createElement(DirectoryTabsActiveOnly, undefined, activeOnly),
  )
}
