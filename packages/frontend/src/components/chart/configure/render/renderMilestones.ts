import { State } from '../state/State'

export function renderMilestones(state: State, milestones: HTMLElement) {
  const points = state.view.chart?.points
  if (!points) {
    return
  }
  console.log(state.data.milestones)
  let innerHtml = ''
  const width = milestones.getBoundingClientRect().width
  for (const point of points) {
    if (!point.milestone) {
      continue
    }
    console.log('found', point.milestone)
    const x = point.x * width
    innerHtml += `<div class="bg-purple-300 absolute top-0 w-4 h-4" style="left: ${x}px"></div>`
  }
  console.log('innerHtml=',innerHtml)
  milestones.innerHTML = innerHtml
}
