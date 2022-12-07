import { ChartElements } from './elements'
import { Message } from './messages'

export interface ChartElementsWithDynamic extends ChartElements {
  milestoneIcons: HTMLElement[]
}

export function getDynamicChartElements(
  elements: ChartElementsWithDynamic,
  dispatch?: (message: Message) => void,
): ChartElementsWithDynamic {
  const milestoneIcons = elements.view.milestones
    ? Array.from(
        elements.view.milestones.querySelectorAll<HTMLElement>(
          '[data-role="chart-milestone-icon"]',
        ),
      )
    : []

  if (dispatch) {
    console.log(elements.milestoneIcons)
    console.log(milestoneIcons)
    if (elements.milestoneIcons.length !== milestoneIcons.length) {
      console.log('unequal')
      milestoneIcons.map((element, i) => {
        console.log('added listener to event #', i)
        element.addEventListener('click', (e) => {
          console.log('clicked milestone', e)
          dispatch({
            type: 'MilestoneClicked',
          })
        })
      })
    }
  }

  return {
    ...elements,
    milestoneIcons,
  }
}
