import { MilestoneType } from '@l2beat/config'
import { isMobile } from '../../utils/isMobile'

const MILESTONE_SIZE = 20

export function renderMilestone(x: number, url: string, type: MilestoneType) {
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
        class="${
          type === 'incident'
            ? 'stroke-[#DF0004] fill-[#8C0002]'
            : 'fill-green-700 stroke-green-500'
        }"
      >
        ${
          type === 'incident'
            ? `
        <path 
          d="M2.11842 14.4966L9.13637 2.46527C9.52224 1.80374 10.4781 1.80375 10.864 2.46528L17.882 14.497C18.2708 15.1637 17.7899 16.0008 17.0182 16.0008L10.0003 16.0008L10.0002 16.0008L2.98214 16.0004C2.21039 16.0004 1.72956 15.1632 2.11842 14.4966Z"
          stroke-width="2"
        />`
            : `
        <rect
          x="9.89941"
          y="1.41421"
          width="12"
          height="12"
          rx="1"
          transform="rotate(45 9.89941 1.41421)"
          stroke-width="2"
        />
        `
        }
        ${isMobile() ? '' : '</a>'}
  </div>`
}
