// IMPORTNAT NOTE: If you change something here, please visit configureSidenav in packages/frontend/src/scripts/configureSidenav.ts
// and make sure that it is consistent with this function.

export function initializeNavWrapper() {
  const saved = localStorage.getItem('l2beat-sidenav-collapsed')

  if (saved === 'true') {
    document.documentElement.classList.add('sidenav-collapsed')
  } else {
    document.documentElement.classList.remove('sidenav-collapsed')
  }
}
