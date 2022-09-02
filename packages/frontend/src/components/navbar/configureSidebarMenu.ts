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
    sidebarMenu?.classList.remove('hidden')
    sidebarMenuShadow?.classList.remove('hidden')
    document.body.classList.add('w-screen', 'h-screen', 'overflow-hidden')
  }

  function closeMenu() {
    sidebarMenu?.classList.add('hidden')
    sidebarMenuShadow?.classList.add('hidden')
    document.body.classList.remove('w-screen', 'h-screen', 'overflow-hidden')
  }
}
