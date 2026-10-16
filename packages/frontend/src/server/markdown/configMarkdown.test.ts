import { expect } from 'earl'
import { configMarkdown } from './configMarkdown'

// Method: feed small hand-written config snippets and compare with the
// expected text literally. Tidying is checked at level 1, where no heading
// moves, so each case shows that rule alone.
describe(configMarkdown.name, () => {
  describe('nesting', () => {
    it('moves the shallowest heading to the given level, keeping the hierarchy', () => {
      expect(configMarkdown('## Architecture\n\nText\n\n### Nodes', 4)).toEqual(
        '#### Architecture\n\nText\n\n##### Nodes',
      )
    })

    it('leaves text that is already deep enough or has no headings', () => {
      expect(configMarkdown('#### Deep', 3)).toEqual('#### Deep')
      expect(configMarkdown('Plain #hashtag text', 3)).toEqual(
        'Plain #hashtag text',
      )
    })

    it('does not treat # lines inside code fences as headings', () => {
      expect(configMarkdown('# Title\n\n```\n# comment\n```', 3)).toEqual(
        '### Title\n\n```\n# comment\n```',
      )
    })

    it('stops at level 6, the deepest markdown heading', () => {
      expect(configMarkdown('# One\n\n## Two', 6)).toEqual(
        '###### One\n\n###### Two',
      )
    })
  })

  describe('tidying', () => {
    it('turns br tags, raw or HTML-escaped, into line breaks', () => {
      expect(
        configMarkdown(
          '1. a\n<br>\n## Next\n\nOne.<br />Two. &lt;br/&gt; Three.',
          1,
        ),
      ).toEqual('1. a\n\n## Next\n\nOne.\nTwo.\nThree.')
    })

    it('keeps table rows on one line when a cell has a br tag', () => {
      expect(configMarkdown('| a<br>b | c |', 1)).toEqual('| a b | c |')
    })

    it('renders absent text as no block', () => {
      expect(configMarkdown(undefined, 1)).toEqual('')
      expect(configMarkdown('\n  \n', 1)).toEqual('')
    })

    it('drops blank lines around the text, which would double the gap between blocks', () => {
      expect(configMarkdown('\nv1.6 OffRamp on Base.\n', 1)).toEqual(
        'v1.6 OffRamp on Base.',
      )
    })

    it('trims trailing spaces and collapses blank-line runs', () => {
      expect(configMarkdown('One.  \n\n\n\nTwo. ', 1)).toEqual('One.\n\nTwo.')
    })

    it('collapses runs of spaces in prose, but not in inline code or tables', () => {
      expect(
        configMarkdown('Too  many   spaces in `a  b`.\n| x  | y |', 1),
      ).toEqual('Too many spaces in `a  b`.\n| x  | y |')
    })

    it('uses one bullet marker', () => {
      expect(configMarkdown('* one\n  * nested\n**bold**', 1)).toEqual(
        '- one\n  - nested\n**bold**',
      )
    })

    it('aligns wrapped lines of template-literal text with the text they continue', () => {
      expect(
        configMarkdown(
          'It delivers\n      limitless scale.\n\n- An item\n      wrapped.\n    - nested',
          1,
        ),
      ).toEqual(
        'It delivers\nlimitless scale.\n\n- An item\n  wrapped.\n    - nested',
      )
    })

    it('keeps indented code after a blank line', () => {
      const code = 'Run:\n\n    make  build\n    make  test'
      expect(configMarkdown(code, 1)).toEqual(code)
    })

    it('leaves fenced code verbatim', () => {
      const code =
        '```\n* not a bullet\n\n\n\nx  =  1 <br> [a](#b)\n      indented\n```'
      expect(configMarkdown(code, 1)).toEqual(code)
    })
  })
})
