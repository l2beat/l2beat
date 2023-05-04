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
    const x = point.x * width
    innerHtml += getMilestoneHtml(x, point.milestone.link)
  }
  milestones.innerHTML = innerHtml
}

function getMilestoneHtml(x: number, url: string) {
  const isMobile = window.innerWidth < 750
  return `
  <div class="absolute z-40 select-none scale-75  md:scale-100" 
        style="left: ${x + offset}px; top: ${offset}px">
    ${isMobile ? '' : `<a href="${url}" target="_blank">`}
      <svg
        width="${iconHeight}"
        height="${iconHeight}"
        view-box="0 0 ${iconHeight} ${iconHeight}"
        role="img"
        aria-label="Milestone icon"
        class="fill-green-200 stroke-green-400 dark:fill-green-800 dark:stroke-green-500"
      >      
        <rect
          x="9.89941"
          y="1.41421"
          width="12"
          height="12"
          rx="1"
          transform="rotate(45 9.89941 1.41421)"
          stroke-width="2"
        /> 
      <svg>
    ${isMobile ? '' : '</a>'}
  </div>`
}

const iconHeight = 20
const offset = -(iconHeight / 2)
