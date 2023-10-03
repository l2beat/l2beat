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
    ${
      isMobile()
        ? `
        <a href="${milestone.link}" class="group" target="_blank" rel="noreferrer noopener">
          <span class="inline-flex items-center font-semibold transition-colors text-blue-700 group-hover:text-blue-550 dark:text-blue-500">
            <span class="flex items-center gap-1 underline transition-transform group-hover:-translate-x-px">
              Learn more
            </span>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="var(--text)" role="img" aria-label="Arrow pointing to the right icon" class="ml-1 inline-block fill-current transition-transform group-hover:translate-x-px group-hover:fill-blue-550 dark:fill-blue-500">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.10329 6.29419C1.73956 6.29419 1.4447 6.60754 1.4447 6.99408C1.4447 7.38062 1.73956 7.69397 2.10329 7.69397L11.6993 7.69397L8.27358 11.3345C8.01639 11.6079 8.01639 12.051 8.27358 12.3243C8.53078 12.5977 8.94777 12.5977 9.20496 12.3243L13.7549 7.489C14.0121 7.21568 14.0121 6.77253 13.7549 6.49921L9.20496 1.66387C8.94777 1.39055 8.53078 1.39055 8.27358 1.66387C8.01639 1.9372 8.01639 2.38035 8.27358 2.65367L11.6992 6.29419L2.10329 6.29419Z"></path>
            </svg>
          </span>
        </a>`
        : ''
    }
  `
}

export interface TvlData {
  date: string
  usd: number
  eth: number
}

// TODO: (chart) implement
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
