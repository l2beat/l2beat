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
    const x = point.x * width - 8
    innerHtml += `<div class="absolute top-[-8px] z-50" style="left: ${x}px">${a}</div>`
  }
  milestones.innerHTML = innerHtml
}

const a = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
role="img"
>      <rect
fill="#34762F"
stroke="#5BFF4D"
x="9.89941"
y="1.41421"
width="12"
height="12"
rx="1"
transform="rotate(45 9.89941 1.41421)"
strokeWidth="2"
/> <svg>`