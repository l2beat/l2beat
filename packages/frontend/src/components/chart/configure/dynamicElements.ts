import { ChartElements } from './elements'
import { Message } from './messages'

export interface ChartElementsWithDynamic extends ChartElements {
  milestoneIcons: HTMLElement[]
}

export function attachDynamicElements(
  elements: ChartElementsWithDynamic,
  dispatch: (message: Message) => void,
): ChartElementsWithDynamic {
  const milestoneIcons = elements.view.milestones
    ? Array.from(
        elements.view.milestones.querySelectorAll<HTMLElement>(
          '[data-role="chart-milestone-icon"]',
        ),
      )
    : []

  if (elements.milestoneIcons.length !== milestoneIcons.length) {
    milestoneIcons.map((icon) => {
      icon.addEventListener('click', (e) => {
        console.log('icon clicked', icon, e)
        dispatch({
          type: 'MilestoneClicked',
          index: Number(icon.dataset.index)
        })
      })
    })
  }

  return {
    ...elements,
    milestoneIcons,
  }
}
