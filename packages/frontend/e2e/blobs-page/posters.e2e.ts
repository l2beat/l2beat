import type { Page } from 'playwright/test'
import { type BlobsPage, expect, test } from './blobsPage'

/**
 * Who posted over the last 24 hours, as the table under the belt has it. It
 * is read cell by cell: the ranking and the shares must add up, and its
 * columns must line up wherever the header is shown from, as it is copied to
 * stick over the table while the page scrolls.
 */
test.describe.configure({ mode: 'parallel' })

test('ranks the posters by blobs, with shares that add up', async ({
  blobs,
}) => {
  await blobs.openLive()
  await blobs.posters.scrollIntoViewIfNeeded()
  const rows = await readRows(blobs)
  expect(rows.length).toBeGreaterThan(4)
  expect(rows.map((row) => row.rank)).toEqual(rows.map((_, i) => i + 1))
  const blobCounts = rows.map((row) => row.blobs)
  expect(blobCounts).toEqual([...blobCounts].sort((a, b) => b - a))
  // each share is rounded, so they sum to about a whole
  const shares = rows.reduce((sum, row) => sum + row.share, 0)
  expect(shares).toBeGreaterThan(98.5)
  expect(shares).toBeLessThan(101.5)

  for (const row of rows) {
    if (row.name === 'Unknown') {
      expect(row.links, 'Unknown has no page').toEqual([])
      continue
    }
    // to the project, and from its activity to its Data posted chart
    for (const href of row.links) expect(href, row.name).toMatch(/^\//)
    if (row.links.length > 0) {
      expect(row.links.at(-1), row.name).toBe(`${row.links[0]}#data-posted`)
    }
  }
})

test('lines up its names and its rows, with the header over its columns', async ({
  blobs,
  page,
}) => {
  await blobs.openLive()
  await blobs.posters.scrollIntoViewIfNeeded()

  const lines = await blobs.posterRows.evaluateAll((rows) =>
    rows.map((row) => {
      const cells = (row as HTMLTableRowElement).cells
      // where the text starts, whatever box or padding holds it
      const name = document.createRange()
      name.selectNodeContents(cells[2]!.querySelector('.truncate')!)
      return {
        name: name.toString(),
        nameLeft: Math.round(name.getBoundingClientRect().left),
        height: Math.round(row.getBoundingClientRect().height),
      }
    }),
  )
  const first = lines[0]!
  for (const line of lines) {
    expect(line.nameLeft, `${line.name}, where its name starts`).toBe(
      first.nameLeft,
    )
    expect(line.height, `${line.name}, on one line`).toBe(first.height)
  }

  expect(await headerOffsets(page), 'header over its columns').toEqual([])
  // and once it sticks to the top of the screen, as the table scrolls under it
  await page.evaluate(() => {
    const table = document.querySelector('#live-posters tbody')!
    scrollTo(0, table.getBoundingClientRect().top + scrollY + 200)
  })
  await expect
    .poll(() => stuckHeaderTop(page), { message: 'header stuck at the top' })
    .toBeLessThan(1)
  expect(await headerOffsets(page), 'stuck header over its columns').toEqual([])
})

test('slides sideways under its rank and logo where it does not fit', async ({
  blobs,
  page,
}) => {
  await blobs.openLive()
  await blobs.posters.scrollIntoViewIfNeeded()
  const scroller = blobs.posters.locator('.sticky-table-scroller')
  const fits = await scroller.evaluate((e) => e.scrollWidth <= e.clientWidth)
  test.skip(fits, 'The table fits this screen')
  expect(await documentScrollsSideways(page), 'the page itself').toBe(false)

  const before = await firstRowLefts(blobs)
  await scroller.evaluate((e) => {
    e.scrollLeft = 200
  })
  await expect.poll(() => firstRowLefts(blobs)).not.toEqual(before)
  const after = await firstRowLefts(blobs)
  // pinned cells stop a pixel left of where they start, to cover the seam
  expect(Math.abs(after.rank - before.rank), 'rank').toBeLessThanOrEqual(1)
  expect(Math.abs(after.logo - before.logo), 'logo').toBeLessThanOrEqual(1)
  expect(before.name - after.name, 'name').toBeCloseTo(200, 0)
  expect(await headerOffsets(page), 'header over its columns').toEqual([])
})

interface Row {
  rank: number
  name: string
  blobs: number
  share: number
  links: string[]
}

/** The table's rows, each cell read under the header it stands in */
function readRows(blobs: BlobsPage): Promise<Row[]> {
  return blobs.posters.evaluate((section) => {
    // the table's own header; its sticky copies are only drawn
    const header = section.querySelector(
      '.sticky-table-scroller thead tr',
    ) as HTMLTableRowElement
    const columns = [...header.cells].map((cell) => cell.textContent?.trim())
    const column = (name: string) => {
      const index = columns.indexOf(name)
      if (index < 0) throw new Error(`No "${name}" column in ${columns}`)
      return index
    }
    const [rank, name, blobs, share] = ['#', 'Name', 'Blobs', 'Share'].map(
      column,
    )
    return [...section.querySelectorAll('tbody tr')].map((row) => {
      const cells = [...(row as HTMLTableRowElement).cells]
      const number = (i: number) =>
        Number(cells[i]!.innerText.replace(/[^\d.]/g, ''))
      return {
        rank: number(rank!),
        name: cells[name!]!.innerText.trim(),
        blobs: number(blobs!),
        share: number(share!),
        links: cells
          .flatMap((cell) => [...cell.querySelectorAll('a')])
          .map((a) => a.getAttribute('href') ?? ''),
      }
    })
  })
}

/**
 * Columns whose shown header cell does not start and end where their cells
 * do. Once ready, the header shown is a copy that sticks: pinned columns are
 * drawn by a layer that holds still, the rest by a track sliding with the
 * table. Until then, and where it cannot stick, it is the table's own
 */
function headerOffsets(page: Page) {
  return page.evaluate(() => {
    const section = document.querySelector('#live-posters')!
    const sticky = section.querySelector<HTMLElement>('.sticky-table-header')
    const copied = sticky && getComputedStyle(sticky).display !== 'none'
    const headerCells = (selector: string) => [
      ...(section.querySelector(selector) as HTMLTableRowElement).cells,
    ]
    const own = headerCells('.sticky-table-scroller thead tr')
    const track = copied
      ? headerCells('.sticky-table-header-track thead tr')
      : own
    const pinned = copied
      ? headerCells('.sticky-table-header-pinned-layer thead tr')
      : own
    const bodyRow = section.querySelector('tbody tr') as HTMLTableRowElement
    const offsets: string[] = []
    for (const [i, cell] of [...bodyRow.cells].entries()) {
      const shown = cell.hasAttribute('data-pinned') ? pinned : track
      const head = shown[i]!.getBoundingClientRect()
      const body = cell.getBoundingClientRect()
      if (
        Math.abs(head.left - body.left) > 1 ||
        Math.abs(head.right - body.right) > 1
      ) {
        offsets.push(own[i]!.textContent?.trim() || `column ${i + 1}`)
      }
    }
    return offsets
  })
}

function stuckHeaderTop(page: Page) {
  return page.evaluate(() => {
    const section = document.querySelector('#live-posters')!
    const header =
      section.querySelector('.sticky-table-header') ??
      section.querySelector('thead')!
    return Math.abs(header.getBoundingClientRect().top)
  })
}

function documentScrollsSideways(page: Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
}

function firstRowLefts(blobs: BlobsPage) {
  return blobs.posterRows.first().evaluate((row) => {
    const left = (i: number) =>
      Math.round(
        (row as HTMLTableRowElement).cells[i]!.getBoundingClientRect().left,
      )
    return { rank: left(0), logo: left(1), name: left(2) }
  })
}
