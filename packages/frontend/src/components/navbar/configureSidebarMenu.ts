export function configureSidebarMenu() {
  document
    .querySelector('#sidebar-menu-open')
    ?.addEventListener('click', openMenu)
  document
    .querySelector('#sidebar-menu-close')
    ?.addEventListener('click', closeMenu)

  const sidebarMenu = document.querySelector('#sidebar-menu')
  const sidebarMenuShadow = document.querySelector('#sidebar-menu-shadow')

  sidebarMenuShadow?.addEventListener('click', closeMenu)

  function openMenu() {
    sidebarMenu?.classList.remove('translate-x-full')
    sidebarMenuShadow?.classList.remove('translate-x-full')
    document.body.classList.add('w-screen', 'h-screen', 'overflow-hidden')
  }

  function closeMenu() {
    sidebarMenu?.classList.add('translate-x-full')
    sidebarMenuShadow?.classList.add('translate-x-full')
    document.body.classList.remove('w-screen', 'h-screen', 'overflow-hidden')
  }
}
