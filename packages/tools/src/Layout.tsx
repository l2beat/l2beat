import clsx from 'clsx'
import { Link, NavLink, Outlet } from 'react-router'

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
          <li>
            <NavLink
              className={({ isActive }) =>
                clsx('font-mono underline', isActive && 'text-orange-500')
              }
              to="/discolupe"
            >
              /discolupe
            </NavLink>
          </li>
          <li>
            <Link className="font-mono underline" to="/logo-generator">
              /logo-generator
            </Link>
          </li>
          <li>
            <Link
              className="font-mono underline"
              to="https://protocolbeat.l2beat.com/"
            >
              /protocol-beat
            </Link>
          </li>
          <li>
            <Link className="font-mono underline" to="https://uops.l2beat.com/">
              /uops-analyzer
            </Link>
          </li>
        </ul>
      </div>
      <div className="h-full flex-1 overflow-scroll">
        <Outlet />
      </div>
    </div>
  )
}
