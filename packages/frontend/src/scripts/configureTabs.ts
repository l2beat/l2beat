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
  const tabs = tabsContainers.querySelectorAll<HTMLElement>('.TabNavigationTab')

  content.innerHTML = tabs[0].dataset.content || ''
  underline.style.left = `${tabs[0].offsetLeft}px`
  underline.style.width = `${tabs[0].clientWidth}px`

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      content.innerHTML = tab.dataset.content || ''
      underline.style.left = `${tab.offsetLeft}px`
      underline.style.width = `${tab.clientWidth}px`
    })
  })
}
