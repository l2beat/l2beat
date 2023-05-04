import {
  DESKTOP_PROJECT_NAVIGATION_IDS,
  MOBILE_PROJECT_NAVIGATION_IDS,
} from '../../components/project/navigation/ids'

export function getDesktopElements() {
  const container = document.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.container}`,
  )
  const list = container?.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.list}`,
  )
  const listHeader = container?.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.listHeader}`,
  )
  const summaryItem = list?.querySelector<HTMLAnchorElement>(
    `a#${DESKTOP_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const sections = document.querySelectorAll('section')

  if (!container || !list || !listHeader || !summaryItem) {
    return
  }

  return {
    container,
    list,
    listHeader,
    summaryItem,
    sections,
  }
}

export function getMobileElements() {
  const container = document.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.container}`,
  )
  const list = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
  )
  const summaryItem = container?.querySelector<HTMLAnchorElement>(
    `a#${MOBILE_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const arrowLeft = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowLeft}`,
  )
  const arrowRight = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowRight}`,
  )

  const sections = document.querySelectorAll('section')

  if (!container || !list || !summaryItem || !arrowLeft || !arrowRight) {
    return
  }

  return {
    list,
    summaryItem,
    arrowLeft,
    arrowRight,
    sections,
  }
}
