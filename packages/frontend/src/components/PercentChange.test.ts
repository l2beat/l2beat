import { expect } from 'earl'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PercentChange } from './PercentChange'

describe(PercentChange.name, () => {
  const cases = [
    { value: 0.122, text: '+12.2%', colour: 'text-positive' },
    { value: -0.031, text: '−3.10%', colour: 'text-negative' },
    { value: 0.00004, text: '0.00%', colour: 'text-secondary' },
    // a capped magnitude is already a comparison: no "+" before ">"
    { value: 12, text: '&gt;1K%', colour: 'text-positive' },
  ]

  for (const { value, text, colour } of cases) {
    it(`prints ${value} as ${text} in ${colour}`, () => {
      const html = renderToStaticMarkup(createElement(PercentChange, { value }))

      expect(html).toInclude(`>${text}<`)
      expect(html).toInclude(colour)
    })
  }
})
