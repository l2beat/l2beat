export function configureTabNavigations() {
  const tabNavigations =
    document.querySelectorAll<HTMLElement>('.TabNavigation')

  tabNavigations.forEach(configureTabNavigation)
}

function configureTabNavigation(tabNavigation: HTMLElement) {
  const tabsContainers = tabNavigation.querySelector<HTMLElement>(
    '.TabNavigationTabsContainer',
  )
  const underline = tabNavigation.querySelector<HTMLElement>(
    '.TabNavigationUnderline',
  )
  const content = tabNavigation.querySelector<HTMLElement>(
    '.TabNavigationContent',
  )
  const tabs = Array.from(
    tabsContainers?.querySelectorAll<HTMLAnchorElement>('.TabNavigationTab') ??
      [],
  )

  if (!underline || !tabsContainers || !content || tabs.length === 0) return
  let currentTab =
    tabs.find((tab) => tab.href.endsWith(window.location.hash)) ?? tabs[0]

  const highlightTab = (tab: HTMLAnchorElement) => {
    if (!tab.dataset.content) throw new Error('Tab content not found')
    content.innerHTML = tab.dataset.content
    underline.style.left = `${tab.offsetLeft}px`
    underline.style.width = `${tab.clientWidth}px`
    currentTab = tab
  }

  highlightTab(currentTab)

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault()
      history.pushState({}, '', tab.href)
      highlightTab(tab)
    })
  })

  window.addEventListener('resize', () => highlightTab(currentTab))
}
