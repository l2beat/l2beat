/**
 * Regenerates `src/crops/osiLicenses.ts` from https://opensource.org/licenses,
 * pulled rather than curated so a forgotten license cannot cost a project its
 * Open source crop.
 *
 * Run with: pnpm --filter @l2beat/config crops:generate-licenses
 */

import { writeFileSync } from 'fs'
import path from 'path'

const OSI_API = 'https://opensource.org/wp-json/wp/v2/license'
const OSI_CATEGORY_API =
  'https://opensource.org/wp-json/wp/v2/taxonomy-license-category'
const PER_PAGE = 100

const OUTPUT = path.join(__dirname, '../../src/crops/osiLicenses.ts')

interface OsiPost {
  slug: string
  link: string
  title: { rendered: string }
  'taxonomy-license-category'?: number[]
  acf: {
    spdx_identifier?: {
      value_formatted?: { display_text?: { value?: string } }
    }
  }
}

interface OsiCategory {
  id: number
  slug: string
}

interface License {
  spdxId: string
  name: string
  url: string
  categories: string[]
}

main().catch((e: unknown) => {
  console.error(e)
  process.exitCode = 1
})

async function main() {
  const [posts, categories] = await Promise.all([
    fetchAll<OsiPost>(OSI_API),
    fetchAll<OsiCategory>(OSI_CATEGORY_API),
  ])
  console.log(`Fetched ${posts.length} licenses from the OSI.`)

  const licenses = toLicenses(posts, categories)
  console.log(`${licenses.length} of them carry an SPDX id.`)

  writeFileSync(OUTPUT, render(licenses))
  console.log(`Wrote ${OUTPUT}`)
}

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const url = `${endpoint}?per_page=${PER_PAGE}&page=${page}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`${url} responded ${response.status}`)
    }
    items.push(...((await response.json()) as T[]))
    const totalPages = Number(response.headers.get('x-wp-totalpages') ?? '1')
    if (page >= totalPages) {
      return items
    }
  }
}

function toLicenses(posts: OsiPost[], categories: OsiCategory[]): License[] {
  const categoryBySlug = new Map(categories.map((c) => [c.id, c.slug]))
  const licenses: License[] = []

  for (const post of posts) {
    const spdxId =
      post.acf.spdx_identifier?.value_formatted?.display_text?.value
    if (!spdxId) {
      console.warn(`Skipping ${post.slug}: the OSI lists no SPDX identifier`)
      continue
    }
    licenses.push({
      spdxId,
      name: decodeEntities(post.title.rendered),
      url: post.link,
      categories: (post['taxonomy-license-category'] ?? []).flatMap(
        (id) => categoryBySlug.get(id) ?? [],
      ),
    })
  }

  return licenses.sort((a, b) => a.spdxId.localeCompare(b.spdxId))
}

/** WordPress renders titles as HTML, so `&amp;` and friends come through. */
function decodeEntities(html: string): string {
  return html
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

function render(licenses: License[]): string {
  const entries = licenses
    .map(
      (license) => `  ${key(license.spdxId)}: {
    spdxId: ${quote(license.spdxId)},
    name: ${quote(license.name)},
    url: ${quote(license.url)},
    categories: [${license.categories.map(quote).join(', ')}],
  },`,
    )
    .join('\n')

  return `// GENERATED FILE - DO NOT EDIT BY HAND.
// Regenerate with: pnpm --filter @l2beat/config crops:generate-licenses
// Source: ${OSI_API} - the list behind https://opensource.org/licenses

// Deep-imported by the frontend and the l2b CLI; keep it dependency-free.

export interface OsiLicense {
  spdxId: string
  name: string
  url: string
  /** The OSI's own filing, e.g. 'popular-strong-community' or 'superseded'. Context only. */
  categories: readonly string[]
}

/**
 * Every OSI-approved license, keyed by SPDX id. This is the whole definition
 * of "open source" a CROPS review uses: a project's \`license\` must name a key here.
 */
export const OSI_LICENSES = {
${entries}
} as const satisfies Record<string, OsiLicense>

export type OsiLicenseId = keyof typeof OSI_LICENSES

/** Throws rather than render a green Open source crop nothing backs. */
export function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      \`\${id} is not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.\`,
    )
  }
  return license
}
`
}

/** Most SPDX ids are not valid identifiers, so they need quoting as keys. */
function key(spdxId: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(spdxId) ? spdxId : quote(spdxId)
}

function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}
