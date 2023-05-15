interface TabWithContent {
  tab: HTMLAnchorElement
  content: HTMLElement
}

export function configureTabs() {
  const tabs = document.querySelectorAll<HTMLElement>('.Tabs')

  tabs.forEach(configureTabsNavigation)
}

function configureTabsNavigation(tabNavigation: HTMLElement) {
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
    '.TabsItemsContainer',
  )
  const underline = tabNavigation.querySelector<HTMLElement>('.TabsUnderline')

  const tabs = Array.from(
    tabsContainers?.querySelectorAll<HTMLAnchorElement>('.TabsItem') ?? [],
  )

  if (!underline || !tabsContainers || tabs.length === 0) {
    return
  }
  const tabsWithContent: Record<string, TabWithContent> = {}

  tabs.forEach((tab) => {
    const content = tabNavigation.querySelector<HTMLElement>(
      `#${tab.id}.TabsContent`,
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
    tabs,
    underline,
    tabsWithContent,
  }
}
