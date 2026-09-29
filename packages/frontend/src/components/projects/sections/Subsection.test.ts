import { expect } from 'earl'
import {
  createElement,
  type FunctionComponent,
  type Provider,
  type ReactNode,
} from 'react'
import { renderToString } from 'react-dom/server'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { Markdown } from '~/components/markdown/Markdown'
import { ParentHeadingLevelProvider } from '~/components/markdown/ParentHeadingLevelContext'
import { Subsection, SubsectionHeading } from './Subsection'

// Why: a subsection's title and everything under it must nest below the
// enclosing heading, however deep the subsections go.
// How: server-render subsections under a given parent level and compare HTML.
describe(Subsection.name, () => {
  it('nests its heading, markdown and inner subsections below the parent', () => {
    const html = renderToString(
      withChildren(
        GlossaryContextProvider,
        { terms: [] },
        withChildren(
          ParentHeadingLevelProvider,
          { value: 2 },
          subsection(
            'Sequencer',
            createElement(Markdown, null, '### Details'),
            subsection('Censorship resistance'),
          ),
        ),
      ),
    )

    expect(html).toInclude('<h3>Sequencer</h3>')
    expect(html).toInclude('<h4 class="mdc-h3">Details</h4>')
    expect(html).toInclude('<h4>Censorship resistance</h4>')
  })

  it('never renders a heading above h2, which is taken by the page title', () => {
    expect(
      renderToString(createElement(SubsectionHeading, null, 'Title')),
    ).toEqual('<h2>Title</h2>')
  })
})

function subsection(title: string, ...children: ReactNode[]) {
  return withChildren(
    Subsection,
    { title: createElement(SubsectionHeading, null, title) },
    ...children,
  )
}

// createElement's types want `children` in props, while lint wants them passed
// as arguments; this satisfies both for components that require children.
function withChildren<P extends { children?: ReactNode }>(
  type: FunctionComponent<P> | Provider<unknown>,
  props: Omit<P, 'children'>,
  ...children: ReactNode[]
) {
  return createElement(type as FunctionComponent<P>, props as P, ...children)
}
