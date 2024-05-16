import { setSortingQueryParamsByTabId } from './table/configureSorting'
import { scrollHorizontallyToItem } from './utils/scrollToItem'

interface TabWithContent {
  tab: HTMLAnchorElement
  content: HTMLElement
}

export function configureTabs() {
  const tabs = document.querySelectorAll<HTMLElement>('[data-role=tabs]')

  tabs.forEach(configureTabsNavigation)
}

function configureTabsNavigation(tabNavigation: HTMLElement) {
  const elements = getElements(tabNavigation)
  if (!elements) {
    return
  }
  const { tabsWithContent, overflowingTabsContainer, tabs, underline } =
    elements

  let selectedId = tabs[0].id

  const highlightTab = (tab: HTMLAnchorElement) => {
    tabsWithContent[selectedId].tab.classList.remove(
      'text-pink-900',
      'dark:text-pink-200',
    )
    tab.classList.add('text-pink-900', 'dark:text-pink-200')
  }

  const switchContent = (content: HTMLElement) => {
    tabsWithContent[selectedId].content.classList.add('hidden')
    content.classList.remove('hidden')
  }

  const moveUnderline = (tab: HTMLAnchorElement) => {
    underline.style.left = `${tab.offsetLeft}px`
    underline.style.width = `${tab.clientWidth}px`
  }

  const scrollToItem = (item: HTMLAnchorElement) =>
    scrollHorizontallyToItem({
      item,
      overflowingContainer: overflowingTabsContainer,
    })

  const onTabClick = (id: string) => {
    const { tab, content } = tabsWithContent[id]

    switchContent(content)
    highlightTab(tab)
    moveUnderline(tab)
    scrollToItem(tab)
    selectedId = id
  }

  const onResize = () => {
    const { tab } = tabsWithContent[selectedId]
    moveUnderline(tab)
  }

  onTabClick(selectedId)
  if (window.location.hash) {
    onTabClick(window.location.hash.slice(1))
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault()
      history.replaceState({}, '', tab.href)
      onTabClick(tab.id)
      setSortingQueryParamsByTabId(tab.id)
    })
  })

  window.addEventListener('resize', onResize)
}

function getElements(tabNavigation: HTMLElement) {
  const overflowingTabsContainer = tabNavigation.querySelector<HTMLElement>(
    '[data-role=overflow-wrapper-content]',
  )
  const underline = tabNavigation.querySelector<HTMLElement>(
    '[data-role=tabs-underline]',
  )

  const tabs = Array.from(
    overflowingTabsContainer?.querySelectorAll<HTMLAnchorElement>(
      '[data-role=tabs-item]',
    ) ?? [],
  )

  if (!underline || !overflowingTabsContainer || tabs.length === 0) {
    return
  }
  const tabsWithContent: Record<string, TabWithContent> = {}

  tabs.forEach((tab) => {
    const content = tabNavigation.querySelector<HTMLElement>(
      `#${tab.id}[data-role=tabs-content]`,
    )

    if (!content)
      throw new Error(
        `No content found for tab with id ${tab.id} in tab navigation`,
      )

    tabsWithContent[tab.id] = {
      tab,
      content,
    }
  })

  return {
    overflowingTabsContainer,
    tabs,
    underline,
    tabsWithContent,
  }
}
