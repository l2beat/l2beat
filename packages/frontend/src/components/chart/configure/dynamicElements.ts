import { ChartElements } from './elements'

export interface ChartElementsWithDynamic extends ChartElements {
  milestoneIcons: HTMLElement[]
}

export function getDynamicChartElements(
  elements: ChartElements,
): ChartElementsWithDynamic {
  const milestoneIcons = elements.view.milestones
    ? Array.from(
        elements.view.milestones.querySelectorAll<HTMLInputElement>(
          '[data-role="chart-milestone-icon"]',
        ),
      )
    : []
  return {
    ...elements,
    milestoneIcons,
  }
}
