import path from 'node:path'
import { expect } from 'earl'
import {
  descriptionLayout,
  MARGIN,
} from '~/components/opengraph-image/heartbeat/Frame'
import {
  loadOpengraphKit,
  OG_SIZE,
} from '~/components/opengraph-image/heartbeat/render'
import { fitTitle, titleFit } from '~/components/opengraph-image/MainPage'
import { mainPages } from './generateMainPageOgImages'

// Descriptions are written by hand, so this lays each one out the way the
// image will and checks it stays a short block above the bottom margin.
describe('main page descriptions', () => {
  it('fit in three lines above the bottom margin', async () => {
    const { measure } = await loadOpengraphKit(
      path.join(__dirname, '../../../static'),
    )
    const tooLong = mainPages.flatMap((page) => {
      if (page.description === undefined) return []
      const fit = titleFit(measure, page)
      const title = fitTitle(measure, page.title, fit)
      const layout = descriptionLayout(measure, page.description, {
        baseline: fit.baseline(title.size, title.lines.length),
        size: title.size,
        lines: title.lines.length,
      })
      const lines = layout.lines.length
      const fits = lines <= 3 && layout.bottom <= OG_SIZE.height - MARGIN
      return fits ? [] : [`${page.path}: ${lines} lines`]
    })

    expect(tooLong).toEqual([])
  })
})
