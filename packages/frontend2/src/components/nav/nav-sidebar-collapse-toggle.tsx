'use client'

import NavCollapseIcon from '~/icons/nav-collapse.svg'

function onToggle() {
  window.localStorage.setItem(
    'l2beat-sidenav-collapsed',
    window.localStorage.getItem('l2beat-sidenav-collapsed') === 'true'
      ? 'false'
      : 'true',
  )

  if (document.documentElement.classList.contains('sidenav-collapsed')) {
    document.documentElement.classList.remove('sidenav-collapsed')
  } else {
    document.documentElement.classList.add('sidenav-collapsed')
  }
}

export function NavSideBarCollapseToggle() {
  return (
    <button className="cursor-pointer select-none text-2xl" onClick={onToggle}>
      <NavCollapseIcon className="stroke-[#525C6A] sidenav-collapsed:rotate-180 dark:stroke-[#D3D5D9]" />
    </button>
  )
}
