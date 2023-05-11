interface TabWithContent {
  tab: HTMLAnchorElement
  content: HTMLElement
}

export function configureTabNavigations() {
  const tabNavigations =
    document.querySelectorAll<HTMLElement>('.TabNavigation')

  tabNavigations.forEach(configureTabNavigation)
}

function configureTabNavigation(tabNavigation: HTMLElement) {
  const elements = getElements(tabNavigation)
  if (!elements) {
    return
  }
  const { tabsWithContent, tabs, underline } = elements

  let selectedId =
    tabs.find((tab) => tab.href.endsWith(window.location.hash))?.id ??
    tabs[0].id

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

  const onTabClick = (id: string) => {
    const { tab, content } = tabsWithContent[id]

    switchContent(content)
    highlightTab(tab)
    moveUnderline(tab)
    selectedId = id
  }

  const onResize = () => {
    const { tab } = tabsWithContent[selectedId]
    moveUnderline(tab)
  }

  onTabClick(selectedId)

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault()
      history.pushState({}, '', tab.href)
      onTabClick(tab.id)
    })
  })

  window.addEventListener('resize', onResize)
}

function getElements(tabNavigation: HTMLElement) {
  const tabsContainers = tabNavigation.querySelector<HTMLElement>(
    '.TabNavigationTabsContainer',
  )
  const underline = tabNavigation.querySelector<HTMLElement>(
    '.TabNavigationUnderline',
  )

  const tabs = Array.from(
    tabsContainers?.querySelectorAll<HTMLAnchorElement>('.TabNavigationTab') ??
      [],
  )

  if (!underline || !tabsContainers || tabs.length === 0) {
    return
  }

  const tabsWithContent = tabs.reduce<Record<string, TabWithContent>>(
    (prev, val) => {
      const content = tabNavigation.querySelector<HTMLElement>(
        `#${val.id}.TabNavigationContent`,
      )

      if (!content)
        throw new Error(
          `No content found for tab with id ${val.id} in tab navigation`,
        )

      prev[val.id] = {
        tab: val,
        content: content,
      }
      return prev
    },
    {},
  )

  return {
    tabs,
    underline,
    tabsWithContent,
  }
}
