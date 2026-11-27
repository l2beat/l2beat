import { expect } from 'earl'
import { getApiMigrationGuide } from './apiMigrationGuide'
import { renderApiMigrationGuideMarkdown } from './renderApiMigrationGuideMarkdown'

// Why: the markdown is what the scripts and agents calling the old API read,
// and it is built from the same facts as the page. A fact the page shows and
// the markdown drops would go unnoticed.
// Method: render the real guide and look for each kind of fact in the text.
describe(renderApiMigrationGuideMarkdown.name, () => {
  const guide = getApiMigrationGuide()
  const markdown = renderApiMigrationGuideMarkdown(guide)

  it('opens with the title and maps every old endpoint to its new one', () => {
    expect(markdown).toMatchRegex(/^# Upgrade to the ETHBEAT API\n/)
    for (const endpoint of guide.endpoints) {
      expect(markdown).toInclude(
        `| \`${endpoint.oldPath}\` | \`${endpoint.newPath}\` |`,
        `## ${endpoint.name}: \`${endpoint.oldPath}\``,
        endpoint.exampleUrl,
      )
    }
  })

  it('writes a renamed, a removed and an added field as table rows', () => {
    expect(markdown).toInclude(
      '| `providers` | `stacks` |  |',
      '| `usdValue` | Gone | It was',
      '| New | `tvs.timestamp` | The hour',
    )
  })

  it('keeps every note and difference', () => {
    const notes = [
      ...guide.benefits.notes,
      ...guide.general.notes,
      ...guide.endpoints.flatMap((endpoint) => endpoint.differences),
    ]
    for (const note of notes) {
      expect(markdown).toInclude(note.text)
    }
  })
})
