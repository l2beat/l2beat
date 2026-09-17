import { describe, expect, it } from 'vitest'
import { DiffHistoryParser } from './DiffHistoryParser'

const parser = new DiffHistoryParser()

describe('DiffHistoryParser', () => {
  describe('parse', () => {
    it('returns empty array for empty content', () => {
      expect(parser.parse('')).toEqual([])
    })

    it('returns empty array when only the leading hash is present', () => {
      const md = 'Generated with discovered.json: 0xabc\n\n'
      expect(parser.parse(md)).toEqual([])
    })

    it('takes the timestamp from the run, else from the header date', () => {
      const modern = parser.parse(
        [
          '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
          '',
          '- current timestamp: 1777994288',
          '',
        ].join('\n'),
      )
      const legacy = parser.parse(
        [
          '# Diff at Fri, 01 Mar 2024 10:00:00 GMT:',
          '',
          '- current block number: 19340000',
          '',
        ].join('\n'),
      )
      const unparsable = parser.parse(
        ['# Diff at not a date:', '', '- current block number: 1', ''].join(
          '\n',
        ),
      )
      expect(modern[0]!.timestamp).toBe(1777994288)
      expect(legacy[0]!.timestamp).toEqual(
        Math.floor(Date.parse('Fri, 01 Mar 2024 10:00:00 GMT') / 1000),
      )
      expect(unparsable[0]!.timestamp).toBe(null)
    })

    it('parses a modern (timestamp) entry with watched changes', () => {
      const md = [
        'Generated with discovered.json: 0xnewhash',
        '',
        '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
        '',
        '- author: Alice (<alice@example.com>)',
        '- comparing to: main@abc123 block: 1769513788',
        '- current timestamp: 1777994288',
        '',
        '## Description',
        '',
        'Did a thing.',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ added',
        '- removed',
        '```',
        '',
      ].join('\n')

      const entries = parser.parse(md)
      expect(entries.length).toBe(1)
      const entry = entries[0]!
      expect(entry.date).toBe('Tue, 05 May 2026 15:19:12 GMT')
      expect(entry.discoveryHash).toBe('0xnewhash')
      expect(entry.author).toBe('Alice (<alice@example.com>)')
      expect(entry.current).toEqual({
        kind: 'timestamp',
        value: 1777994288,
      })
      expect(entry.comparing).toEqual({
        ref: 'main',
        commit: 'abc123',
        at: { kind: 'timestamp', value: 1769513788 },
      })
      expect(entry.description).toBe('Did a thing.')
      expect(entry.sections.length).toBe(1)
      expect(entry.sections[0]!.kind).toBe('watched-changes')
      expect(entry.sections[0]!.body).toContain('+ added')
      expect(entry.sections[0]!.body).toContain('- removed')
    })

    it('parses a legacy (block number) entry as kind=block', () => {
      const md = [
        '# Diff at Wed, 10 Jan 2024 08:28:33 GMT:',
        '',
        '- author: Bob (<bob@example.com>)',
        '- comparing to: main@deadbeef block: 18000000',
        '- current block number: 18900000',
        '',
        '## Description',
        '',
        'Old-format change.',
        '',
      ].join('\n')

      const entries = parser.parse(md)
      expect(entries.length).toBe(1)
      const entry = entries[0]!
      expect(entry.current).toEqual({ kind: 'block', value: 18900000 })
      expect(entry.comparing).toEqual({
        ref: 'main',
        commit: 'deadbeef',
        at: { kind: 'block', value: 18000000 },
      })
    })

    it('recognizes the legacy "## Config related changes" heading', () => {
      const md = [
        '# Diff at Wed, 10 Jan 2024 08:28:33 GMT:',
        '',
        '- author: Bob',
        '- comparing to: main@deadbeef block: 18000000',
        '- current block number: 18900000',
        '',
        '## Description',
        '',
        'Old-format change.',
        '',
        '## Config related changes',
        '',
        '```diff',
        '+ legacy',
        '```',
        '',
      ].join('\n')

      const sections = parser.parse(md)[0]!.sections
      expect(sections.length).toBe(1)
      expect(sections[0]!.kind).toBe('config-related-changes')
      expect(sections[0]!.body).toContain('+ legacy')
    })

    it('recognizes the modern "## Config/verification related changes" heading', () => {
      const md = [
        '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
        '',
        '- current timestamp: 1777994288',
        '',
        '## Description',
        '',
        'x',
        '',
        '## Config/verification related changes',
        '',
        '```diff',
        '+ y',
        '```',
        '',
      ].join('\n')

      const sections = parser.parse(md)[0]!.sections
      expect(sections.length).toBe(1)
      expect(sections[0]!.kind).toBe('config-related-changes')
    })

    it('parses initial discovery entries (no comparing, no comparing-block)', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- author: Alice',
        '- current block number: 17000000',
        '',
        '## Description',
        '',
        'First discovery.',
        '',
        '## Initial discovery',
        '',
        '```diff',
        '+ everything',
        '```',
        '',
      ].join('\n')

      const entry = parser.parse(md)[0]!
      expect(entry.comparing).toBe(null)
      expect(entry.current).toEqual({ kind: 'block', value: 17000000 })
      expect(entry.sections.length).toBe(1)
      expect(entry.sections[0]!.kind).toBe('initial-discovery')
    })

    it('parses comparing line without a block field', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- author: Alice',
        '- comparing to: main@cafebabe',
        '- current block number: 17000000',
        '',
        '## Description',
        '',
        'No block in comparing.',
        '',
      ].join('\n')

      const entry = parser.parse(md)[0]!
      expect(entry.comparing).toEqual({
        ref: 'main',
        commit: 'cafebabe',
        at: null,
      })
    })

    it('parses source-code-changes section', () => {
      const md = [
        '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
        '',
        '- current timestamp: 1777994288',
        '',
        '## Description',
        '',
        'x',
        '',
        '## Source code changes',
        '',
        '```diff',
        '@@ -1 +1 @@',
        '-old',
        '+new',
        '```',
        '',
      ].join('\n')

      const sections = parser.parse(md)[0]!.sections
      expect(sections.length).toBe(1)
      expect(sections[0]!.kind).toBe('source-code-changes')
      expect(sections[0]!.body).toContain('@@ -1 +1 @@')
    })

    it('tolerates trailing whitespace in section headings', () => {
      const md = [
        '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
        '',
        '- current timestamp: 1777994288',
        '',
        '## Description',
        '',
        'x',
        '',
        '## Watched changes  ',
        '',
        '```diff',
        '+ y',
        '```',
        '',
      ].join('\n')

      const sections = parser.parse(md)[0]!.sections
      expect(sections.length).toBe(1)
      expect(sections[0]!.kind).toBe('watched-changes')
    })

    it('parses multiple entries newest-first with each entry getting its own hash', () => {
      const md = [
        'Generated with discovered.json: 0xnew',
        '',
        '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
        '',
        '- current timestamp: 1777994288',
        '',
        '## Description',
        '',
        'newest',
        '',
        'Generated with discovered.json: 0xold',
        '',
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- current block number: 17000000',
        '',
        '## Description',
        '',
        'oldest',
        '',
      ].join('\n')

      const entries = parser.parse(md)
      expect(entries.length).toBe(2)
      expect(entries[0]!.discoveryHash).toBe('0xnew')
      expect(entries[0]!.description).toBe('newest')
      expect(entries[1]!.discoveryHash).toBe('0xold')
      expect(entries[1]!.description).toBe('oldest')
    })

    it('leaves discoveryHash null when an entry has no preceding hash line', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- current block number: 17000000',
        '',
        '## Description',
        '',
        'oldest',
        '',
      ].join('\n')

      expect(parser.parse(md)[0]!.discoveryHash).toBe(null)
    })

    it('returns null current when neither timestamp nor block-number metadata is present', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- author: Alice',
        '',
        '## Description',
        '',
        'no metadata',
        '',
      ].join('\n')

      const entry = parser.parse(md)[0]!
      expect(entry.current).toBe(null)
    })

    it('captures author with email-style angle brackets verbatim', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- author: Alice (<alice@example.com>)',
        '- current timestamp: 1700000000',
        '',
        '## Description',
        '',
        'x',
        '',
      ].join('\n')

      expect(parser.parse(md)[0]!.author).toBe('Alice (<alice@example.com>)')
    })

    it('handles description-only entries (no diff sections)', () => {
      const md = [
        '# Diff at Mon, 01 Jan 2024 00:00:00 GMT:',
        '',
        '- current timestamp: 1700000000',
        '',
        '## Description',
        '',
        'just text, no diff sections.',
        '',
      ].join('\n')

      const entry = parser.parse(md)[0]!
      expect(entry.description).toBe('just text, no diff sections.')
      expect(entry.sections).toEqual([])
    })
  })
})
