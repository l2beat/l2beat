import { ChartElements } from '../elements'

export function stopEventsPropagation(elements: ChartElements) {
  elements.hover.contents?.addEventListener('touchmove', (e) => {
    e.stopPropagation()
  })
  elements.hover.contents?.addEventListener('mousemove', (e) => {
    e.stopPropagation()
  })
}
