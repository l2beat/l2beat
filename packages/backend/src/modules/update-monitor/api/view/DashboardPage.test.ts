import { expect } from 'earl'
import { renderDashboardPage } from './DashboardPage'

describe(renderDashboardPage.name, () => {
  it('renders the running revision and start time', () => {
    const commitSha = '1234567890abcdef'
    const startedAt = '2026-07-29T10:30:00.000Z'

    const html = renderDashboardPage([], [], new Set(), {
      commitSha,
      startedAt,
    })

    expect(
      html.includes(`Running since <time dateTime="${startedAt}">`),
    ).toEqual(true)
    expect(html.includes(commitSha)).toEqual(true)
    expect(
      html.includes(`https://github.com/l2beat/l2beat/commit/${commitSha}`),
    ).toEqual(true)
  })
})
