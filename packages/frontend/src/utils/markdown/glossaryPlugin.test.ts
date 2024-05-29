import { expect } from 'earl'
import MarkdownIt from 'markdown-it'
import { GlossaryEntry } from '../../pages/glossary/props/getGlossaryEntry'
import { glossaryPlugin, linkGlossaryTerms } from './glossaryPlugin'

describe(linkGlossaryTerms.name, () => {
  const glossary: GlossaryEntry[] = [
    {
      term: 'Blob',
      id: 'blob',
      match: ['blobs'],
      definition: 'A blob of data.',
      isSpicy: false,
    },
    {
      id: 'node',
      term: 'Node',
      definition: 'A software client that participates in the network.',
      isSpicy: false,
    },
    {
      id: 'dac',
      term: 'Data Availability Committee (DAC)',
      definition:
        'A set of members whose task is attesting and ensuring that the data is available for the public. An onchain DAC verifier checks that a threshold of signatures from the DAC members is reached before considering a data commitment as available and therefore valid to be used in the system.',
      isSpicy: false,
    },
    {
      id: 'da',
      term: 'Data availability',
      definition:
        "The property of a rollup's data being reachable by any node retrieving the data that were rolled up and executed to reach the proposed state.",
      isSpicy: true,
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
