import { expect } from 'earl'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MilestonesAndIncidentsSection } from './MilestonesAndIncidentsSection'

// Why: milestone dates are UTC midnights. The page is server-rendered in UTC
// and hydrated in the visitor's zone, so a local-time date shows the day
// before west of UTC and changes text during hydration.
// How: render the section with the process in a zone west of UTC.
describe(MilestonesAndIncidentsSection.name, () => {
  const originalTz = process.env.TZ

  afterEach(() => {
    if (originalTz === undefined) {
      Reflect.deleteProperty(process.env, 'TZ')
    } else {
      process.env.TZ = originalTz
    }
  })

  it('shows the UTC date in a time zone west of UTC', () => {
    process.env.TZ = 'America/New_York'

    const html = renderToString(
      createElement(MilestonesAndIncidentsSection, {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        sectionOrder: undefined,
        milestones: [
          {
            type: 'general',
            title: 'Mainnet launch',
            url: 'https://example.com',
            date: '2024-08-01T00:00:00Z',
          },
        ],
      }),
    )

    expect(html).toInclude('1 Aug 2024')
  })
})
