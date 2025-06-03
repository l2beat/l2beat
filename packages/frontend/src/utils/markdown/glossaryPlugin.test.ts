import { expect } from 'earl'
import MarkdownIt from 'markdown-it'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/GlossaryContext'
import { glossaryPlugin, linkGlossaryTerms } from './glossaryPlugin'

describe(linkGlossaryTerms.name, () => {
  const glossary: GlossaryTermWithoutDescription[] = [
    {
      id: 'blob',
      matches: ['Blob', 'blobs'],
    },
    {
      id: 'node',
      matches: ['Node'],
    },
    {
      id: 'dac',
      matches: ['Data Availability Committee (DAC)'],
    },
    {
      id: 'da',
      matches: ['Data availability'],
    },
  ]

  const linkTerms = linkGlossaryTerms(glossary)

  it('should replace glossary terms with links', () => {
    const input =
      'Data Availability Committee (DAC) is cooking. Data availability is spicy.'
    const output = linkTerms(input)
    expect(output).toEqual(
      '[Data Availability Committee (DAC)](/glossary#dac) is cooking. [Data availability](/glossary#da) is spicy.',
    )
  })

  it('should not replace terms within existing markdown links', () => {
    const input = 'Check out more here: [Blob](https://example.com).'
    const output = linkTerms(input)
    expect(output).toEqual(input)
  })

  it('should ignore linking terms wrapped with delimiters', () => {
    const input = ':Data availability: is spicy. Also Blob is not spicy.'
    const output = linkTerms(input)
    expect(output).toEqual(
      'Data availability is spicy. Also [Blob](/glossary#blob) is not spicy.',
    )
  })

  it('should remove ignore delimiters from the text', () => {
    const input = 'JavaScript is :TypeScript:.'
    const output = linkTerms(input)
    expect(output).not.toInclude(':')
  })

  it('should remove ignore delimiters from multi-words', () => {
    const input = 'TypeScript is :JavaScript but on steroids:.'
    const output = linkTerms(input)
    expect(output).not.toInclude(':')
  })
})

describe(glossaryPlugin.name, () => {
  const md = new MarkdownIt()
  md.use(glossaryPlugin)

  it('should add data-link-role attribute to glossary links', () => {
    const input = '[Blob](/glossary#blob)'
    const output = md.render(input)
    expect(output).toInclude('data-link-role="glossary"')
  })

  it('should not add data-link-role to non-glossary links', () => {
    const input = '[Blob](https://example.com)'
    const output = md.render(input)
    expect(output).not.toInclude('data-link-role="glossary"')
  })
})
