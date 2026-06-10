import { checkDehydrated, type DehydratedResult } from './checkDehydrated'
import {
  checkNoRefetch,
  type NoRefetchResult,
  type PageWithPrefetch,
} from './checkNoRefetch'
import { resolvePages } from './pages'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'

async function main() {
  const pages = await resolvePages()
  console.log(`Verifying prefetches on ${pages.length} pages at ${BASE_URL}\n`)

  // Layer 1: discover every prefetched query from the dehydrated state and
  // verify it succeeded.
  console.log('── Layer 1: dehydrated state (server) ──')
  const dehydrated: DehydratedResult[] = []
  for (const page of pages) {
    const result = await checkDehydrated(BASE_URL, page)
    dehydrated.push(result)
    printDehydrated(result)
  }

  // Layer 2: client serves the discovered queries from the hydrated cache. We
  // feed it the exact inputs the server prefetched with so it can tell a true
  // refetch (hydration broke) from an unrelated same-procedure query.
  const items: PageWithPrefetch[] = dehydrated.map((result) => ({
    url: result.url,
    prefetched: result.queries
      .filter((q) => q.ok)
      .map((q) => ({ path: q.path, input: q.input })),
  }))

  console.log('\n── Layer 2: no client refetch (browser) ──')
  const noRefetch = await checkNoRefetch(BASE_URL, items)
  for (const result of noRefetch) printNoRefetch(result)

  const failed = [
    ...dehydrated.filter((r) => !r.ok).map((r) => `L1 ${r.url}`),
    ...noRefetch.filter((r) => !r.ok).map((r) => `L2 ${r.url}`),
  ]
  const warnings = noRefetch.filter((r) => r.ok && r.mismatched.length > 0)

  console.log('')
  if (warnings.length > 0) {
    console.log(
      `⚠ ${warnings.length} page(s) fetch a prefetched procedure with a different input than prefetched (possible wasted prefetch — review above).`,
    )
  }
  if (failed.length > 0) {
    console.error(`✗ ${failed.length} check(s) failed:`)
    for (const f of failed) console.error(`   - ${f}`)
    process.exit(1)
  }
  console.log('✓ All prefetches verified (no hydration regressions)')
}

function printDehydrated(result: DehydratedResult) {
  const mark = result.ok ? '✓' : '✗'
  console.log(`${mark} ${result.url}`)
  if (result.error) {
    console.log(`    error: ${result.error}`)
  }
  for (const query of result.queries) {
    const qmark = query.ok ? '✓' : '✗'
    console.log(`    ${qmark} ${query.path} — ${query.detail}`)
  }
  for (const path of result.missingExpected) {
    console.log(`    ✗ ${path} — expected but not dehydrated`)
  }
}

function printNoRefetch(result: NoRefetchResult) {
  const mark = result.ok ? (result.mismatched.length > 0 ? '⚠' : '✓') : '✗'
  console.log(`${mark} ${result.url}`)
  if (result.error) {
    console.log(`    error: ${result.error}`)
    return
  }
  for (const proc of result.refetched) {
    console.log(
      `    ✗ ${proc.path} — exact prefetched key refetched on load (hydration not used)`,
    )
  }
  for (const proc of result.mismatched) {
    console.log(
      `    ⚠ ${proc.path} — fetched with a different input than prefetched:`,
    )
    console.log(`        prefetched: ${JSON.stringify(proc.prefetchedInput)}`)
    for (const input of proc.observedInputs) {
      console.log(`        client:     ${JSON.stringify(input)}`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
