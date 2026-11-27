import { PUBLIC_API_URL } from '~/consts/publicApi'
import type {
  ApiMigrationGuide,
  EndpointGuide,
  FieldChange,
  GuideNote,
} from './apiMigrationGuide'
import { GONE, NEW_FIELD } from './fieldLabels'

/** The guide as one markdown document, for `/api-migration.md`. */
export function renderApiMigrationGuideMarkdown(
  guide: ApiMigrationGuide,
): string {
  return [
    `# ${guide.title}`,
    guide.lede,
    guide.facts
      .map((fact) => `- ${fact.label}: ${fact.value}. ${fact.detail}.`)
      .join('\n'),
    guide.links.map((link) => `- [${link.label}](${link.url})`).join('\n'),
    ...guide.intro,
    '## Old and new endpoints',
    table(
      ['Old endpoint', 'New endpoint'],
      guide.endpoints.map((endpoint) => [
        `\`${endpoint.oldPath}\``,
        `\`${endpoint.newPath}\``,
      ]),
    ),
    `## ${guide.ids.title}`,
    ...guide.ids.text,
    table(
      ['Project', 'Slug', 'Id'],
      guide.ids.examples.map((example) => [
        example.project,
        `\`${example.slug}\``,
        `\`${example.id}\``,
      ]),
    ),
    `## ${guide.general.title}`,
    notes(guide.general.notes),
    ...guide.endpoints.flatMap(renderEndpoint),
  ].join('\n\n')
}

function renderEndpoint(endpoint: EndpointGuide): string[] {
  return [
    `## ${endpoint.name}: \`${endpoint.oldPath}\``,
    `Use \`${PUBLIC_API_URL}${endpoint.newPath}\`, e.g. [${endpoint.exampleUrl}](${endpoint.exampleUrl}).`,
    ...endpoint.text,
    ...(endpoint.fields
      ? [
          `### ${endpoint.fields.title}`,
          table(['Old', 'New', 'Notes'], endpoint.fields.changes.map(fieldRow)),
        ]
      : []),
    ...(endpoint.differences.length > 0
      ? ['### Differences in the numbers', notes(endpoint.differences)]
      : []),
  ]
}

function fieldRow(change: FieldChange): string[] {
  return [change.before ?? NEW_FIELD, change.after ?? GONE, change.note ?? '']
}

function notes(items: GuideNote[]): string {
  return items
    .map((note) =>
      note.title ? `- **${note.title}.** ${note.text}` : `- ${note.text}`,
    )
    .join('\n')
}

function table(header: string[], rows: string[][]): string {
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`
  return [line(header), line(header.map(() => '---')), ...rows.map(line)].join(
    '\n',
  )
}
