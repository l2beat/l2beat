import { Milestone } from '@l2beat/config'

import { isMobile } from '../../utils/isMobile'

export function renderMilestones(
  width: number,
  points: { milestone?: Milestone }[],
) {
  return points
    .map((point, i) =>
      point.milestone
        ? getMilestoneHtml(
            (width / (points.length - 1)) * i,
            point.milestone.link,
          )
        : '',
    )
    .join('')
}

const SIZE = 20

function getMilestoneHtml(x: number, url: string) {
  return `
  <div class="absolute z-40 select-none scale-75  md:scale-100" 
        style="left: ${x - SIZE / 2}px; top: ${-SIZE / 2}px">
    ${isMobile() ? '' : `<a href="${url}" target="_blank">`}
      <svg
        width="${SIZE}"
        height="${SIZE}"
        view-box="0 0 ${SIZE} ${SIZE}"
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
    ${isMobile() ? '' : '</a>'}
  </div>`
}
