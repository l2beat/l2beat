import { expect } from 'earl'
import { renderDashboardPage } from './DashboardPage'

describe(renderDashboardPage.name, () => {
  it('renders the deployed revision and time', () => {
    const commitSha = '1234567890abcdef'
    const deployedAt = '2026-07-29T10:30:00.000Z'

    const html = renderDashboardPage([], [], new Set(), {
      commitSha,
      deployedAt,
    })

    expect(html.includes(`Deployed <time dateTime="${deployedAt}">`)).toEqual(
      true,
    )
    expect(html.includes(commitSha)).toEqual(true)
    expect(
      html.includes(`https://github.com/l2beat/l2beat/commit/${commitSha}`),
    ).toEqual(true)
  })
})
