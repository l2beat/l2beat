import { expect } from 'earl'
import MarkdownIt from 'markdown-it'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { glossaryPlugin, linkGlossaryTerms } from './glossaryPlugin'

describe(linkGlossaryTerms.name, () => {
  const glossary: GlossaryTerm[] = [
    {
      id: 'blob',
      matches: ['Blob', 'blobs'],
      description: 'Blob description',
    },
    {
      id: 'node',
      matches: ['Node'],
      description: 'Node description',
    },
    {
      id: 'dac',
      matches: ['Data Availability Committee (DAC)'],
      description: 'DAC description',
    },
    {
      id: 'da',
      matches: ['Data availability'],
      description: 'DA description',
    },
  ]

  const linkTerms = linkGlossaryTerms(glossary)

  it('should replace glossary terms with links', () => {
    const input =
      'Data Availability Committee (DAC) is cooking. Data availability is spicy.'
    const output = linkTerms(input)
    expect(output).toEqual(
      `[Data Availability Committee (DAC)](/glossary#dac?description=${encodeURIComponent(
        'DAC description',
      )}) is cooking. [Data availability](/glossary#da?description=${encodeURIComponent(
        'DA description',
      )}) is spicy.`,
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
      `Data availability is spicy. Also [Blob](/glossary#blob?description=${encodeURIComponent(
        'Blob description',
      )}) is not spicy.`,
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
    const input = '[Blob](/glossary#blob?description=Blob%20description)'
    const output = md.render(input)
    expect(output).toInclude('data-link-role="glossary"')
  })

  it('should not add data-link-role to non-glossary links', () => {
    const input = '[Blob](https://example.com)'
    const output = md.render(input)
    expect(output).not.toInclude('data-link-role="glossary"')
  })
})
