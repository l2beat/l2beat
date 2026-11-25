import { expect } from 'earl'
import { renderOnServer } from '~/test/tooltipMarkup'
import type { RosetteValue } from '../types'
import { BigPizzaRosette } from './BigPizzaRosette'

function createValues(withHref: boolean): RosetteValue[] {
  return [
    'Public observer',
    'Chain analyst',
    'Network observer',
    'Privileged insider',
    'Future adversary',
  ].map((name, i) => ({
    name,
    value: 'Private',
    sentiment: 'good',
    ...(withHref ? { href: `#slice-${i}` } : {}),
  }))
}

describe(BigPizzaRosette.name, () => {
  it('renders slice links without wrapping them in a button trigger', () => {
    const html = renderOnServer(<BigPizzaRosette values={createValues(true)} />)

    expect(html).not.toInclude('<button')
    expect(html).toInclude('href="#slice-0"')
    expect(html).toInclude('href="#slice-4"')
  })

  it('keeps a button trigger when slices do not link', () => {
    const html = renderOnServer(
      <BigPizzaRosette values={createValues(false)} />,
    )

    expect(html).toInclude('<button')
    expect(html).not.toInclude('<a ')
  })

  it('disables slice links when under review', () => {
    const html = renderOnServer(
      <BigPizzaRosette values={createValues(true)} isUnderReview />,
    )

    expect(html).not.toInclude('<button')
    expect(html).not.toInclude('<a ')
  })
})
