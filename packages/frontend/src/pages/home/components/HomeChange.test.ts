import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { HomeChange } from './HomeChange'

// A change people read as a gain or a loss must be one: what is printed sets
// the sign and the colour, so a change too small to show reads as no change.
describe(HomeChange.name, () => {
  const cases = [
    { value: -0.00004, text: '0.00%', colour: 'text-secondary' },
    { value: 0.00004, text: '0.00%', colour: 'text-secondary' },
    { value: 0, text: '0.00%', colour: 'text-secondary' },
    { value: -0.0003, text: '−0.03%', colour: 'text-negative' },
    { value: 0.122, text: '+12.2%', colour: 'text-positive' },
  ]

  for (const { value, text, colour } of cases) {
    it(`prints ${value} as ${text} in ${colour}`, () => {
      const html = renderToStaticMarkup(createElement(HomeChange, { value }))

      expect(html).toInclude(`>${text}<`)
      expect(html).toInclude(colour)
      for (const other of [
        'text-positive',
        'text-negative',
        'text-secondary',
      ]) {
        if (other !== colour) expect(html).not.toInclude(other)
      }
    })
  }
})
