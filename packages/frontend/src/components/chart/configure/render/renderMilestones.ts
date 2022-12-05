import { State } from '../state/State'

export function renderMilestones(state: State, milestones: HTMLElement) {
  const points = state.view.chart?.points
  if (!points) {
    return
  }
  let innerHtml = ''
  const width = milestones.getBoundingClientRect().width
  for (const point of points) {
    if (!point.milestone) {
      continue
    }
    const x = point.x * width - iconHeight / 2
    innerHtml += `<div class="absolute top-[-10px] z-50" style="left: ${x}px">${milestoneIcon}</div>`
  }
  milestones.innerHTML = innerHtml
}

const iconHeight = 20
const milestoneIcon = `
<svg
width="${iconHeight}"
height="${iconHeight}"
view-box="0 0 ${iconHeight} ${iconHeight}"
role="img"
aria-label="Milestone icon"
>      
  <rect
  fill="#34762F"
  stroke="#5BFF4D"
  x="9.89941"
  y="1.41421"
  width="12"
  height="12"
  rx="1"
  transform="rotate(45 9.89941 1.41421)"
  stroke-width="2"
  /> 
<svg>`
