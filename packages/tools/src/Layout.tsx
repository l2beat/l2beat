import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="flex h-full w-full">
      <div className="w-[200px] p-4">
        <ul>
          <li>
            <p className="mb-4 font-bold">tools.l2beat.com</p>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                clsx('font-mono underline', isActive && 'text-orange-500')
              }
              to="/decoder"
            >
              /decoder
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                clsx('font-mono underline', isActive && 'text-orange-500')
              }
              to="/simulator"
            >
              /simulator
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-full flex-1 overflow-scroll">
        <Outlet />
      </div>
    </div>
  )
}
