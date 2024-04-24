import { DESKTOP_PROJECT_NAVIGATION_IDS } from '../../pages/project/components/ids'
import { makeQuery } from '../query'

export function getDesktopElements() {
  const { $, $$ } = makeQuery(document.body)
  const container = $.maybe<HTMLElement>(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.container}`,
  )
  const list = $.maybe(`#${DESKTOP_PROJECT_NAVIGATION_IDS.list}`)
  const listHeader = $.maybe(`#${DESKTOP_PROJECT_NAVIGATION_IDS.listHeader}`)
  const summaryItem = $.maybe<HTMLAnchorElement>(
    `a#${DESKTOP_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const sections = $$('section')

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
  const { $, $$ } = makeQuery(document.body)
  const container = $.maybe(`[data-role=overflow-wrapper]`)
  const content = $.maybe('[data-role=overflow-wrapper-content]')
  const summaryItem = $.maybe<HTMLAnchorElement>(
    '[data-role=mobile-project-navigation-summary-item]',
  )
  const sections = $$('section')
  if (!container || !content || !summaryItem) {
    return
  }

  return {
    content,
    summaryItem,
    sections,
  }
}
