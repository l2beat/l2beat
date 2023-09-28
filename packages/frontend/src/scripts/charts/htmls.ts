import { Milestone } from '@l2beat/config'

import { formatTps } from '../../utils/formatTps'
import { isMobile } from '../utils/isMobile'
import { POINT_CLASS_NAMES, SeriesStyle } from './styles'

const MILESTONE_SIZE = 20

export function getMilestoneHtml(x: number, url: string) {
  return `
  <div class="absolute z-40 select-none scale-75  md:scale-100" 
        style="left: ${x - MILESTONE_SIZE / 2}px; top: ${
    -MILESTONE_SIZE / 2
  }px">
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

export function getMilestoneHover(milestone: Milestone) {
  return `
    <div class="mb-1">${milestone.date}</div>
    <div class="max-w-[216px] mb-2 font-bold flex flex-wrap">
      <div class="absolute mt-[2px] md:mt-[5px] ${
        POINT_CLASS_NAMES.milestone
      }"></div>
      <span class="ml-4 text-left">${milestone.name}</span>
    </div>
    ${
      milestone.description
        ? `<div class="max-w-[216px] mb-1 text-left">
            ${milestone.description}
          </div>`
        : ''
    }
  `
}

export interface TvlData {
  date: string
  usd: number
  eth: number
}

export function getTvlHover(data: TvlData) {
  return `
    <div class="mb-1">${data.date}</div>
    <div>
      <span class="font-bold">${data.eth}</span>
      <span>ETH</span>
    </div>
    <div>
      <span class="font-bold">${data.usd}</span>
      <span>USD</span>
    </div>
  `
}

export function getActivityHover(
  data: {
    date: string
    tps: number
    ethTps: number
  },
  pointClassnames: {
    eth: NonNullable<SeriesStyle['point']>
    projects: NonNullable<SeriesStyle['point']>
  },
) {
  const tpsRow = `
    <div>
      <div class="inline-block mr-1 relative -top-px ${
        POINT_CLASS_NAMES[pointClassnames.projects]
      }"></div> 
      <span class="font-bold">Projects</span> avg. TPS: <span class="font-bold">${formatTps(
        data.tps,
      )}</span>
    </div>
  `
  const ethTpsRow = `
    <div>
      <div class="inline-block mr-1 relative -top-px ${
        POINT_CLASS_NAMES[pointClassnames.eth]
      }"></div>
      <span class="font-bold">Ethereum</span> avg. TPS: <span class="font-bold">${formatTps(
        data.ethTps,
      )}</span>
    </div>`

  return `
    <div class="mb-1">${data.date}</div>
      ${data.tps > data.ethTps ? tpsRow + ethTpsRow : ethTpsRow + tpsRow}
    </div>`
}
