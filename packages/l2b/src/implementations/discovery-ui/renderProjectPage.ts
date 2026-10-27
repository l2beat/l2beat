import type { ConfigReader } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { projectParamsSchema } from './main'

const SITE_URL = 'https://disco.l2beat.com'
const SITE_TITLE = 'Disco'
const SITE_DESCRIPTION = 'A dashboard to explore all onchain connections'

export function renderProjectPage(
  configReader: ConfigReader,
  indexHtml: string,
  params: unknown,
): string {
  const validation = projectParamsSchema.safeParse(params)
  if (!validation.success) {
    return indexHtml
  }
  const { project } = validation.data
  if (!configReader.projectConfigExists(project)) {
    return indexHtml
  }
  return withProjectMeta(indexHtml, project)
}

export function withProjectMeta(indexHtml: string, project: string): string {
  assert(project.length > 0, 'Project cannot be empty')

  const title = escapeHtml(`${project} | ${SITE_TITLE}`)
  const description = escapeHtml(
    `Contracts and permissions of ${project}, discovered onchain`,
  )
  const url = escapeHtml(`${SITE_URL}/ui/p/${encodeURIComponent(project)}`)

  const replacements: [string, string][] = [
    [`<title>${SITE_TITLE}</title>`, `<title>${title}</title>`],
    metaPair('name', 'description', SITE_DESCRIPTION, description),
    metaPair('property', 'og:url', `${SITE_URL}/`, url),
    metaPair('property', 'og:title', SITE_TITLE, title),
    metaPair('property', 'og:description', SITE_DESCRIPTION, description),
    metaPair('name', 'twitter:url', `${SITE_URL}/`, url),
    metaPair('name', 'twitter:title', SITE_TITLE, title),
    metaPair('name', 'twitter:description', SITE_DESCRIPTION, description),
  ]

  let html = indexHtml
  for (const [target, replacement] of replacements) {
    html = replaceOnce(html, target, replacement)
  }
  return html
}

function metaPair(
  attribute: 'name' | 'property',
  key: string,
  source: string,
  target: string,
): [string, string] {
  return [
    `<meta ${attribute}="${key}" content="${source}" />`,
    `<meta ${attribute}="${key}" content="${target}" />`,
  ]
}

function replaceOnce(html: string, target: string, replacement: string) {
  const index = html.indexOf(target)
  assert(index !== -1, 'Meta tag missing from index.html')
  assert(index === html.lastIndexOf(target), 'Meta tag repeated in index.html')
  return html.slice(0, index) + replacement + html.slice(index + target.length)
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
