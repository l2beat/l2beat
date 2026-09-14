import { existsSync, readFileSync } from 'fs'
import type { SsrData } from '~/pages/pageTypes'
import { CLIENT_BASE_PATH, CLIENT_OUTPUT_DIR } from '../paths'

const VITE_MANIFEST_PATH = `${CLIENT_OUTPUT_DIR}/.vite/manifest.json`

export interface ViteManifestChunk {
  file: string
  isEntry?: boolean
  imports?: string[]
  css?: string[]
}
export type ViteManifest = Record<string, ViteManifestChunk>

/** Head tags that let the browser fetch a page's chunks alongside the entry
 *  script instead of discovering them only after the entry has executed. */
export type PagePreloads = (page: SsrData['page']) => string

export function loadPagePreloads(isProduction: boolean): PagePreloads {
  if (!isProduction || !existsSync(VITE_MANIFEST_PATH)) {
    return () => ''
  }
  return createPagePreloads(
    JSON.parse(readFileSync(VITE_MANIFEST_PATH, 'utf-8')) as ViteManifest,
  )
}

export function createPagePreloads(manifest: ViteManifest): PagePreloads {
  const loadedByEntry = staticImportClosure(manifest, entryKeys(manifest))
  const tagsByPage = new Map<string, string>()

  return (page) => {
    const cached = tagsByPage.get(page)
    if (cached !== undefined) return cached
    const tags = pagePreloadTags(manifest, loadedByEntry, page)
    tagsByPage.set(page, tags)
    return tags
  }
}

function pagePreloadTags(
  manifest: ViteManifest,
  loadedByEntry: Set<string>,
  page: string,
): string {
  const pageKey = Object.keys(manifest).find(
    (key) => key.includes('/pages/') && key.endsWith(`/${page}.tsx`),
  )
  if (!pageKey) return ''

  const tags: string[] = []
  for (const key of staticImportClosure(manifest, [pageKey])) {
    if (loadedByEntry.has(key)) continue
    const chunk = manifest[key]
    if (!chunk) continue
    tags.push(
      `<link rel="modulepreload" crossorigin href="${CLIENT_BASE_PATH}${chunk.file}">`,
    )
    for (const css of chunk.css ?? []) {
      tags.push(
        `<link rel="stylesheet" crossorigin href="${CLIENT_BASE_PATH}${css}">`,
      )
    }
  }
  return tags.join('')
}

function entryKeys(manifest: ViteManifest): string[] {
  return Object.keys(manifest).filter((key) => manifest[key]?.isEntry)
}

// Dynamic imports are left out on purpose: they are what the entry and page
// load lazily, so preloading them would fetch code the page may never run.
function staticImportClosure(
  manifest: ViteManifest,
  roots: string[],
): Set<string> {
  const seen = new Set<string>()
  const stack = [...roots]
  while (stack.length > 0) {
    const key = stack.pop()
    if (key === undefined || seen.has(key)) continue
    seen.add(key)
    stack.push(...(manifest[key]?.imports ?? []))
  }
  return seen
}
