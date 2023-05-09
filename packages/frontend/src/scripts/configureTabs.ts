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

  if (!underline || !tabsContainers || !content) return
  const tabs = Array.from(
    tabsContainers.querySelectorAll<HTMLAnchorElement>('.TabNavigationTab'),
  )
  const preselectedTab =
    tabs.find((tab) => tab.href.endsWith(window.location.hash)) ?? tabs[0]

  content.innerHTML = preselectedTab.dataset.content || ''
  underline.style.left = `${preselectedTab.offsetLeft}px`
  underline.style.width = `${preselectedTab.clientWidth}px`

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      content.innerHTML = tab.dataset.content || ''
      underline.style.left = `${tab.offsetLeft}px`
      underline.style.width = `${tab.clientWidth}px`
    })
  })
}
