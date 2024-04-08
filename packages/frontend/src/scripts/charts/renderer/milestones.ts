import { isMobile } from '../../utils/isMobile'

const MILESTONE_SIZE = 20

export function renderMilestone(x: number, url: string) {
  const left = x - MILESTONE_SIZE / 2
  const top = -MILESTONE_SIZE / 2
  return `
  <div class="absolute select-none scale-75 md:scale-100" style="left: ${left}px; top: ${top}px">
    ${isMobile() ? '' : `<a href="${url}" target="_blank">`}
      <svg
        width="${MILESTONE_SIZE}"
        height="${MILESTONE_SIZE}"
        view-box="0 0 ${MILESTONE_SIZE} ${MILESTONE_SIZE}"
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
